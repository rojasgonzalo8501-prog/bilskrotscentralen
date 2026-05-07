/**
 * Password-reset tokens — HMAC-signed, single-use, no DB writes.
 *
 * Token shape (base64url):
 *   <userId>.<expiresAtMs>.<hmac>
 *
 * The HMAC is over `userId|expiresAt|passwordHash` — including the
 * CURRENT password hash means the moment the user resets their
 * password, every token previously issued for them becomes invalid
 * (because the hash is part of the signed payload). That gives us
 * single-use tokens without persisting them.
 *
 * Default lifetime: 60 minutes. Long enough to handle email delivery
 * delays, short enough to limit damage if a reset email is exposed.
 */

import { createHmac, timingSafeEqual } from "crypto";

const RESET_TTL_MS = 60 * 60 * 1000; // 60 min

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var is not set");
  return s;
}

function base64url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf-8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  return Buffer.from(pad ? padded + "=".repeat(4 - pad) : padded, "base64").toString("utf-8");
}

function sign(parts: string): Buffer {
  return createHmac("sha256", getSecret()).update(parts).digest();
}

export function buildResetToken(opts: {
  userId: string;
  passwordHash: string;
  ttlMs?: number;
}): string {
  const expires = Date.now() + (opts.ttlMs ?? RESET_TTL_MS);
  const payload = `${opts.userId}|${expires}|${opts.passwordHash}`;
  const mac = base64url(sign(payload).subarray(0, 16));
  return [
    base64url(opts.userId),
    expires.toString(36),
    mac,
  ].join(".");
}

export type DecodedReset =
  | { ok: true; userId: string }
  | { ok: false; reason: "malformed" | "expired" | "invalid" };

export function verifyResetToken(token: string, currentPasswordHash: string): DecodedReset {
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed" };

  let userId: string;
  let expires: number;
  try {
    userId = fromBase64url(parts[0]);
    expires = parseInt(parts[1], 36);
    if (!userId || !Number.isFinite(expires)) {
      return { ok: false, reason: "malformed" };
    }
  } catch {
    return { ok: false, reason: "malformed" };
  }

  if (Date.now() > expires) return { ok: false, reason: "expired" };

  const expected = sign(`${userId}|${expires}|${currentPasswordHash}`).subarray(0, 16);
  let provided: Buffer;
  try {
    provided = Buffer.from(parts[2].replace(/-/g, "+").replace(/_/g, "/"), "base64");
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (provided.length !== expected.length) return { ok: false, reason: "invalid" };
  if (!timingSafeEqual(provided, expected)) return { ok: false, reason: "invalid" };

  return { ok: true, userId };
}
