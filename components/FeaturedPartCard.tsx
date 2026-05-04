"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

interface Props {
  id: string;
  sku: string;
  name: string;
  priceSek: number;
  brandSlug: string;
  model: string;
  imageUrl: string | null;
}

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function FeaturedPartCard({ id, sku, name, priceSek, brandSlug, model, imageUrl }: Props) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.partId === id);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ partId: id, sku, name, priceSek });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <a
      href={`/bildelar/${sku}`}
      className="card-hover rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden group flex flex-col"
    >
      <div className="h-44 overflow-hidden relative shrink-0 bg-[var(--color-dark-600)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl ?? "/images/motor.jpeg"}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Stock-urgency badge — every part is unique (1 of 1 from a dismantled vehicle) */}
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Endast 1 kvar
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-[var(--color-text-muted)] mb-1">
          {brandSlug === "mercedes-benz" ? "Mercedes-Benz" : brandSlug.replace(/-/g, " ")}
          {model ? ` · ${model}` : ""}
        </div>
        <h3 className="font-semibold text-sm leading-tight mb-auto line-clamp-2">
          {toTitleCase(name)}
        </h3>
        <div className="mt-3 flex items-end justify-between">
          <span className="text-lg font-black text-[var(--color-brand-orange)]">
            {priceSek.toLocaleString("sv-SE")} kr
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success-bright)]">
            Garanti
          </span>
        </div>

        {inCart ? (
          <a
            href="/kassa"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 block w-full btn-primary text-sm py-2.5 text-center rounded-lg"
          >
            ✓ I varukorgen — Gå till kassa
          </a>
        ) : (
          <button
            onClick={handleAdd}
            className="mt-3 w-full btn-primary text-sm py-2.5 justify-center rounded-lg"
          >
            {added ? "✓ Lagd i varukorgen!" : "Lägg i varukorg"}
          </button>
        )}
      </div>
    </a>
  );
}
