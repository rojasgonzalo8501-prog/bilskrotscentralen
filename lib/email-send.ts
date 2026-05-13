/**
 * Resend send wrapper with automatic fallback to onboarding@resend.dev
 * when the configured domain isn't fully verified yet.
 *
 * Resend rejects sends from unverified domains with statusCode 403
 * ("The X.com domain is not verified"). When that happens we retry
 * the same payload from Resend's universal `onboarding@resend.dev`
 * sandbox so the mail still lands. Once the customer's own domain
 * is verified the primary path succeeds and the fallback never fires.
 *
 * The fallback addresses look like
 *   "Bilskrotscentralen <onboarding@resend.dev>"
 * — keeping the friendly name so the recipient still sees who it's
 * from in their inbox.
 */

import { Resend } from "resend";

export type SendInput = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  bcc?: string | string[];
  replyTo?: string;
};

export type SendResult =
  | { ok: true; id?: string; usedFallback: boolean }
  | { ok: false; error: string };

const FALLBACK_ADDRESS = "onboarding@resend.dev";

function withFallbackFrom(from: string): string {
  // Preserve the "Display Name" portion if present:
  //   "Bilskrotscentralen <noreply@bilskrotscentralen.com>"  →
  //   "Bilskrotscentralen <onboarding@resend.dev>"
  const match = from.match(/^(.*<)[^>]+(>)$/);
  if (match) return `${match[1]}${FALLBACK_ADDRESS}${match[2]}`;
  return FALLBACK_ADDRESS;
}

function isDomainNotVerified(err: unknown): boolean {
  if (!err) return false;
  const blob = typeof err === "string" ? err : JSON.stringify(err);
  // Don't retry on:
  //   - testing-mode restrictions (account hasn't verified any domain yet
  //     — retrying with resend.dev still fails because the recipient
  //     isn't the account owner). Wastes rate-limit budget.
  //   - rate limit (obviously)
  if (/you can only send testing emails/i.test(blob)) return false;
  if (/rate_limit_exceeded/i.test(blob)) return false;
  return /domain is not verified|not verified|validation_error/i.test(blob);
}

/**
 * Send an email through Resend with automatic onboarding@resend.dev
 * fallback. Caller doesn't need to know about the retry.
 */
export async function sendEmail(input: SendInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not set" };
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send(input);
    if (!error) return { ok: true, id: data?.id, usedFallback: false };

    if (isDomainNotVerified(error)) {
      const fallbackFrom = withFallbackFrom(input.from);
      console.warn(
        `[email-send] primary domain not verified — retrying from ${fallbackFrom}`
      );
      const retry = await resend.emails.send({ ...input, from: fallbackFrom });
      if (retry.error) {
        return { ok: false, error: JSON.stringify(retry.error) };
      }
      return { ok: true, id: retry.data?.id, usedFallback: true };
    }

    return { ok: false, error: JSON.stringify(error) };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
