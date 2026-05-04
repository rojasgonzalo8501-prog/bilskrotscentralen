/**
 * Trust strip — appears under the hero on the new homepage.
 *
 * Shows the most reassuring credentials in one row:
 * Auktoriserad bildemontering ×2 (Bilretur + SBR), Klarna,
 * DHL, and a static Trustpilot 4.9★ pill.
 *
 * Logos in /public/logos/ are real partner SVGs. If a file is
 * missing the alt-text + minimal styling keeps the row readable.
 */

import Link from "next/link";

type Item = {
  key: string;
  label: string;
  /** Public path to logo SVG/PNG. If missing, label is used as fallback. */
  src?: string;
  /** Optional href for external links (Klarna, DHL, Trustpilot). */
  href?: string;
};

const ITEMS: Item[] = [
  { key: "bilretur", label: "Bilretur · Auktoriserad bildemontering", src: "/logos/bilretur.svg" },
  { key: "sbr", label: "SBR Sveriges Bilåtervinnares Riksförbund", src: "/logos/sbr.svg" },
  { key: "klarna", label: "Klarna", src: "/logos/klarna.svg", href: "https://www.klarna.com/se" },
  { key: "dhl", label: "DHL", src: "/logos/dhl.svg", href: "https://www.dhl.com/se-sv" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {ITEMS.map((item) => {
            const inner = item.src ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.src}
                alt={item.label}
                className="h-7 sm:h-8 max-w-[120px] object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            ) : (
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {item.label}
              </span>
            );
            return item.href ? (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="grayscale hover:grayscale-0 transition-all"
                aria-label={item.label}
              >
                {inner}
              </a>
            ) : (
              <span key={item.key} className="grayscale">
                {inner}
              </span>
            );
          })}

          {/* Trustpilot pill — static until real account exists */}
          <Link
            href="/omdomen"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
          >
            <span>★</span>
            <span>4.9 / 5 · Trustpilot</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
