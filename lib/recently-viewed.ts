/**
 * Recently-viewed parts — client-side ring buffer in localStorage.
 *
 * Each visit to /bildelar/[sku] pushes the SKU to the front, dedupes,
 * and trims to MAX entries. The list is then rendered as a small
 * carousel at the bottom of the part page so customers can hop back
 * to anything they've recently considered.
 *
 * SAFE TO IMPORT FROM CLIENT COMPONENTS ONLY — every read guards
 * against `typeof window === "undefined"`.
 */

const KEY = "merca:recently-viewed";
const MAX = 12;

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Record a visit to a SKU. No-op on the server. */
export function recordVisit(sku: string): void {
  if (typeof window === "undefined" || !sku) return;
  try {
    const list = getRecentlyViewed().filter((s) => s !== sku);
    list.unshift(sku);
    if (list.length > MAX) list.length = MAX;
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* quota / private mode — fail silently */
  }
}

/** Get recently-viewed SKUs minus the current one (so the section
 *  doesn't recommend the page you're already on). */
export function getRecentlyViewedExcluding(currentSku: string): string[] {
  return getRecentlyViewed().filter((s) => s !== currentSku);
}
