"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

interface Props {
  partId: string;
  sku: string;
  name: string;
  priceSek: number;
  available: boolean;
}

export function AddToCartButton({ partId, sku, name, priceSek, available }: Props) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.partId === partId);

  function handleAdd() {
    addItem({ partId, sku, name, priceSek });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!available) {
    return (
      <button disabled className="btn-primary text-base px-8 py-4 rounded-xl w-full sm:w-auto opacity-50 cursor-not-allowed">
        Inte tillgänglig
      </button>
    );
  }

  if (inCart) {
    return (
      <a href="/kassa" className="btn-primary text-base px-8 py-4 rounded-xl w-full sm:w-auto inline-flex items-center justify-center gap-2">
        ✓ I varukorgen — Gå till kassa →
      </a>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="btn-primary text-base px-8 py-4 rounded-xl w-full sm:w-auto"
    >
      {added ? "✓ Lagd i varukorgen!" : "Lägg i varukorg →"}
    </button>
  );
}
