"use client";

import { useState, useMemo } from "react";
import { MATERIALS_SEED } from "@/data/materials";
import { formatSEK } from "@/lib/types";

export function Calculator() {
  const [materialId, setMaterialId] = useState(MATERIALS_SEED[0].id);
  const [weight, setWeight] = useState("");

  const selectedMaterial = MATERIALS_SEED.find((m) => m.id === materialId)!;
  const estimate = useMemo(() => (parseFloat(weight) || 0) * selectedMaterial.price_per_kg, [weight, selectedMaterial]);
  const co2     = useMemo(() => (parseFloat(weight) || 0) * selectedMaterial.co2_savings_per_kg, [weight, selectedMaterial]);

  return (
    <section className="py-12 md:py-20 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-bg2)" }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-6 h-px" style={{ background: "var(--color-cu)" }} />
          <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu)" }}>Räkna ut värdet</span>
          <div className="w-6 h-px" style={{ background: "var(--color-cu)" }} />
        </div>
        <h2 className="font-display text-4xl md:text-5xl leading-tight tracking-wide uppercase mb-2" style={{ color: "var(--color-txt)" }}>
          Vad är ditt skrot värt?
        </h2>
        <p className="font-serif-it text-lg mb-8" style={{ color: "var(--color-txt2)" }}>
          Uppskattning på 5 sekunder.
        </p>

        <div className="rounded-2xl overflow-hidden text-left shadow-xl shadow-black/5"
          style={{ background: "var(--color-white)", border: "1px solid rgba(0,0,0,0.08)" }}>
          <div className="grid sm:grid-cols-2">
            <div className="p-5 sm:p-7" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <label className="font-mono text-[8.5px] tracking-[1.3px] uppercase block mb-2" style={{ color: "var(--color-txt2)" }}>
                Materialtyp
              </label>
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm font-medium focus:outline-none"
                style={{ background: "var(--color-bg)", border: "1px solid rgba(0,0,0,0.1)", color: "var(--color-txt)" }}
              >
                {MATERIALS_SEED.filter((m) => m.category !== "Bil").map((m) => (
                  <option key={m.id} value={m.id}>{m.name} — {formatSEK(m.price_per_kg)}/kg</option>
                ))}
              </select>
            </div>
            <div className="p-5 sm:p-7">
              <label className="font-mono text-[8.5px] tracking-[1.3px] uppercase block mb-2" style={{ color: "var(--color-txt2)" }}>
                Uppskattad vikt (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="t.ex. 50"
                min="0"
                step="0.1"
                className="w-full rounded-lg px-4 py-3 text-sm font-medium focus:outline-none"
                style={{ background: "var(--color-bg)", border: "1px solid rgba(0,0,0,0.1)", color: "var(--color-txt)" }}
              />
            </div>
          </div>

          <div className="p-5 sm:p-7" style={{ background: "rgba(200,121,65,0.06)", borderTop: "1px solid rgba(200,121,65,0.15)" }}>
            <div className="font-mono text-[8.5px] tracking-[1.3px] uppercase mb-1" style={{ color: "var(--color-cu)" }}>
              Uppskattat värde
            </div>
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div className="font-display text-5xl sm:text-6xl tracking-tight leading-none" style={{ color: "var(--color-cu)" }}>
                {weight ? formatSEK(estimate) : "— kr"}
              </div>
              {co2 > 0 && (
                <div className="font-mono text-[10px] tracking-[1.2px] uppercase px-3 py-1.5 rounded-full"
                  style={{ color: "var(--color-ok)", background: "rgba(58,138,82,0.08)", border: "1px solid rgba(58,138,82,0.2)" }}>
                  + {co2.toFixed(0)} kg CO₂ sparat
                </div>
              )}
            </div>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--color-txt2)" }}>
              Vägledande pris för rent material. Slutgiltigt pris bestäms efter invägning på plats.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
