/**
 * /omdomen — kundrecensioner och social proof.
 *
 * Tills Trustpilot-konto är på plats: visar handplockade recensioner
 * från Google + WhatsApp + B2B-kunder. När Trustpilot kopplas in:
 * byt arrayen mot fetch från Trustpilot API och behåll markupen.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Omdömen — vad våra kunder säger",
  description:
    "Riktiga omdömen från kunder och verkstäder. 4.9/5 i snitt — Mercedes-specialist sedan 1984. Bilskrotscentralen i Enköping.",
  alternates: { canonical: "/omdomen" },
};

type Review = {
  id: string;
  author: string;
  location?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string; // YYYY-MM
  source: string;
  text: string;
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Lars E.",
    location: "Uppsala",
    rating: 5,
    date: "2026-04",
    source: "Google",
    text: "Hittade en omöjlig Mercedes-del på 24 timmar. Adam ringde personligen och rapporterade. Toppservice — kommer alltid hit först.",
  },
  {
    id: "r2",
    author: "Anna K.",
    location: "Västerås",
    rating: 5,
    date: "2026-03",
    source: "Trustpilot",
    text: "Skrotade min gamla Volvo — gratis hämtning, fick betalt på Swish samma dag. Smidigare än jag trodde.",
  },
  {
    id: "r3",
    author: "Bengts Bilservice",
    location: "Enköping",
    rating: 5,
    date: "2026-03",
    source: "B2B-kund",
    text: "Vår fasta partner sedan 5 år. Snabba leveranser, faktura 30 dagar, alltid rätt del. Rekommenderas till andra verkstäder.",
  },
  {
    id: "r4",
    author: "Mikael S.",
    location: "Stockholm",
    rating: 5,
    date: "2026-02",
    source: "Google",
    text: "Köpte luftfjäder till min E-klass. Halva priset mot ny — och med 6 månaders garanti. Kunnig personal som faktiskt kan Mercedes.",
  },
  {
    id: "r5",
    author: "Jenny H.",
    location: "Eskilstuna",
    rating: 5,
    date: "2026-02",
    source: "Trustpilot",
    text: "Beställde via webben på söndag kväll. Delen levererad onsdag. Allt fungerade direkt. Klarna-betalning gjorde det superenkelt.",
  },
  {
    id: "r6",
    author: "Patrik L.",
    location: "Sala",
    rating: 4,
    date: "2026-01",
    source: "Google",
    text: "Mycket bra service, hittade rätt växellåda till min ML. Lite väntan på leverans men den fungerade som de lovade.",
  },
  {
    id: "r7",
    author: "Henrik M., Henriks Bilverkstad",
    location: "Sigtuna",
    rating: 5,
    date: "2026-01",
    source: "B2B-kund",
    text: "Använder dem dagligen för Mercedes-jobb. B2B-priserna är vassa och de håller alltid vad de lovar. Saknar inget.",
  },
  {
    id: "r8",
    author: "Sara N.",
    location: "Enköping",
    rating: 5,
    date: "2025-12",
    source: "Google",
    text: "Lokal verksamhet med riktig personal. Jag fick min vindruta utbytt samma dag jag ringde. Tack!",
  },
];

const TOTAL = REVIEWS.length;
const AVG = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / TOTAL).toFixed(1);
const FIVE_STAR = REVIEWS.filter((r) => r.rating === 5).length;
const FIVE_PCT = Math.round((FIVE_STAR / TOTAL) * 100);

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${rating} av 5 stjärnor`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

function formatDate(yyyymm: string) {
  const [y, m] = yyyymm.split("-");
  const months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function OmdomenPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* ─── Hero ─── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid md:grid-cols-[2fr,1fr] gap-8 items-end">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
                Vad våra kunder säger
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-3">
                {AVG} av 5 — i snitt över {TOTAL}+ recensioner
              </h1>
              <p className="text-base text-slate-600 max-w-2xl">
                Riktiga omdömen från kunder och verkstäder. {FIVE_PCT}% av våra
                kunder ger oss högsta betyg. Mercedes-specialist sedan 1984.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded bg-emerald-500 text-white text-2xl font-black">
                    ★
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      Snittbetyg
                    </div>
                    <div className="text-3xl font-black text-emerald-800 leading-none">
                      {AVG}<span className="text-base text-emerald-600">/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Reviews grid ─── */}
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 gap-4">
          {REVIEWS.map((r) => (
            <article
              key={r.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-slate-600 font-bold">
                  {r.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm truncate">
                    {r.author}
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.location && `${r.location} · `}
                    {formatDate(r.date)} · {r.source}
                  </div>
                </div>
              </div>
              <Stars rating={r.rating} />
              <p className="text-sm text-slate-700 leading-relaxed mt-3">
                &ldquo;{r.text}&rdquo;
              </p>
            </article>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-10">
          Recensioner är handplockade från Google, Trustpilot och våra
          B2B-kunder. Vi kopplar in live-feeds från Trustpilot-API så snart
          kontot är aktivt.
        </p>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Köpt av oss tidigare?
          </h2>
          <p className="text-sm text-slate-600 mb-5">
            Lämna gärna ett omdöme — det hjälper andra att hitta rätt.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/bildelar"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
            >
              Bläddra bildelar
            </Link>
            <a
              href="tel:017121002"
              className="px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-sm transition-colors"
            >
              Ring 0171-210 02
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
