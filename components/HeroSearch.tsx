"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Tab = "reg" | "marke" | "oe";

interface Props {
  popularTerms?: string[];
}

const FALLBACK_POPULAR = ["Mercedes E-klass", "Volvo V70", "BMW 3-serie", "Luftfjädring"];

export function HeroSearch({ popularTerms }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("reg");
  const [value, setValue] = useState("");

  const popular = popularTerms && popularTerms.length > 0 ? popularTerms : FALLBACK_POPULAR;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    const q = encodeURIComponent(value.trim());
    router.push(`/bildelar?q=${q}`);
  }

  const placeholders: Record<Tab, string> = {
    reg: "Ange registreringsnummer, t.ex. ABC 123",
    marke: "Sök på märke eller modell, t.ex. Mercedes E220",
    oe: "Ange OE-nummer, t.ex. A2213200604",
  };

  const tabLabel: Record<Tab, string> = {
    reg: "Registreringsnr",
    marke: "Märke / Modell",
    oe: "OE-nummer",
  };

  return (
    <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-4">
      <div className="flex gap-1 mb-3 bg-[var(--color-dark-800)] rounded-lg p-1">
        {(["reg", "marke", "oe"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setValue(""); }}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all ${
              tab === t
                ? "bg-[var(--color-brand-orange)] text-white"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tabLabel[t]}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholders[tab]}
          className="flex-1 px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)]/30 transition-all"
        />
        <button type="submit" className="btn-primary px-5 py-3 rounded-lg text-sm whitespace-nowrap">
          Sök →
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
        <span className="text-xs text-[var(--color-text-muted)]">Populärt:</span>
        {popular.map((term) => (
          <a
            key={term}
            href={`/bildelar?q=${encodeURIComponent(term)}`}
            className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-dark-500)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-all"
          >
            {term}
          </a>
        ))}
        <Link
          href="/nya-bildelar"
          className="text-xs px-2.5 py-1 rounded-full border border-[var(--color-brand-orange)]/40 text-[var(--color-brand-orange-light)] hover:bg-[var(--color-brand-orange)]/10 transition-all ml-1"
        >
          ✨ Fabriksnya delar →
        </Link>
      </div>
    </div>
  );
}
