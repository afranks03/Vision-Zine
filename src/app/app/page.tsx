import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, HeavyRule, MetaRow } from '@/components/editorial';
import { createClient } from '@/lib/supabase/server';
import type { ZineRow } from '@/lib/supabase/types';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your zines.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: zines } = await supabase
    .from('zines')
    .select('*')
    .order('issue_number', { ascending: false });

  const list = (zines ?? []) as ZineRow[];

  return (
    <div className="vz-container vz-section">
      <MetaRow
        className="mb-7"
        items={[<span key="d">Dashboard</span>, <span key="i">Issue index</span>]}
      />
      <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
        <h1
          className="font-display font-normal leading-[0.9] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}
        >
          {list.length > 0 ? <>Your <em>zines</em>.</> : <>Your <em>archive</em> is empty.</>}
        </h1>
        <Link
          href="/app/new"
          className="vz-eyebrow bg-vz-ink text-vz-yellow hover:bg-vz-coral hover:text-vz-cream justify-self-start px-5 py-3.5 transition-colors md:justify-self-end"
        >
          {list.length > 0 ? 'Start Issue ' + romanize(list.length + 1) : 'Start Issue I'}
        </Link>
      </div>
      <HeavyRule className="mt-6" />

      {list.length === 0 ? <EmptyState /> : <ZineList zines={list} />}
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
          A zine is a finished issue of a magazine — your magazine. About your year, your
          work, your goals. <em>Editorial-quality, real paper.</em>
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
          A print-ready PDF, a shareable web edition, social crops, and an optional printed
          copy delivered to your door.
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

function ZineList({ zines }: { zines: ZineRow[] }) {
  return (
    <ul className="mt-10 grid gap-0">
      {zines.map((zine, i) => (
        <li
          key={zine.id}
          className={i === 0 ? 'border-vz-ink border-t' : 'border-vz-ink border-t-0'}
        >
          <Link
            href={`/app/zines/${zine.id}`}
            className="hover:bg-vz-cream group border-vz-ink flex flex-col gap-4 border-b px-1 py-7 transition-colors sm:flex-row sm:items-end sm:gap-8"
          >
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
                  <span key="st">{labelStatus(zine.status)}</span>,
                  <span key="d">{formatDate(zine.updated_at)}</span>,
                ]}
              />
            </div>
            <span className="vz-eyebrow text-vz-coral group-hover:translate-x-1 transition-transform">
              Edit →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ---- helpers ----

function romanize(n: number): string {
  const map: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
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
  return ({
    editorial: 'Editorial',
    lifestyle: 'Lifestyle',
    fashion: 'Fashion',
    art_catalog: 'Art Catalog',
    travel: 'Travel',
    financial: 'Financial',
  } as Record<string, string>)[s] ?? s;
}

function labelFormat(f: string) {
  return ({ letter: 'Letter', tabloid: 'Tabloid', pocket: 'Pocket' } as Record<string, string>)[f] ?? f;
}

function labelStatus(s: string) {
  return ({
    draft: 'Draft',
    paid: 'Paid',
    generating: 'Generating',
    printed: 'Printed',
    archived: 'Archived',
  } as Record<string, string>)[s] ?? s;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
