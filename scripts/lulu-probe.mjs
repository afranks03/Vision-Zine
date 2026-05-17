/**
 * Lulu pod_package_id probe.
 *
 * Reads LULU_* vars from .env.local, fetches an OAuth token, then hits
 * POST /print-job-cost-calculations/ with a list of candidate pod_package_ids
 * to find which are valid for the sandbox catalog. Reports green/red per SKU.
 *
 * Run:  node scripts/lulu-probe.mjs
 * Add a SKU:  push another row into CANDIDATES below.
 *
 * The trick we exploit: cost-calculations validates the pod_package_id
 * synchronously before doing any pricing math, so we get an Invalid
 * pod_package_id 400 immediately on bad SKUs. Good SKUs return a price
 * (or error for some other reason like shipping/page count, which we
 * also treat as "SKU itself is valid").
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ---- env loader (no dotenv dep — keep this script standalone) ---- */
function loadEnv(path) {
  try {
    const raw = readFileSync(path, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* file missing is fine */
  }
}
loadEnv(join(__dirname, '..', '.env.local'));

const CLIENT_KEY = process.env.LULU_CLIENT_KEY;
const CLIENT_SECRET = process.env.LULU_CLIENT_SECRET;
const BASE = (process.env.LULU_API_BASE || 'https://api.sandbox.lulu.com').replace(/\/+$/, '');

if (!CLIENT_KEY || !CLIENT_SECRET) {
  console.error('LULU_CLIENT_KEY / LULU_CLIENT_SECRET missing from .env.local');
  process.exit(1);
}

/* ---- candidate SKUs ---- */
/**
 * Each row is { label, pod_package_id, pageCount }.
 *
 * pod_package_id format (per Lulu docs):
 *   <TrimWxH><Color><Quality><Binding><Paper><CoverFinish>
 *   Color: BW | FC | PC | PR (B&W, full color, premium color, premium)
 *   Quality: STD | PRE
 *   Binding: PB (perfect-bound paperback), CW (coil), CB (case bound),
 *            LW (linen wrap), SW (saddle stitch)
 *   Paper: 060UW444M (60# uncoated white), 080CW (80# coated white), etc.
 *   Cover: MNG (matte gloss), GLN (gloss), MXX (none/printed cover), etc.
 *
 * Letter, tabloid, pocket — we probe several variants because Lulu's
 * sandbox catalog only carries specific combinations. We start with
 * common known-valid SKUs from their pricing-calculator outputs.
 */
const CANDIDATES = [
  // ---- Letter (8.5 × 11) — known good options ----
  { label: 'letter · PB B&W 60# matte cover',  sku: '0850X1100BWSTDPB060UW444MXX', pages: 32 },
  { label: 'letter · PB FC 60# gloss cover',   sku: '0850X1100FCSTDPB060UW444GXX', pages: 32 },
  { label: 'letter · PB FC 60# matte cover',   sku: '0850X1100FCSTDPB060UW444MXX', pages: 32 },

  // ---- Pocket replacement — try Lulu's actual small-book sizes ----
  // Mass Market Paperback 4.25 × 6.875
  { label: 'pocket · 4.25×6.875 PB B&W',       sku: '0425X0687BWSTDPB060UW444MXX', pages: 32 },
  { label: 'pocket · 4.25×6.875 PB FC matte',  sku: '0425X0687FCSTDPB060UW444MXX', pages: 32 },
  // A5 5.06 × 7.81
  { label: 'pocket · A5 5.06×7.81 PB B&W',     sku: '0506X0781BWSTDPB060UW444MXX', pages: 32 },
  // Digest 5.5 × 8.5 (US Trade)
  { label: 'pocket · 5.5×8.5 PB B&W',          sku: '0550X0850BWSTDPB060UW444MXX', pages: 32 },
  { label: 'pocket · 5.5×8.5 PB FC matte',     sku: '0550X0850FCSTDPB060UW444MXX', pages: 32 },
  // 5 × 8
  { label: 'pocket · 5×8 PB B&W',              sku: '0500X0800BWSTDPB060UW444MXX', pages: 32 },
  // 6 × 9 (US Trade Larger)
  { label: 'pocket · 6×9 PB B&W',              sku: '0600X0900BWSTDPB060UW444MXX', pages: 32 },

  // ---- Tabloid replacement — try Lulu's actual large sizes ----
  // 8.5 × 11 is already letter; trying larger options
  // A4 8.27 × 11.69
  { label: 'tabloid · A4 8.27×11.69 PB B&W',   sku: '0827X1169BWSTDPB060UW444MXX', pages: 32 },
  // Comic 8 × 10
  { label: 'tabloid · 8×10 PB B&W',            sku: '0800X1000BWSTDPB060UW444MXX', pages: 32 },
  // Square 8.5 × 8.5
  { label: 'tabloid · sq 8.5×8.5 PB B&W',      sku: '0850X0850BWSTDPB060UW444MXX', pages: 32 },
  // 8.25 × 10.75
  { label: 'tabloid · 8.25×10.75 PB B&W',      sku: '0825X1075BWSTDPB060UW444MXX', pages: 32 },
];

/* ---- token fetch ---- */
async function getToken() {
  const creds = Buffer.from(`${CLIENT_KEY}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${BASE}/auth/realms/glasstree/protocol/openid-connect/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Lulu token failed (${res.status}): ${body}`);
  }
  const j = await res.json();
  return j.access_token;
}

