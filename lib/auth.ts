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

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var is not set");
  return s;
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** Validate credentials against the User table. */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<Session | null> {
  const u = username.trim().toLowerCase();
  const user = await db.user.findUnique({ where: { username: u } });
  if (!user || !user.active) return null;

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  const roleMap: Record<string, Role> = {
    SUPERADMIN: "superadmin",
    ADMIN: "admin",
    CUSTOMER: "customer",
  };

  return {
    userId: user.id,
    username: user.username,
    role: roleMap[user.role] ?? "customer",
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
