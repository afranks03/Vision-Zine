/**
 * Print confirmation — sent when the Lulu print pipeline successfully
 * submits the order. Bridges the gap between "we got your payment"
 * (payment-receipt) and "your package shipped" (shipped — Phase 5d).
 *
 * The user already got a receipt; this is the "your file made it to
 * the press" confirmation, with an estimate of when to expect shipment.
 */
import { EmailBody, EmailButton, EmailHeadline, EmailLayout, EmailMetaRow } from './_layout';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-zine.vercel.app';

export interface PrintConfirmationProps {
  zineTitle: string;
  zineId: string;
  /** Our internal print_orders.id — used in support replies. */
  orderId: string;
  /** Lulu-side identifier; surfaced for reference. */
  luluPrintJobId: string;
  /** ISO date string for low end of dispatch range, or undefined. */
  dispatchEstimate?: string;
  /** Shipping recipient name. */
  shipToName: string;
  /** Single-line shipping address summary: "Brooklyn, NY 11201, US". */
  shipToCity: string;
}

export function PrintConfirmationEmail(props: PrintConfirmationProps) {
  const dispatchLabel = props.dispatchEstimate
    ? new Date(props.dispatchEstimate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })
    : 'within 3–5 business days';

  return (
    <EmailLayout preview={`${props.zineTitle} is at the press.`} eyebrow="In production">
      <EmailHeadline>
        <em>Your issue</em> is at the press.
      </EmailHeadline>

      <EmailBody>
        <strong>{props.zineTitle}</strong> has been handed off to the printer. You&rsquo;ll receive
        a tracking link as soon as it ships.
      </EmailBody>

      <EmailMetaRow
        items={[
          { label: 'Issue', value: props.zineTitle },
          { label: 'Order', value: `#${props.orderId.slice(0, 8)}` },
          { label: 'Press ID', value: props.luluPrintJobId },
          { label: 'Ship to', value: `${props.shipToName} · ${props.shipToCity}` },
          { label: 'Expected', value: `Dispatch ${dispatchLabel}` },
        ]}
      />

      <EmailButton href={`${SITE}/app`} label="View your dashboard" />

      <EmailBody>
        Magazines are printed on demand. Once it ships, expect 3–7 business days for domestic
        delivery, 7–14 international. Reply to this email if anything needs to change.
      </EmailBody>
    </EmailLayout>
  );
}
