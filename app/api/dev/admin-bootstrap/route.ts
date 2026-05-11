/**
 * One-shot admin password reset — no SQL console needed.
 *
 * Hit:
 *   GET /api/dev/admin-bootstrap?key=<BOOTSTRAP_KEY>&user=<username>&pw=<new-password>
 *
 * The endpoint is gated by an env var BOOTSTRAP_KEY. If the env var
 * isn't set the endpoint returns 404 — making it safe to leave in
 * the codebase. To use:
 *
 *   1. Vercel → Settings → Environment Variables
 *      Add  BOOTSTRAP_KEY = <random 20+ char string>
 *      Redeploy.
 *   2. Visit the URL with the key + username + password in the query.
 *   3. Login with the new password.
 *   4. REMOVE the BOOTSTRAP_KEY env var so the endpoint becomes inert.
 *
 * Also lets you set the email + flip active=true in one shot so a
 * locked-out admin can recover even if multiple fields are off.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const expected = process.env.BOOTSTRAP_KEY;
  if (!expected) {
    // Endpoint is inert until the env var is explicitly set.
    return new NextResponse("Not found", { status: 404 });
  }

  const key = req.nextUrl.searchParams.get("key") ?? "";
  if (key !== expected) {
    return NextResponse.json({ ok: false, reason: "wrong-key" }, { status: 401 });
  }

  const username = (req.nextUrl.searchParams.get("user") ?? "").trim().toLowerCase();
  const password = req.nextUrl.searchParams.get("pw") ?? "";
  const email = (req.nextUrl.searchParams.get("email") ?? "").trim().toLowerCase();

  if (!username || password.length < 8) {
    return NextResponse.json(
      { ok: false, reason: "bad-input", hint: "Behöver ?user=<username>&pw=<minst 8 tecken>" },
      { status: 400 }
    );
  }

  // Find by case-insensitive username — handle stored "Gonzalo" etc.
  const user = await db.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: { id: true, username: true, role: true, active: true, email: true },
  });

  if (!user) {
    // List existing users so the caller can see what's actually there.
    const all = await db.user.findMany({
      select: { username: true, role: true, active: true },
      take: 20,
    });
    return NextResponse.json(
      { ok: false, reason: "user-not-found", lookingFor: username, existingUsers: all },
      { status: 404 }
    );
  }

  const passwordHash = await hashPassword(password);
  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      active: true,
      ...(email && email.includes("@") ? { email } : {}),
    },
    select: {
      username: true,
      email: true,
      role: true,
      active: true,
    },
  });

  return NextResponse.json({
    ok: true,
    note: "Logga in nu. Ta sedan bort BOOTSTRAP_KEY från Vercel env vars.",
    user: updated,
  });
}
