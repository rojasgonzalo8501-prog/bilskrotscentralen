"use client";

/**
 * Sticky mobile add-to-cart bar.
 *
 * Appears at the bottom of the viewport on mobile (< sm breakpoint)
 * after the user has scrolled past the main hero CTA. Uses an
 * IntersectionObserver tied to a sentinel <div> next to the regular
 * AddToCartButton — when the regular button leaves the viewport we
 * slide this bar up; when it scrolls back into view the bar slides
 * away again.
 *
 * Hidden on sm+ where the desktop layout always shows the price + CTA
 * in the right column anyway.
 */

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";

interface Props {
  partId: string;
  sku: string;
  name: string;
  priceSek: number | null;
  available: boolean;
}

export function StickyAddToCart({ partId, sku, name, priceSek, available }: Props) {
  const { addItem, items } = useCart();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.partId === partId);

  // Watch the sentinel — when it leaves the viewport (scrolled past
  // the main CTA), reveal the sticky bar.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      { rootMargin: "0px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  function handleAdd() {
    if (priceSek == null) return;
    addItem({ partId, sku, name, priceSek });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      {/* Sentinel — placed by the parent next to the desktop CTA */}
      <div ref={sentinelRef} aria-hidden className="h-0 w-0 sm:hidden" />

      {/* Sticky bar — only on mobile */}
      <div
        className={`sm:hidden fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
          shown ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!shown}
      >
        <div className="bg-[var(--color-dark-700)] border-t border-[var(--color-dark-500)] shadow-2xl shadow-black/50 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] truncate">
              {name}
            </div>
            <div className="text-lg font-black text-[var(--color-brand-orange)] leading-none mt-0.5">
              {priceSek != null
                ? `${priceSek.toLocaleString("sv-SE")} kr`
                : "Pris på förfrågan"}
            </div>
          </div>

          {!available ? (
            <button
              disabled
              className="px-5 py-3 rounded-xl bg-[var(--color-dark-500)] text-[var(--color-text-muted)] text-sm font-bold opacity-60"
            >
              Slut
            </button>
          ) : priceSek == null ? (
            <a
              href="#price-cta"
              className="px-5 py-3 rounded-xl bg-[var(--color-brand-orange)] text-white text-sm font-bold whitespace-nowrap"
            >
              Fråga pris
            </a>
          ) : inCart ? (
            <a
              href="/kassa"
              className="px-5 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold whitespace-nowrap"
            >
              ✓ Till kassa →
            </a>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="px-5 py-3 rounded-xl bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white text-sm font-bold whitespace-nowrap transition-colors"
            >
              {added ? "✓ Lagt till" : "+ Lägg i varukorg"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
