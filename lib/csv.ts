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
