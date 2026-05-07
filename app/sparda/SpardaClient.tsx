"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist, subscribeWishlist } from "@/lib/wishlist-storage";
import { WishlistButton } from "@/components/WishlistButton";

type PartSummary = {
  id: string;
  sku: string;
  name: string;
  priceSek: number | null;
  status: string;
  brandSlug: string;
  model: string;
  year: number | null;
  imageUrl: string | null;
};

const STATUS_PILL: Record<string, { label: string; cls: string }> = {
  AVAILABLE: { label: "I lager",     cls: "bg-emerald-500/15 text-emerald-300" },
  RESERVED:  { label: "Reserverad",  cls: "bg-blue-500/15 text-blue-300" },
  SOLD:      { label: "Såld",        cls: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]" },
  WITHDRAWN: { label: "Borttagen",   cls: "bg-rose-500/15 text-rose-300" },
};

function brandName(slug: string) {
  if (slug === "mercedes-benz") return "Mercedes-Benz";
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

export function SpardaClient() {
  const [skus, setSkus] = useState<string[]>([]);
  const [parts, setParts] = useState<PartSummary[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Mirror localStorage into local state so re-renders happen on toggle.
  useEffect(() => {
    setSkus(getWishlist());
    return subscribeWishlist((list) => setSkus(list));
  }, []);

  // Refetch enriched data whenever the SKU set changes.
  useEffect(() => {
    let abort = false;
    if (skus.length === 0) {
      setParts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/parts-by-sku?skus=${skus.map(encodeURIComponent).join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (abort) return;
        setParts(data.parts as PartSummary[]);
        setLoading(false);
      })
      .catch(() => {
        if (abort) return;
        setParts([]);
        setLoading(false);
      });
    return () => {
      abort = true;
    };
  }, [skus]);

  if (loading && parts === null) {
    return (
      <div className="text-center py-16 text-sm text-[var(--color-text-muted)]">
        Laddar…
      </div>
    );
  }

  if (!parts || parts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
        <div className="text-5xl mb-4">💚</div>
        <h2 className="text-xl font-bold mb-2">Inga sparade delar än</h2>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
          Klicka på hjärtat på en del för att spara den hit. Listan ligger
          kvar mellan besök på den här enheten.
        </p>
        <Link
          href="/bildelar"
          className="btn-primary inline-block px-5 py-2.5 rounded-lg text-sm"
        >
          Bläddra bildelar
        </Link>
      </div>
    );
  }

  // SKUs we asked for but didn't get parts back for — they've been
  // deleted from inventory; surface that so the user can clean up.
  const returned = new Set(parts.map((p) => p.sku));
  const stale = skus.filter((s) => !returned.has(s));

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map((p) => {
          const pill = STATUS_PILL[p.status];
          return (
            <Link
              key={p.id}
              href={`/bildelar/${p.sku}`}
              className="group relative rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden hover:border-[var(--color-brand-orange)]/40 transition-colors flex flex-col"
            >
              <div className="h-40 relative bg-[var(--color-dark-600)]">
                <Image
                  src={p.imageUrl ?? "/images/motor.jpeg"}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <WishlistButton sku={p.sku} variant="card" />
                </div>
                {pill && (
                  <span className={`absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${pill.cls}`}>
                    {pill.label}
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="text-xs text-[var(--color-text-muted)] mb-1">
                  {brandName(p.brandSlug)}
                  {p.model ? ` · ${p.model}` : ""}
                  {p.year ? ` · ${p.year}` : ""}
                </div>
                <h3 className="font-semibold text-sm mb-auto leading-tight line-clamp-2">
                  {p.name}
                </h3>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-lg font-black text-[var(--color-brand-orange)]">
                    {p.priceSek != null
                      ? `${p.priceSek.toLocaleString("sv-SE")} kr`
                      : "Pris på förfrågan"}
                  </span>
                  <span className="text-xs font-mono text-[var(--color-text-muted)]">
                    {p.sku}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {stale.length > 0 && (
        <div className="mt-8 rounded-xl bg-amber-500/10 border border-amber-500/30 p-5 text-sm">
          <div className="font-semibold text-amber-300 mb-2">
            {stale.length} {stale.length === 1 ? "sparad del" : "sparade delar"} finns inte längre
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mb-3">
            Antagligen sålda eller borttagna ur lagret.
          </p>
          <div className="flex flex-wrap gap-2">
            {stale.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => removeFromWishlist(s)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-rose-500/50 hover:text-rose-300 transition-colors"
                title="Ta bort från Sparda"
              >
                ✕ {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
