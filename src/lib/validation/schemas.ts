/**
 * Shared Zod schemas (Phase 6a). Centralize input shapes so every
 * API route is parsed against a typed contract instead of `as Foo`
 * casts. When a schema fails, the route returns a 400 with a
 * field-keyed message — surfaced to the user where possible.
 *
 * Pattern: each schema is the input contract for one route. The
 * route uses `schema.safeParse(body)` and returns the formatted
 * error on failure.
 */
import { z } from 'zod';

/* ---- AI route input (all four /api/ai/* routes) ---- */

export const aiStreamRequestSchema = z.object({
  raw_input: z
    .string({ message: 'raw_input is required.' })
    .min(1, 'Write something before asking the assistant.')
    .max(8000, 'Trim the input to 8,000 characters or fewer.'),
  display_name: z.string().max(120).optional(),
});

export type AIStreamRequest = z.infer<typeof aiStreamRequestSchema>;

/* ---- Cover upload form fields (multipart) ---- */
// The File is validated by route logic (Content-Type allowlist +
// size cap); this schema covers any non-file fields we might add
// later. Kept here so the route doesn't drift from the contract.
export const coverUploadFormSchema = z.object({
  // Currently only `file` is expected. Reserve for future fields
  // (alt-text, focal hint, etc.).
});

/* ---- Helpers ---- */

/**
 * Turn a ZodError into a single user-facing string. Picks the first
 * issue (priority to required-field errors) since most form / JSON
 * routes care about presenting one message at a time.
 */
export function formatZodError(error: z.ZodError): string {
  const first = error.issues[0];
  if (!first) return 'Invalid input.';
  if (first.path.length > 0) {
    return `${first.path.join('.')}: ${first.message}`;
  }
  return first.message;
}
