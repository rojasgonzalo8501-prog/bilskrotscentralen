"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/categories";

interface Brand { slug: string; name: string; logoUrl: string; }

interface Props {
  categories: Category[];
  brands: Brand[];
  aktivKategori?: string;
  aktivMarke?: string;
}

export function MobileFilters({ categories, brands, aktivKategori, aktivMarke }: Props) {
  const [open, setOpen] = useState(false);
  const hasActive = !!(aktivKategori || aktivMarke);

  return (
    <>
      {/* Trigger-knapp — visas bara på mobil/tablet */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)] text-sm font-medium hover:border-[var(--color-brand-orange)] transition-colors mb-4"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/></svg>
        Filter
        {hasActive && (
          <span className="ml-1 w-2 h-2 rounded-full bg-[var(--color-brand-orange)]" />
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--color-dark-800)] border-r border-[var(--color-dark-500)] flex flex-col transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-dark-500)]">
          <span className="font-bold">Filter</span>
          <button onClick={() => setOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Kategorier */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Kategorier
            </h3>
            <ul className="space-y-0.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <a
                    href={`/bildelar/kategorier/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      aktivKategori === c.slug
                        ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] font-medium"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)]"
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[var(--color-dark-600)]" />

          {/* Märken */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Märken
            </h3>
            <ul className="space-y-0.5">
              {brands.map((b) => (
                <li key={b.slug}>
                  <a
                    href={`/bildelar?marke=${b.slug}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      aktivMarke === b.slug
                        ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] font-medium"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)]"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.logoUrl} alt={b.name} width={16} height={16} className="object-contain" />
                    </div>
                    <span>{b.name}</span>
                  </a>
                </li>
              ))}
              <li>
                <Link href="/bildelar/marken" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-brand-orange)] hover:bg-[var(--color-dark-700)]">
                  → Alla märken
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {hasActive && (
          <div className="p-4 border-t border-[var(--color-dark-500)]">
            <Link href="/bildelar" onClick={() => setOpen(false)} className="block w-full text-center py-2.5 rounded-xl border border-[var(--color-dark-500)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] transition-colors">
              Rensa alla filter
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
