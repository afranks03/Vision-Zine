import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, HeavyRule, MetaRow, StatusPill } from '@/components/editorial';
import { createClient } from '@/lib/supabase/server';
import type { PrintOrderRow, PrintOrderStatus, ZineRow, ZineStatus } from '@/lib/supabase/types';
import { ZineActionsMenu } from './zine-actions-menu';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your zines.',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Two parallel queries: the user's zines, and the user's print_orders.
  // We merge them client-side so each zine row knows its latest print
  // status (the dashboard pill reflects both). Cheaper than a JOIN we'd
  // have to type by hand and easier to reason about with small N.
  const [zinesRes, ordersRes] = await Promise.all([
    supabase.from('zines').select('*').order('issue_number', { ascending: false }),
    supabase
      .from('print_orders')
      .select('*')
      .order('created_at', { ascending: false }),
  ]);

  const allZines = (zinesRes.data ?? []) as ZineRow[];
  const allOrders = (ordersRes.data ?? []) as PrintOrderRow[];

  // Latest print order per zine_id (orders already sorted desc).
  const latestOrderByZine = new Map<string, PrintOrderRow>();
  for (const order of allOrders) {
    if (!latestOrderByZine.has(order.zine_id)) latestOrderByZine.set(order.zine_id, order);
  }

  // Hide archived from the default list; we'll add a filter toggle later.
  const visible = allZines.filter((z) => z.status !== 'archived');
  const archivedCount = allZines.length - visible.length;
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-zine.vercel.app';

  return (
    <div className="vz-container vz-section">
      <MetaRow
        className="mb-7"
        items={[
          <span key="d">Dashboard</span>,
          <span key="i">Issue index</span>,
          ...(archivedCount > 0
            ? [
                <span key="a" className="text-vz-ink/50">
                  {archivedCount} archived
                </span>,
              ]
            : []),
        ]}
      />
      <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
        <h1
          className="font-display leading-[0.9] font-normal tracking-[-0.02em]"
          style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}
        >
          {visible.length > 0 ? (
            <>
              Your <em>zines</em>.
            </>
          ) : (
            <>
              Your <em>archive</em> is empty.
            </>
          )}
        </h1>
        <Link
          href="/app/new"
          className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream justify-self-start px-5 py-3.5 transition-colors md:justify-self-end"
        >
          {allZines.length === 0
            ? 'Start Issue I'
            : 'Start Issue ' + romanize(allZines.length + 1)}
        </Link>
      </div>
      <HeavyRule className="mt-6" />

      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <ZineList zines={visible} orders={latestOrderByZine} siteOrigin={siteOrigin} />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-16 grid gap-8 md:grid-cols-[1fr_1fr] md:gap-16">
      <div>
        <Eyebrow className="text-vz-coral">First time here</Eyebrow>
        <p
          className="font-display mt-5 leading-[1.05]"
          style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
        >
          A zine is a finished issue of a magazine — your magazine. About your year, your work, your
          goals. <em>Editorial-quality, real paper.</em>
        </p>
      </div>
      <ol className="space-y-5">
        <Step n="1" label="Pick a style and a size">
          Six editorial templates. Three formats. We compose; you decide the framing.
        </Step>
        <Step n="2" label="Answer thoughtful prompts">
          Personal, vision, achievements, goals, daily code. Save anytime, come back anytime.
        </Step>
        <Step n="3" label="Receive your zine">
          A print-ready PDF, a shareable web edition, social crops, and an optional printed copy
          delivered to your door.
        </Step>
      </ol>
    </div>
  );
}

function Step({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <li className="border-vz-ink grid grid-cols-[40px_1fr] gap-4 border-t pt-4">
      <span className="font-display text-3xl leading-[0.9]">{n}</span>
      <div>
        <Eyebrow>{label}</Eyebrow>
        <p className="vz-prose mt-2 text-base">{children}</p>
      </div>
    </li>
  );
}

