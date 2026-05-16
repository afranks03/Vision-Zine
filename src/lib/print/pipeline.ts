/**
 * Background print pipeline. Triggered from the Stripe webhook after a
 * checkout completes with `print` in the chosen outputs.
 *
 * Steps:
 *   1. Insert a print_orders row with status='pending'
 *   2. Render the zine to a PDF (lib/pdf/render.ts)
 *   3. Upload the PDF to Supabase Storage (lib/storage/zine-pdf.ts)
 *   4. Submit a Lulu print job (lib/print/lulu.ts)
 *   5. Update print_orders with lulu_print_job_id + status='submitted'
 *
 * Errors at any step update print_orders.status = 'failed' with a
 * status_detail. Admin can manually retry by clearing the failed row and
 * re-running.
 *
 * Run order is sequential and synchronous; the caller should fire-and-
 * forget via `waitUntil()` or accept the latency. ~30–60s per order.
 */

import { buildPdfFilename, renderZineToPdf } from '@/lib/pdf/render';
import { podPackageIdFor, submitPrintJob, type LuluShippingAddress } from '@/lib/print/lulu';
import { uploadZinePdf } from '@/lib/storage/zine-pdf';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PrintOrderStatus, ZineRow } from '@/lib/supabase/types';

export interface KickoffPrintInput {
  zineId: string;
  userId: string;
  stripeSessionId: string;
  contactEmail: string;
  /** Stripe-shaped shipping address (we map to Lulu's shape internally). */
  stripeShipping: {
    name: string;
    address: {
      line1: string;
      line2?: string | null;
      city: string;
      state?: string | null;
      postal_code: string;
      country: string;
    };
    phone?: string;
  };
  /** The site origin (https://vision-zine.vercel.app) — used to build
   *  the public /z/[id] URL the headless renderer can fetch without
   *  auth. The zine must be publicly visible for this to work; we
   *  temporarily publish it during render if needed. */
  origin: string;
}

export async function kickoffPrintOrder(input: KickoffPrintInput): Promise<void> {
  const admin = createAdminClient();

  // 1. Create the print_orders row up front so we have somewhere to
  //    write status updates as we go.
  const { data: orderRow, error: insertErr } = await admin
    .from('print_orders')
    .insert({
      zine_id: input.zineId,
      user_id: input.userId,
      stripe_session_id: input.stripeSessionId,
      shipping_address: input.stripeShipping,
      status: 'pending',
    })
    .select('id')
    .single();
  if (insertErr || !orderRow) {
    console.error('[print pipeline] failed to insert print_orders row', insertErr);
    return;
  }
  const orderId = (orderRow as { id: string }).id;

  const setStatus = async (
    status: PrintOrderStatus,
    fields: Partial<{
      status_detail: string;
      lulu_print_job_id: string;
      cover_pdf_url: string;
      cover_pdf_md5: string;
      pod_package_id: string;
    }> = {},
  ) => {
    await admin
      .from('print_orders')
      .update({ status, ...fields })
      .eq('id', orderId);
  };

  try {
    // 2. Fetch the zine. We need format + title + is_published.
    const { data: zineData, error: zineErr } = await admin
      .from('zines')
      .select('*')
      .eq('id', input.zineId)
      .single();
    if (zineErr || !zineData) {
      throw new Error(`Zine not found: ${zineErr?.message ?? 'no row'}`);
    }
    const zine = zineData as ZineRow;

    // 3. Temporarily publish (if not already) so the headless renderer can
    //    fetch /z/[id] without auth. Restore the previous flag at the end.
    const wasPublished = zine.is_published;
    if (!wasPublished) {
      await admin.from('zines').update({ is_published: true }).eq('id', input.zineId);
    }

    let pdfBuffer: Buffer;
    try {
      await setStatus('rendering');
      const previewUrl = `${input.origin}/z/${input.zineId}`;
      pdfBuffer = await renderZineToPdf({
        previewUrl,
        format: zine.format,
        cookies: [],
      });
    } finally {
      // Restore previous publish state regardless of render success.
      if (!wasPublished) {
        await admin.from('zines').update({ is_published: false }).eq('id', input.zineId);
      }
    }

    // 4. Upload to Storage and mint a signed URL.
    await setStatus('uploading');
    const filename = buildPdfFilename(zine);
    const uploaded = await uploadZinePdf(input.zineId, pdfBuffer, filename);

    // 5. Submit to Lulu.
    const podPackageId = podPackageIdFor(zine.format);
    const shipping: LuluShippingAddress = {
      name: input.stripeShipping.name,
      street1: input.stripeShipping.address.line1,
      street2: input.stripeShipping.address.line2 ?? undefined,
      city: input.stripeShipping.address.city,
      state_code: input.stripeShipping.address.state ?? undefined,
      postcode: input.stripeShipping.address.postal_code,
      country_code: input.stripeShipping.address.country,
      phone_number: input.stripeShipping.phone || '0000000000',
    };

    const luluJob = await submitPrintJob({
      externalId: orderId,
      contactEmail: input.contactEmail,
      podPackageId,
      // Lulu requires a title on every line item — use the zine's title,
      // falling back to a generic label if a draft has no title set yet.
      title: zine.title?.trim() || 'Vision Zine',
      interiorPdfUrl: uploaded.signedUrl,
      interiorPdfMd5: uploaded.md5,
      // For saddle-stitch SKUs Lulu accepts the same PDF as both
      // interior and cover. If we add hardcover SKUs later, split them.
      coverPdfUrl: uploaded.signedUrl,
      coverPdfMd5: uploaded.md5,
      quantity: 1,
      shipping,
    });

    await setStatus('submitted', {
      lulu_print_job_id: String(luluJob.id),
      cover_pdf_url: uploaded.signedUrl,
      cover_pdf_md5: uploaded.md5,
      pod_package_id: podPackageId,
    });

    console.log('[print pipeline] order submitted to Lulu', {
      orderId,
      luluId: luluJob.id,
      zineId: input.zineId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[print pipeline] failed', { orderId, error: message });
    await setStatus('failed', { status_detail: message });
  }
}
