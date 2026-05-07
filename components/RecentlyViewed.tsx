"use client";

/**
 * Two responsibilities:
 *   1. Record the current SKU on mount so the next page sees it in
 *      the ring buffer.
 *   2. Render a horizontally-scrolling strip of part cards for the
 *      *previous* visits (excluding the current SKU).
 *
 * Drop into a part page like:
 *   <RecentlyViewed currentSku={part.sku} />
 *
 * Empty on first visit; appears once the customer has browsed at
 * least one other part.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecentlyViewedExcluding, recordVisit } from "@/lib/recently-viewed";

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

function brandName(slug: string) {
  if (slug === "mercedes-benz") return "Mercedes-Benz";
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}

export function RecentlyViewed({ currentSku }: { currentSku: string }) {
  const [parts, setParts] = useState<PartSummary[] | null>(null);

  useEffect(() => {
    // Record visit AFTER computing the "previous" list so the current
    // SKU never shows up in its own carousel.
    const previous = getRecentlyViewedExcluding(currentSku);
    recordVisit(currentSku);

    if (previous.length === 0) {
      setParts([]);
      return;
    }

    let abort = false;
    fetch(`/api/parts-by-sku?skus=${previous.map(encodeURIComponent).join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (!abort) setParts((data.parts ?? []) as PartSummary[]);
      })
      .catch(() => {
        if (!abort) setParts([]);
      });
    return () => {
      abort = true;
    };
  }, [currentSku]);

  if (!parts || parts.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          Senast visade
        </h2>
        <Link
          href="/bildelar"
          className="text-sm text-[var(--color-brand-orange)] font-semibold hover:underline hidden sm:block"
        >
          Alla bildelar →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-thin">
        {parts.map((p) => (
          <Link
            key={p.id}
            href={`/bildelar/${p.sku}`}
            className="snap-start shrink-0 w-44 sm:w-52 group rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden hover:border-[var(--color-brand-orange)]/40 transition-colors flex flex-col"
          >
            <div className="h-32 relative bg-[var(--color-dark-600)]">
              <Image
                src={p.imageUrl ?? "/images/motor.jpeg"}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 50vw, 200px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {p.status !== "AVAILABLE" && (
                <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/90 text-white">
                  {p.status === "SOLD" ? "Såld" : p.status === "RESERVED" ? "Reserverad" : "Borta"}
                </span>
              )}
            </div>
            <div className="p-3 flex flex-col flex-1 gap-1">
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] truncate">
                {brandName(p.brandSlug)} {p.model} {p.year ?? ""}
              </div>
              <h3 className="font-semibold text-xs leading-tight line-clamp-2 mb-auto">
                {p.name}
              </h3>
              <div className="text-sm font-black text-[var(--color-brand-orange)] mt-1">
                {p.priceSek != null
                  ? `${p.priceSek.toLocaleString("sv-SE")} kr`
                  : "Pris på förfrågan"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