function ZineList({
  zines,
  orders,
  siteOrigin,
}: {
  zines: ZineRow[];
  orders: Map<string, PrintOrderRow>;
  siteOrigin: string;
}) {
  return (
    <ul className="mt-10 grid gap-0">
      {zines.map((zine, i) => {
        const order = orders.get(zine.id);
        const display = computeDisplayStatus(zine.status, order?.status);
        return (
          <li
            key={zine.id}
            className={
              (i === 0 ? 'border-vz-ink border-t' : 'border-vz-ink border-t-0') +
              ' hover:bg-vz-cream border-vz-ink group relative border-b transition-colors'
            }
          >
            {/* Whole-row click target. Sits beneath the relative children
                so the kebab menu and status pill stay independently
                interactive. */}
            <Link
              href={`/app/zines/${zine.id}`}
              aria-label={`Edit ${zine.title || `Issue ${romanize(zine.issue_number)}`}`}
              className="absolute inset-0 z-0"
            />
            {/* Content overlay: pointer-events-none on the container so
                the whole-row Link below catches clicks; interactive
                children (kebab, tracking link) opt back in via
                pointer-events-auto. */}
            <div className="pointer-events-none relative z-10 flex flex-col gap-4 px-1 py-7 sm:flex-row sm:items-end sm:gap-8">
              <span className="font-display text-6xl leading-[0.85] tracking-[-0.02em]">
                {romanize(zine.issue_number)}
              </span>
              <div className="flex-1">
                <h2 className="font-display text-3xl leading-[0.95]">
                  {zine.title || `Issue ${romanize(zine.issue_number)}`}
                </h2>
                <MetaRow
                  className="text-vz-ink/80 mt-2.5"
                  items={[
                    <span key="s">{labelStyle(zine.style)}</span>,
                    <span key="f">{labelFormat(zine.format)}</span>,
                    <span key="d">{formatDate(zine.updated_at)}</span>,
                  ]}
                />
                {order && <PrintOrderLine order={order} />}
              </div>
              <div className="flex items-center gap-3">
                <StatusPill tone={display.tone}>{display.label}</StatusPill>
                <div className="pointer-events-auto">
                  <ZineActionsMenu
                    zineId={zine.id}
                    isArchived={zine.status === 'archived'}
                    siteOrigin={siteOrigin}
                  />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function PrintOrderLine({ order }: { order: PrintOrderRow }) {
  const label = labelPrintOrderStatus(order.status);
  const shortId = order.id.slice(0, 8);
  return (
    <div className="vz-meta text-vz-ink/60 mt-2 flex flex-wrap items-center gap-2.5">
      <span>Order #{shortId}</span>
      <span aria-hidden>·</span>
      <span>{label}</span>
      {order.tracking_url && (
        <>
          <span aria-hidden>·</span>
          <a
            href={order.tracking_url}
            target="_blank"
            rel="noreferrer"
            className="text-vz-coral hover:text-vz-ink pointer-events-auto underline-offset-2 hover:underline"
          >
            Track shipment
          </a>
        </>
      )}
      {order.status === 'failed' && order.status_detail && (
        <span
          className="text-vz-coral"
          title={order.status_detail}
        >
          (error — hover for detail)
        </span>
      )}
    </div>
  );
}

// ---- display-status mapping ----

interface DisplayStatus {
  label: string;
  tone: 'neutral' | 'draft' | 'paid' | 'in_progress' | 'success' | 'warning' | 'muted';
}

/**
 * Merge zine.status and the latest print_order.status into a single
 * display state. Print order status (if present) takes precedence for
 * paid zines, since it's a more granular truth.
 */
function computeDisplayStatus(
  zineStatus: ZineStatus,
  printStatus: PrintOrderStatus | undefined,
): DisplayStatus {
  if (zineStatus === 'archived') return { label: 'Archived', tone: 'muted' };
  if (zineStatus === 'draft') return { label: 'Draft', tone: 'draft' };

  // Once paid, defer to the print pipeline for the granular state.
  if (printStatus === 'shipped' || printStatus === 'delivered') {
    return { label: printStatus === 'delivered' ? 'Delivered' : 'Shipped', tone: 'success' };
  }
  if (printStatus === 'in_production' || printStatus === 'submitted') {
    return { label: 'Printing', tone: 'in_progress' };
  }
  if (printStatus === 'failed') return { label: 'Print failed', tone: 'warning' };
  if (printStatus === 'rendering' || printStatus === 'uploading' || printStatus === 'pending') {
    return { label: 'Preparing', tone: 'in_progress' };
  }

  // Paid, no print order (digital-only) or order not yet recorded.
  if (zineStatus === 'paid') return { label: 'Paid', tone: 'paid' };
  if (zineStatus === 'generating') return { label: 'Generating', tone: 'in_progress' };
  if (zineStatus === 'printed') return { label: 'Printed', tone: 'success' };
  return { label: zineStatus, tone: 'neutral' };
}

// ---- helpers ----

function romanize(n: number): string {
  const map: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let out = '';
  let remaining = n;
  for (const [value, numeral] of map) {
    while (remaining >= value) {
      out += numeral;
      remaining -= value;
    }
  }
  return out || 'I';
}

function labelStyle(s: string) {
  return (
    (
      {
        editorial: 'Editorial',
        lifestyle: 'Lifestyle',
        fashion: 'Fashion',
        art_catalog: 'Art Catalog',
        travel: 'Travel',
        financial: 'Financial',
      } as Record<string, string>
    )[s] ?? s
  );
}

function labelFormat(f: string) {
  return (
    ({ letter: 'Letter', pocket: 'Pocket' } as Record<string, string>)[f] ?? f
  );
}

function labelPrintOrderStatus(s: PrintOrderStatus) {
  return (
    (
      {
        pending: 'Queued',
        rendering: 'Rendering PDF',
        uploading: 'Uploading',
        submitted: 'Submitted to printer',
        in_production: 'In production',
        shipped: 'Shipped',
        delivered: 'Delivered',
        failed: 'Failed',
      } as Record<PrintOrderStatus, string>
    )[s] ?? s
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