/* ---- probe one SKU ---- */
async function probe(token, c) {
  const body = {
    line_items: [
      {
        page_count: c.pages,
        pod_package_id: c.sku,
        quantity: 1,
      },
    ],
    shipping_address: {
      city: 'Brooklyn',
      country_code: 'US',
      name: 'Probe',
      phone_number: '5555555555',
      postcode: '11201',
      state_code: 'NY',
      street1: '123 Main St',
    },
    shipping_option: 'MAIL',
  };

  const res = await fetch(`${BASE}/print-job-cost-calculations/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, text };
}

/* ---- main ---- */
(async () => {
  const token = await getToken();
  console.log(`Token OK. Probing ${CANDIDATES.length} candidate SKU(s) against ${BASE}\n`);

  const valid = [];
  for (const c of CANDIDATES) {
    const { status, text } = await probe(token, c);
    const isInvalidSku = /Invalid pod_package_id/i.test(text);
    const isOk = status >= 200 && status < 300;

    if (isOk) {
      const j = JSON.parse(text);
      const cost = j.total_cost_incl_tax || j.line_item_costs?.[0]?.total_cost_incl_tax || '—';
      console.log(`✅  ${c.label}`);
      console.log(`    ${c.sku}   →  cost ${cost}`);
      valid.push({ label: c.label, sku: c.sku, cost });
    } else if (isInvalidSku) {
      console.log(`❌  ${c.label}`);
      console.log(`    ${c.sku}   →  Invalid SKU`);
    } else {
      // Some other 400 — usually means the SKU itself is fine but
      // some other field (page count, shipping) is off. Surface the
      // first ~120 chars so we can see.
      const snippet = text.slice(0, 200).replace(/\s+/g, ' ');
      console.log(`⚠️   ${c.label}`);
      console.log(`    ${c.sku}   →  ${status}: ${snippet}`);
      // Likely-valid SKU; treat as a tentative pass.
      if (status === 400 && /page_count|shipping|invalid|required/i.test(text)) {
        valid.push({ label: c.label, sku: c.sku, note: 'SKU valid but other field issue' });
      }
    }
    // Brief pause to be kind to the API.
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log('\n----- valid SKUs -----');
  for (const v of valid) {
    console.log(`  ${v.sku}  · ${v.label}  · ${v.cost ?? v.note}`);
  }
  if (valid.length === 0) {
    console.log('  (none — try different size/binding combinations)');
  }
})();
