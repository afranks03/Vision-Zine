import Script from 'next/script';

/**
 * Plausible analytics (Phase 5e). Lightweight, privacy-respecting
 * page-view tracking — no cookies, no personal data, no cross-site
 * profiles. The script renders only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 * is set, so dev / unwired previews stay quiet.
 *
 * Configure at plausible.io → Add Site → use your prod hostname
 * (e.g., vision-zine.vercel.app or visionzine.com) as the domain.
 * Then set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to that same hostname in
 * Vercel Production env.
 */
export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
