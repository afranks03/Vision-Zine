/**
 * Shared editorial email shell. Every transactional template wraps its
 * content in <EmailLayout>. Keeps the brand voice consistent across
 * welcome, receipt, and lifecycle messages.
 *
 * Design choices that match the web app:
 *   - DM Serif Display for the kicker headline (loaded from Google
 *     Fonts CSS — gracefully falls back to Georgia in Outlook/clients
 *     that block remote fonts)
 *   - Cream paper background, deep ink text
 *   - No rounded corners — hard rectangles, editorial slabs
 *   - Small caps eyebrow + hairline rules for separators
 *
 * Width: 560px (the react-email default that renders well on Gmail,
 * Outlook, Apple Mail, and mobile).
 */
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { ReactNode } from 'react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-zine.vercel.app';

const ink = '#0a0a0a';
const cream = '#f5efdd';
const paper = '#faf6e9';
const coral = '#e8584c';

export function EmailLayout({
  preview,
  eyebrow,
  children,
}: {
  /** The short snippet that appears in the inbox preview pane. */
  preview: string;
  /** The small caps label at the top — e.g. "WELCOME", "RECEIPT". */
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <Html>
      <Head>
        {/* Email templates render server-side via react-email; the Next.js
            "use next/font" rule doesn't apply here — recipients' mail
            clients evaluate this <link> at view time. Most clients
            (Outlook, Gmail web) ignore web fonts safely and fall back to
            our Georgia / system stack below. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Serif+4:wght@400;500&family=Archivo:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: paper,
          color: ink,
          fontFamily: '"Source Serif 4", Georgia, serif',
          margin: 0,
          padding: '32px 0',
        }}
      >
        <Container
          style={{
            width: '560px',
            maxWidth: '100%',
            backgroundColor: cream,
            border: `1px solid ${ink}`,
            padding: '40px 36px',
          }}
        >
          <Section>
            <Text
              style={{
                fontFamily: '"Archivo", system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: coral,
                margin: 0,
              }}
            >
              Vision Zine · {eyebrow}
            </Text>
            <Hr
              style={{
                borderTop: `2px solid ${ink}`,
                margin: '18px 0 28px',
              }}
            />
          </Section>

          {children}

          <Hr
            style={{
              borderTop: `1px solid ${ink}`,
              margin: '40px 0 20px',
            }}
          />
          <Section>
            <Text
              style={{
                fontFamily: '"Archivo", system-ui, sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: ink,
                margin: 0,
              }}
            >
              Vision Zine · Brooklyn × Athens
            </Text>
            <Text
              style={{
                fontFamily: '"Source Serif 4", Georgia, serif',
                fontSize: '12px',
                color: `${ink}99`,
                margin: '8px 0 0',
                lineHeight: 1.5,
              }}
            >
              You are receiving this because you started an issue at{' '}
              <Link href={SITE} style={{ color: coral, textDecoration: 'none' }}>
                vision-zine.com
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/** Editorial display-serif headline. Matches the in-app `font-display`. */
export function EmailHeadline({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: '"DM Serif Display", Georgia, serif',
        fontSize: '40px',
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        color: ink,
        margin: '0 0 20px',
        fontWeight: 400,
      }}
    >
      {children}
    </Text>
  );
}

/** Body paragraph. */
export function EmailBody({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: '"Source Serif 4", Georgia, serif',
        fontSize: '16px',
        lineHeight: 1.55,
        color: ink,
        margin: '0 0 18px',
      }}
    >
      {children}
    </Text>
  );
}

/**
 * Editorial CTA — slab button, ink background, yellow text. No
 * rounded corners. Matches the in-app "Start Issue" buttons.
 */
export function EmailButton({ href, label }: { href: string; label: string }) {
  return (
    <Section style={{ margin: '12px 0 8px' }}>
      <Link
        href={href}
        style={{
          display: 'inline-block',
          backgroundColor: ink,
          color: '#ffd629',
          fontFamily: '"Archivo", system-ui, sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          padding: '14px 22px',
          border: `1px solid ${ink}`,
        }}
      >
        {label}
      </Link>
    </Section>
  );
}

/** A small caps meta row — used for receipt details and metadata. */
export function EmailMetaRow({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <Section
      style={{
        backgroundColor: paper,
        border: `1px solid ${ink}`,
        padding: '18px 22px',
        margin: '8px 0 24px',
      }}
    >
      {items.map((item) => (
        <Text
          key={item.label}
          style={{
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontSize: '14px',
            lineHeight: 1.5,
            color: ink,
            margin: '0',
            paddingBottom: '6px',
          }}
        >
          <span
            style={{
              fontFamily: '"Archivo", system-ui, sans-serif',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: `${ink}99`,
              display: 'inline-block',
              minWidth: '110px',
            }}
          >
            {item.label}
          </span>
          {item.value}
        </Text>
      ))}
    </Section>
  );
}
