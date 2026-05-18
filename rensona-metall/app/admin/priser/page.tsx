"use client";

import { useState } from "react";
import { MATERIALS_SEED, CATEGORIES } from "@/data/materials";
import { formatSEK, type Material } from "@/lib/types";

export default function PriserPage() {
  const [materials, setMaterials] = useState<Material[]>(MATERIALS_SEED);
  const [saved, setSaved] = useState(false);

  const updatePrice = (id: string, price: string) => {
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) return;
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, price_per_kg: p } : m)));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="font-mono text-[8.5px] tracking-[1.8px] uppercase mb-2" style={{ color: "var(--color-cu)" }}>
            Admin
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase" style={{ color: "var(--color-white)" }}>
            Priser
          </h1>
        </div>
        <button
          onClick={handleSave}
          className="btn-cu"
          style={saved ? { background: "var(--color-ok)" } : undefined}
        >
          {saved ? "Sparat ✓" : "Spara priser"}
        </button>
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat} className="mb-8">
          <div className="font-mono text-[8.5px] tracking-[1.5px] uppercase mb-3" style={{ color: "rgba(250,247,243,0.4)" }}>
            {cat}
          </div>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(250,247,243,0.1)" }}>
            {materials
              .filter((m) => m.category === cat)
              .map((m, i, arr) => (
                <div
                  key={m.id}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(250,247,243,0.06)" : undefined }}
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: "var(--color-white)" }}>{m.name}</div>
                    {m.description && (
                      <div className="text-xs mt-0.5" style={{ color: "rgba(250,247,243,0.35)" }}>{m.description}</div>
                    )}
                  </div>
                  {m.category === "Bil" ? (
                    <div className="font-mono text-[9px] tracking-[1px] uppercase" style={{ color: "rgba(250,247,243,0.35)" }}>
                      Offertpris
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={m.price_per_kg}
                        onChange={(e) => updatePrice(m.id, e.target.value)}
                        min="0"
                        step="0.1"
                        className="w-24 rounded-lg px-3 py-2 text-sm text-right font-mono"
                        style={{ background: "rgba(250,247,243,0.07)", border: "1px solid rgba(250,247,243,0.15)", color: "var(--color-cu)" }}
                      />
                      <span className="font-mono text-[9px] uppercase" style={{ color: "rgba(250,247,243,0.35)" }}>kr/{m.unit}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(250,247,243,0.04)", border: "1px solid rgba(250,247,243,0.08)" }}>
        <p className="text-xs" style={{ color: "rgba(250,247,243,0.35)" }}>
          Priserna sparas lokalt tills Supabase-integrationen är aktiverad. LME-priser uppdateras normalt dagligen.
        </p>
      </div>
    </div>
  );
}
