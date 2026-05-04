"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

/**
 * Two-column hero — matches the Gemini mockup.
 *
 * LEFT card (white) — RESERVDELAR: regnr search at top, then a row of
 * three dropdowns (Märke/Modell/Årsmodell) always visible. Submit hits
 * the existing /api/fordon endpoint and routes to /bildelar.
 *
 * RIGHT card (dark) — SKROTA BIL: regnr input + Gammal↔Defekt slider
 * with live premium estimate, then "BOKA GRATIS HÄMTNING".
 */

type Brand = { slug: string; name: string };

interface Props {
  brands: Brand[];
}

const REGNR_RE = /^[A-ZÅÄÖ]{3}\s?[0-9]{2}[A-Z0-9]$/i;

function normalizeRegnr(s: string) {
  return s.replace(/\s+/g, "").toUpperCase();
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

/**
 * Conservative scrap-premium estimator.
 * Returns a [min, max] range in SEK.
 *
 * Slider 0 (Gammal/körbar)  → ~3500–4500 kr
 * Slider 100 (Defekt)       → ~0–500 kr
 *
 * The minimum is allowed to bottom out at 0 — at full Defekt we make
 * no promises about premium, since the car's value at that point is
 * basically just the metal recycling.
 */
function estimatePremium(condition: number): [number, number] {
  // condition: 0 = "Gammal" (driveable), 100 = "Defekt"
  const base = 4000; // SEK center for a healthy salvage car
  const factor = 1 - condition / 100; // linear: 1 at 0, 0 at 100
  const center = Math.round((base * factor) / 100) * 100;
  return [Math.max(0, center - 500), Math.min(5000, center + 500)];
}

export function HomeHero({ brands }: Props) {
  const router = useRouter();

  // Reservdelar state
  const [partRegnr, setPartRegnr] = useState("");
  const [marke, setMarke] = useState("");
  const [modell, setModell] = useState("");
  const [arModel, setArModel] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Skrota state
  const [scrapRegnr, setScrapRegnr] = useState("");
  const [condition, setCondition] = useState(40); // 0–100
  const [premieMin, premieMax] = useMemo(() => estimatePremium(condition), [condition]);

  async function handlePartSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    // Priority 1: regnr lookup → fills brand/model/year via API
    if (partRegnr.trim()) {
      if (!REGNR_RE.test(partRegnr)) {
        setErrorMsg("Ogiltigt regnr. Format: ABC123 eller ABC12A.");
        return;
      }
      setLookupLoading(true);
      try {
        const res = await fetch(`/api/fordon?regnr=${encodeURIComponent(normalizeRegnr(partRegnr))}`);
        if (res.ok) {
          const data = await res.json();
          const brandSlug =
            (data.fabrikat &&
              brands.find((b) => b.name.toUpperCase() === String(data.fabrikat).toUpperCase())?.slug) ||
            (data.fabrikat ? String(data.fabrikat).toLowerCase().replace(/[^a-z0-9]+/g, "-") : "");
          const params = new URLSearchParams();
          if (brandSlug) params.set("marke", brandSlug);
          if (data.model) params.set("modell", String(data.model));
          if (data.year) params.set("ar", String(data.year));
          router.push(`/bildelar?${params.toString()}`);
          return;
        }
        setErrorMsg("Kunde inte hitta fordonet. Välj märke/modell istället.");
      } catch (e) {
        console.error("[HomeHero] lookup failed:", e);
        setErrorMsg("Sökning misslyckades. Försök igen eller välj manuellt.");
      } finally {
        setLookupLoading(false);
      }
      return;
    }

    // Priority 2: manual brand/model/year selection
    const params = new URLSearchParams();
    if (marke) params.set("marke", marke);
    if (modell.trim()) params.set("modell", modell.trim());
    if (arModel) params.set("ar", arModel);
    if (params.toString()) {
      router.push(`/bildelar?${params.toString()}`);
    } else {
      setErrorMsg("Skriv regnr eller välj minst ett märke.");
    }
  }

  function handleScrapSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (scrapRegnr.trim()) {
      if (!REGNR_RE.test(scrapRegnr)) return;
      params.set("regnr", normalizeRegnr(scrapRegnr));
    }
    params.set("estimate", `${premieMin}-${premieMax}`);
    router.push(`/skrota-bilen?${params.toString()}#boka`);
  }

  return (
    <section className="relative overflow-hidden bg-slate-900">
      {/* Hero photo background — Mercedes engine bay */}
      <div className="absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/mercedes-hero.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>
      {/* Soft frosted overlay so the cards stay readable on top */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/75 to-slate-900/85" />
      {/* Brand-orange glow top-left, emerald glow bottom-right for depth */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[var(--color-brand-orange)] opacity-[0.10] blur-[140px]" aria-hidden />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-500 opacity-[0.08] blur-[120px]" aria-hidden />
      {/* Subtle grid lines for blueprint feel */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-12">
          {/* Green sustainability badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ♻️ Sveriges mest hållbara bildemontering
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05] drop-shadow-lg">
            Intelligent bildemontering.
            <br />
            <span className="text-emerald-400">Klimatsmart från start.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
            Återvunna originaldelar med <strong className="text-white">80 % mindre CO2</strong> än
            nytillverkat. <strong className="text-white">92 % återvinningsgrad</strong> av
            varje bil. Mercedes-specialist sedan 1984.
          </p>
        </div>

        {/* Two-card grid */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* LEFT — Reservdelar (white card) */}
          <form
            onSubmit={handlePartSubmit}
            className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/5 p-6 sm:p-7"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-black text-slate-900 tracking-wider">RESERVDELAR</h2>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                ♻️ Återvunnet
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Originaldelar med nytt liv — 80 % mindre CO2 än nytillverkat.
            </p>

            <input
              type="text"
              value={partRegnr}
              onChange={(e) => setPartRegnr(e.target.value)}
              placeholder="Skriv Registreringsnummer..."
              autoComplete="off"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base placeholder:text-slate-400 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all uppercase tracking-wider mb-3"
            />

            <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold mb-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <circle cx="12" cy="12" r="10" fill="rgb(16,185,129)" stroke="none" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12l3 3 5-6"
                  stroke="white"
                  strokeWidth="3"
                />
              </svg>
              100% KOMPATIBILITETSGARANTI
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 mb-3">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={lookupLoading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wider transition-colors disabled:opacity-60 disabled:cursor-not-allowed uppercase mb-4"
            >
              {lookupLoading ? "Söker..." : "Hitta rätt del"}
            </button>

            {/* Three always-visible dropdowns */}
            <div className="grid grid-cols-3 gap-2">
              <select
                value={marke}
                onChange={(e) => setMarke(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition-all appearance-none bg-no-repeat"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='none' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1 1l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundPosition: "right 0.5rem center",
                  paddingRight: "1.75rem",
                }}
              >
                <option value="">Märke</option>
                {brands.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={modell}
                onChange={(e) => setModell(e.target.value)}
                placeholder="Modell"
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-all"
              />
              <select
                value={arModel}
                onChange={(e) => setArModel(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition-all appearance-none bg-no-repeat"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='none' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1 1l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundPosition: "right 0.5rem center",
                  paddingRight: "1.75rem",
                }}
              >
                <option value="">Årsmodell</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* RIGHT — Skrota Bil (dark card) */}
          <form
            onSubmit={handleScrapSubmit}
            className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg shadow-slate-900/20 p-6 sm:p-7 text-white"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-black tracking-wider">SKROTA BIL</h2>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                ♻️ 92 % återvinns
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Vi ger din bil ett nytt liv — som reservdelar och återvunnet material.
            </p>

            <input
              type="text"
              value={scrapRegnr}
              onChange={(e) => setScrapRegnr(e.target.value)}
              placeholder="Skriv Registreringsnummer..."
              autoComplete="off"
              className="w-full px-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-base placeholder:text-slate-500 text-white focus:outline-none focus:border-white transition-all uppercase tracking-wider mb-5"
            />

            {/* Slider — Gammal ↔ Defekt */}
            <div className="mb-3">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                <span>Gammal</span>
                <span>Defekt</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={condition}
                onChange={(e) => setCondition(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[var(--color-brand-orange)]"
                style={{
                  background: `linear-gradient(to right, var(--color-brand-orange) 0%, var(--color-brand-orange) ${condition}%, rgb(30,41,59) ${condition}%, rgb(30,41,59) 100%)`,
                }}
              />
            </div>

            {/* Premie estimate */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                Uppskattad Skrotpremie:
              </span>
              <span className="text-base font-black text-white">
                {premieMin.toLocaleString("sv-SE")}–{premieMax.toLocaleString("sv-SE")} kr
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mb-5 leading-relaxed">
              * Slutpris bekräftas vid hämtning efter inspektion. Förutsätter komplett bil.
            </p>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm tracking-wider transition-colors uppercase mb-3"
            >
              Boka Gratis Hämtning
            </button>

            <Link
              href="/skrota-bilen#boka"
              className="flex items-center justify-center gap-2 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Se Lediga Tider
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}
