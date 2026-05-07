/**
 * HMAC-signed access token for guest order tracking.
 *
 * The token is short, URL-safe, and verified server-side — no DB write
 * needed. We sign just the order number with the same SESSION_SECRET
 * the rest of the auth code uses, so tokens revoke automatically if
 * the secret rotates.
 *
 * URL shape: /min-order/<orderNumber>?t=<base64url-hmac>
 *
 * Why not the cuid id? It's 25 chars, ugly in emails, and a database
 * value — leaking it would be worse than leaking the orderNumber + a
 * derived token, since the latter is purpose-bound.
 */

import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var is not set");
  return s;
}

function base64url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  return Buffer.from(pad ? padded + "=".repeat(4 - pad) : padded, "base64");
}

/** Sign an order number → token string suitable for inclusion in a URL. */
export function signOrderToken(orderNumber: string): string {
  const mac = createHmac("sha256", getSecret())
    .update(`order:${orderNumber}`)
    .digest();
  // Truncate to 16 bytes — still 128-bit security, half the URL length.
  return base64url(mac.subarray(0, 16));
}

/** Verify a token against an order number. Constant-time. */
export function verifyOrderToken(orderNumber: string, token: string): boolean {
  if (!orderNumber || !token) return false;
  let provided: Buffer;
  try {
    provided = fromBase64url(token);
  } catch {
    return false;
  }
  const expected = createHmac("sha256", getSecret())
    .update(`order:${orderNumber}`)
    .digest()
    .subarray(0, 16);
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

/** Public tracking URL builder — used in emails. */
export function orderTrackingUrl(
  baseUrl: string,
  orderNumber: string
): string {
  const token = signOrderToken(orderNumber);
  return `${baseUrl.replace(/\/+$/, "")}/min-order/${encodeURIComponent(
    orderNumber
  )}?t=${token}`;
}
