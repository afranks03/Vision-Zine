import Link from 'next/link';
import { BulletDot, Eyebrow, HairlineRule, Meta } from '@/components/editorial';

const PRODUCT_LINKS = [
  { href: '/examples', label: 'Examples' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/about#contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/terms', label: 'Terms' },
];

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-vz-ink text-vz-cream mt-auto">
      <HairlineRule className="bg-vz-cream/30" />
      <div className="vz-container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand block */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-display inline-block text-3xl leading-none"
              aria-label="Vision Zine — home"
            >
              Vision <em className="text-vz-yellow">Zine</em>
            </Link>
            <p className="vz-prose text-vz-cream/85 max-w-xs text-base">
              Editorial-quality vision boards, printed. The story of your year on real paper.
            </p>
          </div>

          {/* Product */}
          <FooterColumn label="Product" links={PRODUCT_LINKS} />
          {/* Company */}
          <FooterColumn label="Company" links={COMPANY_LINKS} />
          {/* Legal */}
          <FooterColumn label="Legal" links={LEGAL_LINKS} />
        </div>

        <HairlineRule className="bg-vz-cream/30 my-10" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Meta className="flex flex-wrap items-center gap-2.5">
            <span>© {year} Vision Zine</span>
            <BulletDot className="text-vz-cream/50" />
            <span>Brooklyn × Athens</span>
            <BulletDot className="text-vz-cream/50" />
            <span>Issue I</span>
          </Meta>
          <Meta className="text-vz-yellow">All output is yours — your name on the cover.</Meta>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <Eyebrow className="text-vz-yellow mb-3">{label}</Eyebrow>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-serif text-vz-cream hover:text-vz-yellow text-[15px] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
