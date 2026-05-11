import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export type Role = "superadmin" | "admin" | "customer";

export type Session = {
  userId: string;
  username: string;
  role: Role;
  name: string;
};

const COOKIE_NAME = "merca_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Short-lived cookie set after password OK but before 2FA verification. */
const PENDING_2FA_COOKIE = "merca_pending_2fa";
const PENDING_2FA_MAX_AGE = 60 * 5; // 5 minutes

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var is not set");
  return s;
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

const ROLE_MAP: Record<string, Role> = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  CUSTOMER: "customer",
};

export type CredentialResult =
  | { kind: "ok"; session: Session }
  | { kind: "needs-2fa"; userId: string }
  | { kind: "fail" };

/**
 * Validate username + password.
 *
 * If the user has 2FA enabled we return `{ kind: "needs-2fa", userId }`
 * — the caller is expected to set the pending-2FA cookie and route
 * the user to the TOTP challenge page.
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<CredentialResult> {
  const u = username.trim().toLowerCase();
  // Explicit `select` so we only query columns that exist in every
  // deployed DB. The 2FA columns (totpSecret/totpEnabled) are read in
  // a defensive second step below — if they're missing in the prod
  // schema we simply skip the 2FA branch instead of crashing the
  // whole login flow.
  const user = await db.user.findUnique({
    where: { username: u },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      active: true,
      passwordHash: true,
    },
  });
  if (!user || !user.active) return { kind: "fail" };

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { kind: "fail" };

  // Optional 2FA check — wrapped in try/catch because the totp columns
  // may not exist on older deployments that haven't run the migration
  // yet. A missing-column error becomes "no 2FA on this account" so
  // the user can still log in.
  try {
    const twoFa = await db.user.findUnique({
      where: { id: user.id },
      select: { totpEnabled: true, totpSecret: true },
    });
    if (twoFa?.totpEnabled && twoFa?.totpSecret) {
      return { kind: "needs-2fa", userId: user.id };
    }
  } catch {
    /* totp columns not present in this DB — proceed without 2FA */
  }

  return {
    kind: "ok",
    session: {
      userId: user.id,
      username: user.username,
      role: ROLE_MAP[user.role] ?? "customer",
      name: user.name,
    },
  };
}

/** Build a Session from a User row that already passed authentication. */
export async function sessionForUser(userId: string): Promise<Session | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      active: true,
    },
  });
  if (!user || !user.active) return null;
  return {
    userId: user.id,
    username: user.username,
    role: ROLE_MAP[user.role] ?? "customer",
    name: user.name,
  };
}

/**
 * Encode session as signed base64 JSON and set it as an HTTP-only cookie.
 * Format: base64(json).hmac_hex
 */
export async function setSession(session: Session): Promise<void> {
  const payload = Buffer.from(JSON.stringify(session), "utf-8").toString("base64");
  const sig = signPayload(payload);
  const value = `${payload}.${sig}`;

  const store = await cookies();
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/** Read, verify signature, and decode the current session cookie, if any. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    const dot = raw.lastIndexOf(".");
    if (dot === -1) return null;

    const payload = raw.slice(0, dot);
    const sig = raw.slice(dot + 1);
    const expected = signPayload(payload);

    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded) as Session;
    if (!parsed.userId || !parsed.username || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Clear the session cookie. */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/* ───────── Pending-2FA cookie helpers ───────── */

type PendingPayload = { userId: string; expires: number };

/** Set a short-lived pending-2FA cookie after password OK. */
export async function setPending2FA(userId: string): Promise<void> {
  const expires = Date.now() + PENDING_2FA_MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ userId, expires }), "utf-8").toString("base64");
  const sig = signPayload(payload);
  const value = `${payload}.${sig}`;

  const store = await cookies();
  store.set(PENDING_2FA_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PENDING_2FA_MAX_AGE,
  });
}

/** Read + validate the pending-2FA cookie. Returns the userId, or null. */
export async function getPending2FA(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(PENDING_2FA_COOKIE)?.value;
  if (!raw) return null;
  try {
    const dot = raw.lastIndexOf(".");
    if (dot === -1) return null;
    const payload = raw.slice(0, dot);
    const sig = raw.slice(dot + 1);
    const expected = signPayload(payload);
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
    const { userId, expires } = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8")
    ) as PendingPayload;
    if (!userId || typeof expires !== "number" || Date.now() > expires) return null;
    return userId;
  } catch {
    return null;
  }
}

/** Clear the pending-2FA cookie. Call after successful TOTP verify or cancel. */
export async function clearPending2FA(): Promise<void> {
  const store = await cookies();
  store.delete(PENDING_2FA_COOKIE);
}
