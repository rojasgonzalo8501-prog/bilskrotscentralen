"use client";

/**
 * Customer-facing brand → model → year selector.
 *
 * Ports the dropdown UX from the earlier prototype (localhost:3030) into the
 * new merca-platform aesthetic: dark glass card, orange accent, uppercase
 * labels. Submits to /bildelar?marke=&modell=&ar= for the listing to filter.
 */
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MODELS, type BrandOption } from "@/lib/models";

export default function BrandSelector({ brands }: { brands: BrandOption[] }) {
  const router = useRouter();
  const [brandSlug, setBrandSlug] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const selectedBrand = brands.find((b) => b.slug === brandSlug);
  const models = useMemo(
    () => (selectedBrand ? (MODELS[selectedBrand.name] ?? []) : []),
    [selectedBrand],
  );

  // 30 most recent model years — same window the old site used.
  const years = useMemo(
    () => Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i),
    [],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brandSlug) params.set("marke", brandSlug);
    if (model) params.set("modell", model);
    if (year) params.set("ar", year);
    router.push(`/bildelar?${params.toString()}`);
  }

  const selectClasses =
    "w-full px-4 py-3.5 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all disabled:opacity-40 disabled:cursor-not-allowed appearance-none";

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 sm:p-6 max-w-3xl">
      <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
        Hitta rätt del till din bil
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        {/* Brand */}
        <select
          value={brandSlug}
          onChange={(e) => {
            setBrandSlug(e.target.value);
            setModel("");
          }}
          className={selectClasses}
          aria-label="Välj märke"
        >
          <option value="">Välj märke</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Model */}
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!brandSlug || models.length === 0}
          className={selectClasses}
          aria-label="Välj modell"
        >
          <option value="">
            {brandSlug
              ? models.length === 0
                ? "Ingen modellista"
                : "Välj modell"
              : "Välj märke först"}
          </option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={selectClasses}
          aria-label="Välj årsmodell"
        >
          <option value="">Välj år</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary w-full text-base py-4 rounded-xl">
        Sök delar →
      </button>
    </form>
  );
}
