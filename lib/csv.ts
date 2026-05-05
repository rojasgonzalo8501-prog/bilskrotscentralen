/**
 * Tiny CSV parser. Just enough to handle the inventory templates:
 *   - Comma-separated
 *   - Quoted fields with embedded commas and "" escaping
 *   - First row = header
 *
 * Pulled into the repo instead of taking a dependency because we own the
 * format (it's *our* template) and the input is small (Adam's lager will
 * be hundreds of rows, not millions).
 */
export type CsvRow = Record<string, string>;

export function parseCsv(text: string): CsvRow[] {
  const rows = parseCsvRows(text);
  if (rows.length === 0) return [];
  const [header, ...body] = rows;
  return body
    .filter((r) => r.some((cell) => cell.trim() !== "")) // skip blank lines
    .map((r) => {
      const obj: CsvRow = {};
      header.forEach((col, i) => {
        obj[col.trim()] = (r[i] ?? "").trim();
      });
      return obj;
    });
}

/** Splits raw CSV text into rows of cells, handling quoted fields. */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;
  // Strip BOM if present
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += ch;
      i++;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      cur.push(cell);
      cell = "";
      i++;
      continue;
    }
    if (ch === "\r") {
      i++;
      continue;
    }
    if (ch === "\n") {
      cur.push(cell);
      rows.push(cur);
      cur = [];
      cell = "";
      i++;
      continue;
    }
    cell += ch;
    i++;
  }
  if (cell !== "" || cur.length > 0) {
    cur.push(cell);
    rows.push(cur);
  }
  return rows;
}

/* ─────────────────────────────────────────────────────────────────────
   CSV BUILDER — for admin exports.
   RFC 4180 escaping + UTF-8 BOM so Excel opens åäö correctly.
   ───────────────────────────────────────────────────────────────────── */

type Primitive = string | number | boolean | bigint | null | undefined | Date;
type Row = Record<string, Primitive>;

const BOM = "﻿";

function escapeCell(value: Primitive): string {
  if (value == null) return "";
  let s: string;
  if (value instanceof Date) {
    s = value.toISOString();
  } else if (typeof value === "boolean") {
    s = value ? "true" : "false";
  } else {
    s = String(value);
  }
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv<T extends Row>(
  rows: T[],
  options?: {
    columns?: { key: keyof T; label: string }[];
    includeBOM?: boolean;
  }
): string {
  const cols =
    options?.columns ??
    (rows[0]
      ? Object.keys(rows[0]).map((k) => ({ key: k as keyof T, label: k }))
      : []);

  const header = cols.map((c) => escapeCell(c.label)).join(",");
  const body = rows
    .map((r) => cols.map((c) => escapeCell(r[c.key])).join(","))
    .join("\r\n");

  const csv = body ? `${header}\r\n${body}` : header;
  return options?.includeBOM === false ? csv : BOM + csv;
}

export function csvResponseHeaders(filename: string): HeadersInit {
  return {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store",
  };
}

export function exportDatestamp(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}
