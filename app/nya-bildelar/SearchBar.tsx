"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({
  defaultQ,
  defaultMarke,
  defaultKategori,
}: {
  defaultQ: string;
  defaultMarke: string;
  defaultKategori: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (defaultMarke) params.set("marke", defaultMarke);
    if (defaultKategori) params.set("kategori", defaultKategori);
    router.push(`/nya-bildelar?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 max-w-3xl">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Sök på namn, OE-nummer, artikelnr eller märke…"
          className="flex-1 px-5 py-3.5 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all"
        />
        <button type="submit" className="btn-primary text-sm px-6 py-3.5 rounded-xl whitespace-nowrap">
          Sök →
        </button>
      </div>
    </form>
  );
}
