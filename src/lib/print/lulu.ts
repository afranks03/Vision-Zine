/**
 * Minimal Lulu xPress API client. Just what we need for Phase 4d:
 *   - OAuth client-credentials grant
 *   - POST /print-jobs/ to create a print order
 *   - GET /print-jobs/{id}/ to inspect status (used by future status webhook)
 *
 * Docs: https://api.lulu.com/docs/
 *
 * Credentials: dashboard at lulu.com → Developer Portal → Client Keys.
 * In sandbox mode set:
 *   LULU_CLIENT_KEY=...
 *   LULU_CLIENT_SECRET=...
 *   LULU_API_BASE=https://api.sandbox.lulu.com
 * In production:
 *   LULU_API_BASE=https://api.lulu.com
 */

import type { ZineFormat } from '@/lib/supabase/types';

const TOKEN_CACHE = new Map<string, { token: string; expiresAt: number }>();

/** Build a Lulu API base URL with no trailing slash. */
function getBase(): string {
  const base = process.env.LULU_API_BASE || 'https://api.sandbox.lulu.com';
  return base.replace(/\/+$/, '');
}

function assertCreds(): { clientKey: string; clientSecret: string } {
  const clientKey = process.env.LULU_CLIENT_KEY;
  const clientSecret = process.env.LULU_CLIENT_SECRET;
  if (!clientKey || !clientSecret) {
    throw new Error(
      'Lulu credentials missing. Set LULU_CLIENT_KEY and LULU_CLIENT_SECRET ' +
        'from lulu.com → Developer Portal → Client Keys. Use sandbox keys for now.',
    );
  }
  return { clientKey, clientSecret };
}

/**
 * Fetch (and cache) an OAuth access token via client_credentials grant.
 * Lulu tokens last ~1 hour; we re-fetch when within 60s of expiry.
 */
async function getAccessToken(): Promise<string> {
  const { clientKey, clientSecret } = assertCreds();
  const cacheKey = `${getBase()}|${clientKey}`;
  const now = Date.now();
  const cached = TOKEN_CACHE.get(cacheKey);
  if (cached && cached.expiresAt - now > 60_000) {
    return cached.token;
  }

  const credentials = Buffer.from(`${clientKey}:${clientSecret}`).toString('base64');
  const res = await fetch(`${getBase()}/auth/realms/glasstree/protocol/openid-connect/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Lulu token exchange failed (${res.status}): ${body}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  TOKEN_CACHE.set(cacheKey, {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  });
  return data.access_token;
}

/**
 * Map our zine format → a Lulu pod_package_id. Verified against the
 * sandbox catalog via scripts/lulu-probe.mjs on 2026-05-17:
 *
 *   letter (8.5×11)  → 0850X1100BWSTDPB060UW444MXX  · $10.69 unit cost
 *   pocket (4.25×6.875, Mass Market Paperback)
 *                    → 0425X0687BWSTDPB060UW444MXX  · $10.04 unit cost
 *
 * Code-letter decoder:
 *   <TrimWxH><Color><Quality><Binding><Paper><Cover>
 *   BW = B&W · STD = standard · PB = perfect-bound paperback
 *   060UW444M = 60# uncoated white paper, 444 LPI matte · XX = no cover finish
 *
 * Tabloid (11×17) is intentionally absent — Lulu doesn't carry that size.
 * If we later add a large-format print partner (Blurb, MagCloud), that
 * lives in its own module; this map stays Lulu-only.
 */
const POD_PACKAGE_BY_FORMAT: Record<ZineFormat, string> = {
  letter: '0850X1100BWSTDPB060UW444MXX',
  pocket: '0425X0687BWSTDPB060UW444MXX',
};

export function podPackageIdFor(format: ZineFormat): string {
  return process.env.LULU_POD_PACKAGE_OVERRIDE || POD_PACKAGE_BY_FORMAT[format];
}

/* --------------------------------------------------------------------------
 * print-jobs
 * -------------------------------------------------------------------------- */

export interface LuluShippingAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state_code?: string; // required for US, CA
  postcode: string;
  country_code: string; // ISO 3166-1 alpha-2
  phone_number: string;
}

export interface SubmitPrintJobInput {
  externalId: string; // our print_orders.id
  contactEmail: string;
  podPackageId: string;
  /** Human-readable line-item title. Lulu requires this — it's surfaced
   *  on shipping paperwork and in their admin dashboard. We pass the
   *  zine's title through from pipeline.ts. */
  title: string;
  /** PDF source URL — must be reachable by Lulu (signed URL OK) */
  interiorPdfUrl: string;
  interiorPdfMd5: string;
  /** Cover PDF source URL — for magazine SKUs we send the same PDF as
   *  both interior and cover. */
  coverPdfUrl: string;
  coverPdfMd5: string;
  quantity: number;
  shipping: LuluShippingAddress;
  /** "MAIL" / "PRIORITY_MAIL" / "GROUND_HD" / etc. — see Lulu docs. */
  shippingLevel?: string;
}

export interface LuluPrintJobResponse {
  id: number;
  status: { name: string; messages: Record<string, string> | null };
  external_id: string;
  line_items?: unknown[];
  shipping_address?: unknown;
  estimated_shipping_dates?: { dispatch_min?: string; dispatch_max?: string };
}

export async function submitPrintJob(input: SubmitPrintJobInput): Promise<LuluPrintJobResponse> {
  const token = await getAccessToken();
  const body = {
    contact_email: input.contactEmail,
    external_id: input.externalId,
    line_items: [
      {
        external_id: `${input.externalId}-line-1`,
        title: input.title,
        printable_normalization: {
          cover: {
            source_url: input.coverPdfUrl,
            source_md5sum: input.coverPdfMd5,
          },
          interior: {
            source_url: input.interiorPdfUrl,
            source_md5sum: input.interiorPdfMd5,
          },
          pod_package_id: input.podPackageId,
        },
        quantity: input.quantity,
      },
    ],
    shipping_address: input.shipping,
    shipping_level: input.shippingLevel ?? 'MAIL',
  };

  const res = await fetch(`${getBase()}/print-jobs/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Lulu print-job submit failed (${res.status}): ${errBody}`);
  }
  return (await res.json()) as LuluPrintJobResponse;
}

export async function getPrintJob(id: number | string): Promise<LuluPrintJobResponse> {
  const token = await getAccessToken();
  const res = await fetch(`${getBase()}/print-jobs/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Lulu print-job fetch failed (${res.status}): ${errBody}`);
  }
  return (await res.json()) as LuluPrintJobResponse;
}
