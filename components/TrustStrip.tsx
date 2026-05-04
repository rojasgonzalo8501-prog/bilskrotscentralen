/**
 * Trust strip — under hero on the homepage.
 *
 * Shows reassurance credentials in one row:
 * Auktoriserad bildemontering ×2 (Bilretur + SBR), Klarna, DHL, and a
 * static Trustpilot 4.9★ pill.
 *
 * Uses inline-SVG/wordmark approximations of the partner marks so the
 * strip looks complete without waiting on official press-kit downloads.
 * When the real SVGs are placed in /public/logos/ we can swap them in
 * one by one.
 */

import Link from "next/link";

function AuktoriseradBadge({ org }: { org: "BILRETUR" | "SBR" }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-200 bg-white">
      <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Auktoriserad
        </div>
        <div className="text-xs font-black text-slate-900 tracking-wide">
          {org === "BILRETUR" ? "Bilretur" : "SBR"}
        </div>
      </div>
    </div>
  );
}

function KlarnaMark() {
  return (
    <a
      href="https://www.klarna.com/se"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Klarna — betala enkelt och säkert"
      className="inline-flex items-center px-4 h-12 rounded-lg bg-[#FFA8CD] hover:bg-[#FF8FBE] transition-colors"
    >
      <span className="font-black text-[#17120F] text-xl tracking-tight leading-none">
        Klarna<span className="text-[#17120F]">.</span>
      </span>
    </a>
  );
}

function DhlMark() {
  return (
    <a
      href="https://www.dhl.com/se-sv"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="DHL — leverans"
      className="inline-flex items-center h-12 rounded-md bg-[#FFCC00] hover:bg-[#F2C200] px-3 transition-colors"
    >
      <span className="font-black text-[#D40511] text-2xl tracking-tighter leading-none">
        DHL
      </span>
    </a>
  );
}

function TrustpilotPill() {
  return (
    <Link
      href="/omdomen"
      className="inline-flex items-center gap-2 h-12 px-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
    >
      <span className="text-base">★</span>
      <div className="leading-tight text-left">
        <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Trustpilot</div>
        <div className="text-xs font-black">4.9 / 5</div>
      </div>
    </Link>
  );
}

export function TrustStrip() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <AuktoriseradBadge org="BILRETUR" />
          <AuktoriseradBadge org="SBR" />
          <KlarnaMark />
          <DhlMark />
          <TrustpilotPill />
        </div>
      </div>
    </section>
  );
}
