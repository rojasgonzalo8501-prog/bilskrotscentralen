"use client";

/**
 * "Köp igen" — adds every available item from a past order back to
 * the cart in one click, then routes to /kassa.
 *
 * Items can become unavailable since the order was placed (sold to
 * someone else, withdrawn, edited). The server filters those out
 * before passing the list down — we just dispatch addItem for the
 * survivors. If nothing's still in stock, the button is disabled.
 */

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "./CartContext";

type Item = {
  partId: string;
  sku: string;
  name: string;
  priceSek: number;
};

interface Props {
  /** Items still AVAILABLE in stock — pre-filtered server-side. */
  items: Item[];
  /** Total number of items on the original order, for messaging. */
  originalCount: number;
  className?: string;
  variant?: "primary" | "secondary";
}

export function BuyAgainButton({ items, originalCount, className, variant = "primary" }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [pending, start] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const allMissing = items.length === 0;
  const someMissing = items.length < originalCount;

  function buyAgain() {
    if (allMissing) return;
    start(() => {
      for (const it of items) {
        addItem({
          partId: it.partId,
          sku: it.sku,
          name: it.name,
          priceSek: it.priceSek,
        });
      }
      if (someMissing) {
        const missing = originalCount - items.length;
        setFeedback(
          `${items.length} av ${originalCount} delar lagda i varukorgen — ${missing} är inte i lager längre.`
        );
        // Give the user 2.5s to read the message before routing.
        setTimeout(() => router.push("/kassa"), 2500);
      } else {
        router.push("/kassa");
      }
    });
  }

  if (allMissing) {
    return (
      <button
        type="button"
        disabled
        title="Inga av delarna i den här ordern är i lager just nu."
        className={
          className ??
          "px-4 py-2.5 rounded-lg border border-[var(--color-dark-500)] text-[var(--color-text-muted)] text-sm font-bold opacity-60 cursor-not-allowed"
        }
      >
        Slut i lager
      </button>
    );
  }

  const baseCls =
    variant === "primary"
      ? "bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white"
      : "border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] text-[var(--color-text-primary)]";

  return (
    <div className="inline-flex flex-col items-center sm:items-start gap-1">
      <button
        type="button"
        onClick={buyAgain}
        disabled={pending}
        className={
          className ??
          `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${baseCls} disabled:opacity-50`
        }
      >
        {pending ? "Lägger till…" : `🔁 Köp igen${someMissing ? ` (${items.length} av ${originalCount})` : ""}`}
      </button>
      {feedback && <span className="text-xs text-amber-300 mt-1">{feedback}</span>}
    </div>
  );
}
