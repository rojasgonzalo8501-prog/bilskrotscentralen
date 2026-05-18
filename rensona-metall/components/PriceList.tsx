"use client";

import { useState, useMemo } from "react";
import { MATERIALS_SEED, CATEGORIES } from "@/data/materials";
import { formatSEK } from "@/lib/types";

export function PriceList() {
  const [filter, setFilter] = useState<string>("Alla");
  const today = new Date().toLocaleDateString("sv-SE", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  const materials = useMemo(
    () => filter === "Alla" ? MATERIALS_SEED : MATERIALS_SEED.filter((m) => m.category === filter),
    [filter]
  );

  return (
    <section id="prislista" className="py-16 md:py-24 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px" style={{ background: "var(--color-cu)" }} />
          <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu)" }}>Dagens priser</span>
          <div className="hidden sm:flex items-center gap-1.5 ml-auto">
            <div className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: "var(--color-cu)" }} />
            <span className="font-mono text-[8.5px] tracking-[1.2px] uppercase" style={{ color: "var(--color-cu)" }}>Live · Uppdaterad {today}</span>
          </div>
        </div>

        <h2 className="font-display text-[40px] md:text-[56px] lg:text-[68px] leading-[0.92] tracking-wide uppercase mb-4" style={{ color: "var(--color-txt)" }}>
          Live prislista.
        </h2>
        <p className="font-serif-it text-lg md:text-xl max-w-xl mb-8" style={{ color: "var(--color-txt2)" }}>
          Vi köper allt metallskrot — kom in och få betalt direkt.
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-5 md:mx-0 px-5 md:px-0">
          {["Alla", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="whitespace-nowrap font-mono text-[9.5px] tracking-[1.5px] uppercase px-4 py-2.5 rounded-md flex-shrink-0 transition-colors"
              style={filter === cat
                ? { background: "var(--color-cu)", color: "var(--color-white)" }
                : { background: "var(--color-white)", color: "var(--color-txt2)", border: "1px solid rgba(0,0,0,0.1)" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {materials.map((m) => (
            <div
              key={m.id}
              className="rounded-xl p-4 md:p-5 transition-all"
              style={{ background: "var(--color-white)", border: "1px solid rgba(0,0,0,0.08)" }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[7.5px] tracking-[1.2px] uppercase px-2 py-1 rounded"
                  style={{ color: "var(--color-cu)", background: "rgba(200,121,65,0.09)", border: "1px solid rgba(200,121,65,0.15)" }}>
                  {m.category}
                </span>
                <span className="text-[10px]" style={{ color: "var(--color-txt2)" }}>{m.unit}</span>
              </div>

              <h3 className="font-display text-xl tracking-wider uppercase leading-tight mb-1" style={{ color: "var(--color-txt)" }}>
                {m.name}
              </h3>
              {m.description && (
                <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--color-txt2)" }}>
                  {m.description}
                </p>
              )}

              <div className="flex items-baseline justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <div>
                  {m.category === "Bil" ? (
                    <>
                      <div className="font-display text-2xl tracking-wide leading-none" style={{ color: "var(--color-cu)" }}>RING</div>
                      <div className="text-[9px] font-mono uppercase tracking-[1px] mt-1" style={{ color: "var(--color-txt2)" }}>Pris efter värdering</div>
                    </>
                  ) : (
                    <>
                      <div className="font-display text-3xl tracking-wide leading-none" style={{ color: "var(--color-cu)" }}>
                        {formatSEK(m.price_per_kg)}
                      </div>
                      <div className="text-[9px] font-mono uppercase tracking-[1px] mt-1" style={{ color: "var(--color-txt2)" }}>per {m.unit}</div>
                    </>
                  )}
                </div>
                <div className="font-mono text-[8px] tracking-[1px] uppercase flex items-center gap-1" style={{ color: "var(--color-ok)" }}>
                  <span>↑</span><span>Stabilt</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 md:p-7 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ background: "var(--color-panel)", border: "1px solid rgba(0,0,0,0.08)" }}>
          <div>
            <div className="font-mono text-[9px] tracking-[1.2px] uppercase mb-1" style={{ color: "var(--color-txt2)" }}>Notera</div>
            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--color-txt)" }}>
              Priserna är vägledande dagspriser för rent material. Vid större kvantiteter — kontakta oss för offert.
            </p>
          </div>
          <a href="#hitta" className="btn-cu" style={{ whiteSpace: "nowrap" }}>
            Hitta till oss →
          </a>
        </div>
      </div>
    </section>
  );
}
