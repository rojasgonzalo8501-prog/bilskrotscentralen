"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitSkrotaBokning, type SkrotaState } from "./actions";

interface VehicleInfo {
  fabrikat: string;
  model: string;
  year: number | null;
  color: string | null;
  statusLabel: string;
  körförbud: boolean;
  avställd: boolean;
  vehicleType: string | null;
}

function estimateOffer(v: VehicleInfo): { min: number; max: number } {
  let base = 2500;
  const brand = v.fabrikat.toUpperCase();
  if (brand.includes("MERCEDES")) base += 1500;
  else if (brand === "VOLVO")      base += 800;
  else if (brand === "BMW")        base += 1000;
  else if (brand === "AUDI")       base += 800;
  else if (brand === "VOLKSWAGEN") base += 500;
  else if (brand === "TOYOTA")     base += 300;
  if (v.vehicleType === "LLB")     base += 1000;
  return { min: Math.max(base - 500, 0), max: base + 500 };
}

const initial: SkrotaState = { status: "idle" };

const inputClass = `
  w-full px-4 py-3 rounded-lg text-sm
  bg-[#f2ede6] border text-[var(--color-txt)]
  placeholder:text-[var(--color-txt2)]
  focus:outline-none transition-colors
`.trim().replace(/\s+/g, " ");

