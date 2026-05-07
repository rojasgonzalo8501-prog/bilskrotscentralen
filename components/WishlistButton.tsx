"use client";

/**
 * Heart-toggle button for saving a part to the local wishlist.
 *
 * Two visual variants:
 *   - "card"  — small icon button to overlay on a part card (top-right).
 *   - "inline"— larger pill with text, for the part-detail page.
 */

import { useEffect, useState } from "react";
import {
  isInWishlist,
  toggleWishlist,
  subscribeWishlist,
} from "@/lib/wishlist-storage";

interface Props {
  sku: string;
  variant?: "card" | "inline";
  className?: string;
}

export function WishlistButton({ sku, variant = "card", className }: Props) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(isInWishlist(sku));
    return subscribeWishlist(() => setSaved(isInWishlist(sku)));
  }, [sku]);

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setSaved(toggleWishlist(sku));
  }

  // Don't flash an empty heart on SSR — wait for mount so the state
  // matches the persisted localStorage value on first paint.
  if (!mounted) {
    return variant === "card" ? <span className="hidden" /> : null;
  }

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={saved ? "Ta bort från Sparda" : "Spara till Sparda"}
        aria-pressed={saved}
        className={
          className ??
          `inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-colors ${
            saved
              ? "bg-rose-500/10 border-rose-500/40 text-rose-300 hover:bg-rose-500/20"
              : "border-[var(--color-dark-500)] hover:border-rose-500/50 text-[var(--color-text-secondary)] hover:text-rose-300"
          }`
        }
      >
        <Heart filled={saved} size={18} />
        {saved ? "Sparad" : "Spara"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={saved ? "Ta bort från Sparda" : "Spara till Sparda"}
      aria-pressed={saved}
      className={
        className ??
        `inline-flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-md transition-colors shadow-sm ${
          saved
            ? "bg-rose-500/90 text-white hover:bg-rose-600"
            : "bg-white/85 text-slate-700 hover:bg-white hover:text-rose-500"
        }`
      }
    >
      <Heart filled={saved} size={16} />
    </button>
  );
}

function Heart({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  );
}
