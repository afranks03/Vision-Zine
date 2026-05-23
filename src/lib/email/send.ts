/**
 * Typed `send*()` helpers for every transactional template. Centralizes
 * subject lines, from/bcc handling, and fail-soft logging so caller code
 * stays one-liner clean and never crashes the parent flow on missing env.
 *
 * Pattern: each helper returns a `Sent` result so callers can choose to
 * log or persist, but the email pipeline is treated as best-effort —
 * we never throw out of these into the webhook/auth path.
 */
import { getBccAddress, getFromAddress, getResendClient, isEmailConfigured } from './client';
import { CoauthorInviteEmail, type CoauthorInviteProps } from './templates/coauthor-invite';
import { PaymentReceiptEmail, type PaymentReceiptProps } from './templates/payment-receipt';
import {
  PrintConfirmationEmail,
  type PrintConfirmationProps,
} from './templates/print-confirmation';
import { WelcomeEmail } from './templates/welcome';

export type Sent =
  | { ok: true; id: string }
  | { ok: false; reason: 'no_credentials' | 'send_error'; detail?: string };

interface SendInput {
  to: string;
  subject: string;
  // React component instance; Resend accepts ReactNode directly via
  // their `react` field and renders it server-side.
  react: React.ReactNode;
  /** Idempotency hint Resend will deduplicate on if repeated within
   *  ~24h. We compose these from the source event id where possible
   *  (e.g., Stripe session id) so a webhook retry doesn't double-send. */
  idempotencyKey?: string;
}

async function sendCore(input: SendInput): Promise<Sent> {
  if (!isEmailConfigured()) {
    console.warn('[email] RESEND_API_KEY not set — skipping send', {
      subject: input.subject,
      to: input.to,
    });
    return { ok: false, reason: 'no_credentials' };
  }

  try {
    const client = getResendClient();
    const bcc = getBccAddress();
    const { data, error } = await client.emails.send(
      {
        from: getFromAddress(),
        to: [input.to],
        ...(bcc ? { bcc: [bcc] } : {}),
        subject: input.subject,
        react: input.react,
      },
      input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
    );
    if (error || !data?.id) {
      const detail = error?.message ?? 'Resend returned no id';
      console.error('[email] send failed', { subject: input.subject, detail });
      return { ok: false, reason: 'send_error', detail };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('[email] send threw', { subject: input.subject, detail });
    return { ok: false, reason: 'send_error', detail };
  }
}

/* ---- typed helpers per template ---- */

export async function sendWelcomeEmail(input: { to: string; firstName?: string }): Promise<Sent> {
  return sendCore({
    to: input.to,
    subject: 'Your archive is open',
    react: WelcomeEmail({ firstName: input.firstName }),
    // First-signin emails are inherently first-time so we don't need an
    // idempotency key — but if a user signs in twice within seconds we
    // still want to deduplicate. Keying by email itself does the trick.
    idempotencyKey: `welcome:${input.to}`,
  });
}

export async function sendPaymentReceiptEmail(
  input: { to: string; stripeSessionId: string } & PaymentReceiptProps,
): Promise<Sent> {
  const { to, stripeSessionId, ...templateProps } = input;
  return sendCore({
    to,
    subject: `Receipt for ${templateProps.zineTitle}`,
    react: PaymentReceiptEmail(templateProps),
    idempotencyKey: `receipt:${stripeSessionId}`,
  });
}

export async function sendPrintConfirmationEmail(
  input: { to: string } & PrintConfirmationProps,
): Promise<Sent> {
  const { to, ...templateProps } = input;
  return sendCore({
    to,
    subject: `${templateProps.zineTitle} is at the press`,
    react: PrintConfirmationEmail(templateProps),
    idempotencyKey: `print-confirm:${templateProps.orderId}`,
  });
}

export async function sendCoauthorInviteEmail(
  input: { to: string } & CoauthorInviteProps,
): Promise<Sent> {
  const { to, ...templateProps } = input;
  return sendCore({
    to,
    subject: `${templateProps.inviterName} invited you to co-author ${templateProps.zineTitle}`,
    react: CoauthorInviteEmail(templateProps),
    // Keyed on the invitation token (not the recipient) so a "resend"
    // from the studio bypasses dedup with a fresh row, while the
    // initial send-on-create is idempotent against webhook retries.
    idempotencyKey: `coauthor-invite:${templateProps.token}`,
  });
}