export function SkrotaForm() {
  const [state, formAction, pending] = useActionState(submitSkrotaBokning, initial);
  const [regnr, setRegnr] = useState("");
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [lookupError, setLookupError] = useState("");

  async function lookup() {
    const clean = regnr.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (clean.length < 5) return;
    setLookupState("loading");
    setVehicle(null);
    try {
      const res = await fetch(`/api/fordon?regnr=${encodeURIComponent(clean)}`);
      if (res.status === 404) {
        setLookupError("Fordonet hittades inte. Kontrollera regnumret.");
        setLookupState("error");
        return;
      }
      if (!res.ok) {
        setLookupError("Kunde inte hämta fordonsinformation — fyll i formuläret ändå.");
        setLookupState("error");
        return;
      }
      setVehicle(await res.json());
      setLookupState("found");
    } catch {
      setLookupError("Nätverksfel. Fyll i formuläret nedan eller ring oss.");
      setLookupState("error");
    }
  }

  if (state.status === "success") {
    return (
      <div className="text-center py-16 px-8 rounded-2xl border"
        style={{ borderColor: "var(--color-border)", background: "var(--color-panel)" }}>
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--color-txt)" }}>
          Tack för din bokning!
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-txt2)" }}>
          Vi återkommer inom 2 timmar under kontorstid.<br />
          Ring direkt på{" "}
          <a href="tel:017121002" style={{ color: "var(--color-cu)", fontWeight: 600 }}>
            0171-210 02
          </a>{" "}
          om det är bråttom.
        </p>
      </div>
    );
  }

  const offer = vehicle ? estimateOffer(vehicle) : null;

  return (
    <div className="space-y-6">
      {/* ── Step 1: Vehicle lookup ── */}
      <div className="rounded-2xl p-6 border" style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}>
        <div className="mb-2" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-txt2)" }}>
          Steg 1 — Slå upp ditt fordon
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={regnr}
            onChange={(e) => {
              setRegnr(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
              if (lookupState !== "idle") { setLookupState("idle"); setVehicle(null); }
            }}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="ABC123"
            maxLength={7}
            className="flex-1 px-4 py-3 rounded-lg text-sm font-mono tracking-widest uppercase focus:outline-none transition-colors"
            style={{ background: "var(--color-bg)", border: `1px solid var(--color-border2)`, color: "var(--color-txt)" }}
          />
          <button
            type="button"
            onClick={lookup}
            disabled={lookupState === "loading" || regnr.length < 5}
            className="btn-cu disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ padding: "0.75rem 1.25rem", whiteSpace: "nowrap" }}
          >
            {lookupState === "loading" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Söker…
              </span>
            ) : "Slå upp"}
          </button>
        </div>

        {lookupState === "error" && (
          <p className="mt-2 text-xs" style={{ color: "#b45309" }}>{lookupError}</p>
        )}

        {lookupState === "found" && vehicle && offer && (
          <div className="mt-4 p-4 rounded-xl flex flex-wrap items-start justify-between gap-4"
            style={{ background: "var(--color-bg)", border: "1px solid var(--color-border2)" }}>
            <div>
              <div className="text-xs mb-1" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-txt2)" }}>Fordon</div>
              <div className="font-bold text-base" style={{ color: "var(--color-txt)" }}>
                {vehicle.fabrikat}{vehicle.model ? ` ${vehicle.model}` : ""}
                {vehicle.year && <span style={{ color: "var(--color-txt2)", fontWeight: 400 }}> · {vehicle.year}</span>}
              </div>
              {vehicle.color && <div className="text-xs mt-0.5" style={{ color: "var(--color-txt2)" }}>{vehicle.color}</div>}
              {(vehicle.körförbud || vehicle.avställd) && (
                <div className="text-xs mt-1 font-semibold" style={{ color: "#b45309" }}>{vehicle.statusLabel}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs mb-1" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-txt2)" }}>Estimerat erbjudande</div>
              <div className="font-black text-xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-cu)", letterSpacing: "0.02em" }}>
                {offer.min.toLocaleString("sv-SE")}–{offer.max.toLocaleString("sv-SE")} kr
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--color-txt2)" }}>Bekräftas vid hämtning</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Step 2: Contact & booking ── */}
      <form action={formAction} className="rounded-2xl p-6 border space-y-4"
        style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}>
        <div className="mb-1" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-txt2)" }}>
          Steg 2 — Din kontaktinfo
        </div>

        {/* Hidden vehicle fields */}
        <input type="hidden" name="regnr" value={regnr.trim().toUpperCase()} />
        {vehicle && (
          <>
            <input type="hidden" name="fabrikat" value={vehicle.fabrikat} />
            <input type="hidden" name="fordonsmodell" value={vehicle.model} />
            <input type="hidden" name="fordonsaar" value={vehicle.year ?? ""} />
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-txt2)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Namn *</label>
            <input type="text" name="namn" required placeholder="Ditt fullständiga namn" className={inputClass} style={{ border: "1px solid var(--color-border2)" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-txt2)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Telefon *</label>
            <input type="tel" name="telefon" required placeholder="070-XXX XX XX" className={inputClass} style={{ border: "1px solid var(--color-border2)" }} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-txt2)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>E-post (valfritt)</label>
          <input type="email" name="email" placeholder="din@email.se" className={inputClass} style={{ border: "1px solid var(--color-border2)" }} />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-txt2)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Gatuadress *</label>
          <input type="text" name="adress" required placeholder="Gatuadress där bilen står" className={inputClass} style={{ border: "1px solid var(--color-border2)" }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-txt2)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Postnummer</label>
            <input type="text" name="postnummer" placeholder="123 45" maxLength={6} className={inputClass} style={{ border: "1px solid var(--color-border2)" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-txt2)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Ort</label>
            <input type="text" name="ort" placeholder="Stad" className={inputClass} style={{ border: "1px solid var(--color-border2)" }} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: "var(--color-txt2)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Betalningssätt</label>
          <div className="flex flex-wrap gap-2">
            {[["swish", "Swish"], ["bankgiro", "Bankgiro"], ["kontant", "Kontant"]].map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg text-sm"
                style={{ background: "var(--color-bg)", border: "1px solid var(--color-border2)", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
                <input type="radio" name="betalning" value={val} defaultChecked={val === "swish"} className="accent-[var(--color-cu)]" />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--color-txt2)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Övrigt (valfritt)</label>
          <textarea rows={3} name="ovrigt" placeholder="Bilens skick, om den inte är körbar, önskad tid…"
            className={`${inputClass} resize-none`} style={{ border: "1px solid var(--color-border2)" }} />
        </div>

        {state.status === "error" && (
          <p className="text-sm text-center py-2 px-4 rounded-lg" style={{ color: "#991b1b", background: "rgba(220,38,38,0.08)" }}>
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-cu w-full py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
          {pending ? "Skickar…" : "Skicka bokningsförfrågan"}
        </button>

        <p className="text-xs text-center" style={{ fontFamily: "var(--font-mono)", color: "var(--color-txt2)" }}>
          Vi ringer upp inom 2h · Mån–Tors 08–17 · Fre 08–15
        </p>
      </form>
    </div>
  );
}
