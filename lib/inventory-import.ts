/**
 * Inventory CSV importer.
 *
 * Two flavours: vehicles and parts. Both are upserts keyed on a stable
 * business identifier (stockNumber for vehicles, sku for parts) so the
 * same file can be re-uploaded after edits without duplicating rows.
 *
 * Errors are collected per row rather than aborting the whole batch —
 * Adam's first export will probably have a few weird rows and we want
 * the rest to land.
 */
import { db } from "./db";
import { parseCsv, type CsvRow } from "./csv";

export type ImportResult = {
  batchId: string;
  rowsTotal: number;
  rowsImported: number;
  rowsSkipped: number;
  errors: Array<{ row: number; message: string }>;
};

const VEHICLE_STATUSES = ["DISMANTLING", "DISMANTLED", "SCRAPPED"] as const;
const PART_CONDITIONS = [
  "NEW",
  "USED_LIKE_NEW",
  "USED_GOOD",
  "USED_OK",
  "USED_POOR",
] as const;
const PART_STATUSES = ["AVAILABLE", "RESERVED", "SOLD", "WITHDRAWN"] as const;

/* ─── Vehicles ─────────────────────────────────────────────────────── */

export async function importVehiclesCsv(
  filename: string,
  text: string,
): Promise<ImportResult> {
  const rows = parseCsv(text);
  const errors: ImportResult["errors"] = [];
  let imported = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const lineNo = i + 2; // +1 for header, +1 for 1-indexing
    try {
      const stockNumber = required(r, "stockNumber");
      const brandSlug = required(r, "brandSlug");
      const model = required(r, "model");
      const status = parseEnum(r.status, VEHICLE_STATUSES, "DISMANTLING");
      const data = {
        stockNumber,
        brandSlug,
        model,
        vehicleCode: r.vehicleCode || null,
        year: r.year ? parseInt(r.year, 10) : null,
        vin: r.vin || null,
        registration: r.registration || null,
        arrivedAt: r.arrivedAt ? new Date(r.arrivedAt) : new Date(),
        status,
        notes: r.notes || null,
      };
      await db.vehicle.upsert({
        where: { stockNumber },
        create: data,
        update: data,
      });
      imported++;
    } catch (err) {
      errors.push({
        row: lineNo,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return finalize(filename, "vehicles", rows.length, imported, errors);
}

/* ─── Parts ────────────────────────────────────────────────────────── */

export async function importPartsCsv(
  filename: string,
  text: string,
): Promise<ImportResult> {
  const rows = parseCsv(text);
  const errors: ImportResult["errors"] = [];
  let imported = 0;

  // Cache vehicle lookups so we don't hit the DB for every part
  const vehicleIdByStock = new Map<string, string>();

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const lineNo = i + 2;
    try {
      const sku = required(r, "sku");
      const vehicleStockNumber = required(r, "vehicleStockNumber");
      const name = required(r, "name");

      let vehicleId = vehicleIdByStock.get(vehicleStockNumber);
      if (!vehicleId) {
        const v = await db.vehicle.findUnique({
          where: { stockNumber: vehicleStockNumber },
          select: { id: true },
        });
        if (!v) {
          throw new Error(
            `vehicleStockNumber "${vehicleStockNumber}" not found — import vehicles first`,
          );
        }
        vehicleId = v.id;
        vehicleIdByStock.set(vehicleStockNumber, vehicleId);
      }

      const condition = parseEnum(
        r.condition,
        PART_CONDITIONS,
        "USED_GOOD",
      );
      const status = parseEnum(r.status, PART_STATUSES, "AVAILABLE");

      const data = {
        sku,
        vehicleId,
        partCode: r.partCode || null,
        name,
        position: r.position ? parseInt(r.position, 10) : null,
        oeNumber: r.oeNumber || null,
        priceSek: r.priceSek ? parseInt(r.priceSek, 10) : null,
        condition,
        status,
        notes: r.notes || null,
      };

      await db.part.upsert({
        where: { sku },
        create: data,
        update: data,
      });
      imported++;
    } catch (err) {
      errors.push({
        row: lineNo,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return finalize(filename, "parts", rows.length, imported, errors);
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function required(row: CsvRow, key: string): string {
  const v = row[key];
  if (!v || v.trim() === "") {
    throw new Error(`missing required column "${key}"`);
  }
  return v.trim();
}

function parseEnum<T extends string>(
  raw: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  if (!raw || raw.trim() === "") return fallback;
  const upper = raw.trim().toUpperCase() as T;
  if (!allowed.includes(upper)) {
    throw new Error(
      `invalid value "${raw}" — must be one of ${allowed.join(", ")}`,
    );
  }
  return upper;
}

async function finalize(
  filename: string,
  kind: "vehicles" | "parts",
  total: number,
  imported: number,
  errors: ImportResult["errors"],
): Promise<ImportResult> {
  const batch = await db.importBatch.create({
    data: {
      filename,
      kind,
      rowsTotal: total,
      rowsImported: imported,
      rowsSkipped: total - imported,
      errors: errors.length > 0 ? JSON.stringify(errors) : null,
    },
  });
  return {
    batchId: batch.id,
    rowsTotal: total,
    rowsImported: imported,
    rowsSkipped: total - imported,
    errors,
  };
}
