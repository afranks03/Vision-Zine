/**
 * Payment receipt — sent immediately after a Stripe checkout completes.
 * Confirms what was paid for and (if print was selected) what happens next.
 *
 * We pass through the human-readable description and the dollar amount
 * from the Stripe session so we don't have to hit Stripe again at send
 * time.
 */
import {
  EmailBody,
  EmailButton,
  EmailHeadline,
  EmailLayout,
  EmailMetaRow,
} from './_layout';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-zine.vercel.app';

export interface PaymentReceiptProps {
  zineTitle: string;
  zineId: string;
  /** "$24.00" — already formatted with currency. */
  amountPaid: string;
  /** Comma-separated list of outputs the user purchased: "digital, print". */
  outputsList: string;
  /** True when 'print' was in the chosen outputs. We add a "what happens
   *  next" line for the print pipeline so users aren't surprised by the
   *  email cascade that follows. */
  includesPrint: boolean;
  /** Last 4 of the card, for the receipt block. Optional. */
  cardLast4?: string;
  /** ISO timestamp; we format it client-side. */
  paidAt: string;
}

export function PaymentReceiptEmail(props: PaymentReceiptProps) {
  const date = new Date(props.paidAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <EmailLayout preview={`Receipt for ${props.zineTitle}.`} eyebrow="Receipt">
      <EmailHeadline>
        Payment received. <em>Thank you.</em>
      </EmailHeadline>

      <EmailBody>
        We&rsquo;ve marked <strong>{props.zineTitle}</strong> as paid and we&rsquo;re generating
        the outputs you chose.
      </EmailBody>

      <EmailMetaRow
        items={[
          { label: 'Issue', value: props.zineTitle },
          { label: 'Outputs', value: props.outputsList },
          { label: 'Amount', value: props.amountPaid },
          ...(props.cardLast4 ? [{ label: 'Card', value: `•••• ${props.cardLast4}` }] : []),
          { label: 'Date', value: date },
        ]}
      />

      <EmailButton href={`${SITE}/app/zines/${props.zineId}/preview`} label="Open the preview" />

      {props.includesPrint && (
        <EmailBody>
          A printed copy is queued. You&rsquo;ll receive a separate confirmation as soon as the
          press has it, and another when it ships.
        </EmailBody>
      )}
    </EmailLayout>
  );
}
