/**
 * One-shot migration runner for the two outstanding schema changes
 * that haven't been applied to the production Postgres yet:
 *
 *   - 20260505_add_leads  (Lead table + indexes)
 *   - 20260507_add_totp   (totpSecret / totpEnabled / totpVerifiedAt on User)
 *
 * Hit:
 *   GET /api/dev/run-migrations?key=<BOOTSTRAP_KEY>
 *
 * Same gate as /api/dev/admin-bootstrap — inert (404) unless
 * BOOTSTRAP_KEY env var is set. Each statement is idempotent
 * (`ADD COLUMN IF NOT EXISTS` / `CREATE TABLE IF NOT EXISTS`) so
 * you can call it twice without damage.
 *
 * Returns a per-statement status array so you can see exactly which
 * pieces ran and which failed.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Postgres-compatible versions of the two SQLite migration files. Run
// in order — User columns first so the Lead FK constraint resolves.
const STATEMENTS: { label: string; sql: string }[] = [
  {
    label: "User.totpSecret",
    sql: `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpSecret" TEXT`,
  },
  {
    label: "User.totpEnabled",
    sql: `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpEnabled" BOOLEAN NOT NULL DEFAULT false`,
  },
  {
    label: "User.totpVerifiedAt",
    sql: `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpVerifiedAt" TIMESTAMP`,
  },
  {
    label: "Lead table",
    sql: `CREATE TABLE IF NOT EXISTS "Lead" (
      "id"           TEXT NOT NULL PRIMARY KEY,
      "kind"         TEXT NOT NULL DEFAULT 'EFTERSOK',
      "status"       TEXT NOT NULL DEFAULT 'NEW',
      "name"         TEXT NOT NULL,
      "phone"        TEXT NOT NULL,
      "email"        TEXT NOT NULL,
      "regnr"        TEXT,
      "vin"          TEXT,
      "brand"        TEXT,
      "model"        TEXT,
      "year"         TEXT,
      "sku"          TEXT,
      "partName"     TEXT,
      "message"      TEXT NOT NULL,
      "answeredAt"   TIMESTAMP,
      "notes"        TEXT,
      "assignedToId" TEXT,
      "createdAt"    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"    TIMESTAMP NOT NULL,
      CONSTRAINT "Lead_assignedToId_fkey"
        FOREIGN KEY ("assignedToId") REFERENCES "User"("id")
        ON DELETE SET NULL ON UPDATE CASCADE
    )`,
  },
  {
    label: "Lead_status_createdAt_idx",
    sql: `CREATE INDEX IF NOT EXISTS "Lead_status_createdAt_idx" ON "Lead"("status","createdAt")`,
  },
  {
    label: "Lead_kind_idx",
    sql: `CREATE INDEX IF NOT EXISTS "Lead_kind_idx" ON "Lead"("kind")`,
  },
  {
    label: "Lead_assignedToId_idx",
    sql: `CREATE INDEX IF NOT EXISTS "Lead_assignedToId_idx" ON "Lead"("assignedToId")`,
  },
];

export async function GET(req: NextRequest) {
  const expected = process.env.BOOTSTRAP_KEY;
  if (!expected) {
    return new NextResponse("Not found", { status: 404 });
  }
  const key = req.nextUrl.searchParams.get("key") ?? "";
  if (key !== expected) {
    return NextResponse.json({ ok: false, reason: "wrong-key" }, { status: 401 });
  }

  const results: { label: string; ok: boolean; error?: string }[] = [];
  for (const { label, sql } of STATEMENTS) {
    try {
      await db.$executeRawUnsafe(sql);
      results.push({ label, ok: true });
    } catch (err) {
      results.push({
        label,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const allOk = results.every((r) => r.ok);
  return NextResponse.json({
    ok: allOk,
    note: allOk
      ? "Klart. Förfrågnings-inbox och 2FA fungerar fullt ut nu. Glöm inte att ta bort BOOTSTRAP_KEY från Vercel env vars."
      : "Vissa statements failade — se results[].error.",
    results,
  });
}
