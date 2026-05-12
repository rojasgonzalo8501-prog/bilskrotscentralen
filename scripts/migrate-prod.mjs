#!/usr/bin/env node
/**
 * Build-time migration runner.
 *
 * Runs every time Vercel builds the project. Connects to DATABASE_URL
 * and applies the idempotent SQL statements that bring an old prod DB
 * up to the current schema. Each statement uses `IF NOT EXISTS` so it
 * is safe to run on every deploy — already-applied changes are no-ops.
 *
 * If DATABASE_URL is missing (e.g. preview deploy without DB) we log
 * a warning and exit 0 so the build still succeeds.
 *
 * If any statement throws unexpectedly we log it but still exit 0 —
 * the build must not fail because of a migration the dev DB doesn't
 * need. The app's own defensive try/catch wrappers handle the case
 * where columns don't exist at runtime.
 */

import pg from "pg";

const STATEMENTS = [
  // 20260505_add_leads
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpSecret" TEXT`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpEnabled" BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totpVerifiedAt" TIMESTAMP`,
  // 20260507_add_totp
  `CREATE TABLE IF NOT EXISTS "Lead" (
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
  `CREATE INDEX IF NOT EXISTS "Lead_status_createdAt_idx" ON "Lead"("status","createdAt")`,
  `CREATE INDEX IF NOT EXISTS "Lead_kind_idx" ON "Lead"("kind")`,
  `CREATE INDEX IF NOT EXISTS "Lead_assignedToId_idx" ON "Lead"("assignedToId")`,
];

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate-prod] DATABASE_URL not set — skipping (likely a local/preview build)");
  process.exit(0);
}

// Postgres connection strings sometimes need SSL on Vercel-hosted DBs.
const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("[migrate-prod] Connected, applying", STATEMENTS.length, "statements...");
  let ok = 0;
  let failed = 0;
  for (let i = 0; i < STATEMENTS.length; i++) {
    const sql = STATEMENTS[i];
    const label = sql.split("\n")[0].slice(0, 80);
    try {
      await client.query(sql);
      ok++;
      console.log(`[migrate-prod]   ✓ ${i + 1}/${STATEMENTS.length}  ${label}`);
    } catch (err) {
      failed++;
      console.error(`[migrate-prod]   ✗ ${i + 1}/${STATEMENTS.length}  ${label}`);
      console.error("[migrate-prod]    ", err.message);
    }
  }
  console.log(`[migrate-prod] Done. ${ok} ok, ${failed} failed.`);
} catch (err) {
  console.error("[migrate-prod] Connection failed:", err.message);
  // Don't fail the build on infra hiccup.
} finally {
  try { await client.end(); } catch {}
}

process.exit(0);
