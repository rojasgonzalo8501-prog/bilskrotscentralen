/**
 * Wishlist storage — pure client-side localStorage with a tiny pub/sub
 * so every WishlistButton on the page reflects toggles instantly.
 *
 * No DB schema involved; this is the simplest viable wishlist that
 * works for guests, doesn't require login, and survives across
 * sessions on the same device. If we later want cross-device wishlists
 * for logged-in users, we can sync this list to a User.wishlist column
 * on signin and back on signout.
 *
 * SAFE TO IMPORT FROM CLIENT COMPONENTS ONLY. All functions guard
 * against typeof window === "undefined" so SSR doesn't blow up.
 */

const KEY = "merca:wishlist";
const EVENT = "merca:wishlist-changed";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function write(list: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    // Same-tab sync — `storage` events only fire on OTHER tabs, so we
    // dispatch our own synthetic event for this tab.
    window.dispatchEvent(new CustomEvent(EVENT, { detail: list }));
  } catch {
    /* quota / private mode — fail silently */
  }
}

export function getWishlist(): string[] {
  return read();
}

export function isInWishlist(sku: string): boolean {
  return read().includes(sku);
}

/** Toggle a SKU. Returns the new "is saved" state. */
export function toggleWishlist(sku: string): boolean {
  const list = read();
  const idx = list.indexOf(sku);
  if (idx === -1) {
    list.unshift(sku); // Newest first
    write(list);
    return true;
  }
  list.splice(idx, 1);
  write(list);
  return false;
}

/** Remove a single sku. */
export function removeFromWishlist(sku: string): void {
  const list = read().filter((s) => s !== sku);
  write(list);
}

/** Subscribe to changes — same tab AND other tabs. Returns unsubscribe. */
export function subscribeWishlist(cb: (list: string[]) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const sameTab = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    cb(Array.isArray(detail) ? detail : read());
  };
  const otherTab = (e: StorageEvent) => {
    if (e.key === KEY) cb(read());
  };
  window.addEventListener(EVENT, sameTab);
  window.addEventListener("storage", otherTab);
  return () => {
    window.removeEventListener(EVENT, sameTab);
    window.removeEventListener("storage", otherTab);
  };
}
