/**
 * TOTP — Time-based One-Time Password (RFC 6238).
 *
 * Compatible with Google Authenticator, Authy, 1Password, Microsoft
 * Authenticator, etc. Built on Node's `crypto` so we don't take an
 * npm dependency.
 *
 * Uses the standard:
 *   - SHA-1 HMAC
 *   - 6-digit codes
 *   - 30-second period
 *
 * Verification accepts ±1 step (so a 30s-old or 30s-future code still
 * passes) to forgive small clock drift between phone and server.
 */

import { createHmac, randomBytes } from "crypto";

const PERIOD = 30;        // seconds per code
const DIGITS = 6;
const ALGO = "sha1";
const TOLERANCE = 1;      // ±1 step

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/* ───────── base32 (RFC 4648) — used by every authenticator app ───────── */

export function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    out += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  // No padding — Google Authenticator handles unpadded fine
  return out;
}

export function base32Decode(input: string): Buffer {
  const cleaned = input.replace(/=+$/, "").toUpperCase().replace(/\s+/g, "");
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const ch of cleaned) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx < 0) throw new Error("Invalid base32 character");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/* ───────── secret generation ───────── */

/** Generate a fresh 20-byte secret, base32 encoded. */
export function generateSecret(): string {
  return base32Encode(randomBytes(20));
}

/* ───────── code generation + verification ───────── */

function hotp(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  // 64-bit big-endian counter
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter & 0xffffffff, 4);

  const digest = createHmac(ALGO, key).update(buf).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);
  const mod = code % 10 ** DIGITS;
  return mod.toString().padStart(DIGITS, "0");
}

/** Get the current 30-second TOTP code for a secret. Useful for tests/admin. */
export function generateTotp(secret: string, when: number = Date.now()): string {
  return hotp(secret, Math.floor(when / 1000 / PERIOD));
}

/**
 * Verify a user-supplied 6-digit code against the secret.
 * Accepts the previous, current, and next time-step to handle clock drift.
 * Constant-time comparison — never short-circuits on a mismatch.
 */
export function verifyTotp(
  token: string,
  secret: string,
  when: number = Date.now()
): boolean {
  const cleaned = token.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleaned)) return false;
  const counter = Math.floor(when / 1000 / PERIOD);

  // Walk all candidates without short-circuiting so timing reveals nothing.
  let matched = false;
  for (let drift = -TOLERANCE; drift <= TOLERANCE; drift++) {
    const expected = hotp(secret, counter + drift);
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ cleaned.charCodeAt(i);
    }
    if (diff === 0) matched = true;
  }
  return matched;
}

/* ───────── otpauth:// URL for QR code ───────── */

/**
 * Build the otpauth URL that authenticator apps scan from a QR.
 * Format: otpauth://totp/<label>?secret=<base32>&issuer=<name>&algorithm=SHA1&digits=6&period=30
 */
export function otpauthUrl(opts: {
  secret: string;
  /** What the app shows under "Account" — typically the user's email or username */
  account: string;
  /** What the app shows as the issuer — i.e. the brand */
  issuer: string;
}): string {
  const label = encodeURIComponent(`${opts.issuer}:${opts.account}`);
  const params = new URLSearchParams({
    secret: opts.secret,
    issuer: opts.issuer,
    algorithm: "SHA1",
    digits: String(DIGITS),
    period: String(PERIOD),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

/**
 * Convenience: a Google Charts QR-code URL for the otpauth URL.
 * Renders 200×200 PNG. Free, no auth, no setup.
 *
 * If you'd rather not depend on chart.googleapis.com, use any
 * authenticator app's manual-entry mode (the secret string).
 */
export function qrCodeUrl(otpauth: string, size = 200): string {
  const data = encodeURIComponent(otpauth);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
}
