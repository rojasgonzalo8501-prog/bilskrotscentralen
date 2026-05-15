"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitSkrotaForm, type SkrotaState } from "./actions";
import { CITIES } from "@/lib/cities";

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

// Rough estimate based on brand parts value + steel weight.
// Confirmed at pick-up after weighing, so we show a range.
function estimateOffer(v: VehicleInfo): { min: number; max: number } {
  let base = 2500;
  const brand = v.fabrikat.toUpperCase();
  if (brand.includes("MERCEDES")) base += 1500;
  else if (brand === "VOLVO") base += 800;
  else if (brand === "BMW") base += 1000;
  else if (brand === "AUDI") base += 800;
  else if (brand === "VOLKSWAGEN") base += 500;
  else if (brand === "TOYOTA") base += 300;
  if (v.vehicleType === "LLB") base += 1000; // light truck — more steel
  return { min: Math.max(base - 500, 0), max: base + 500 };
}

const initial: SkrotaState = { status: "idle" };

export function SkrotaForm() {
  const [state, formAction, pending] = useActionState(submitSkrotaForm, initial);
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
        setLookupError("Fordonet hittades inte. Kontrollera regnumret och försök igen.");
        setLookupState("error");
        return;
      }
      if (!res.ok) {
        setLookupError("Kunde inte hämta fordonsinformation just nu. Fyll i formuläret nedan ändå.");
        setLookupState("error");
        return;
      }
      const data = await res.json();
      setVehicle(data);
      setLookupState("found");
    } catch {
      setLookupError("Nätverksfel. Fyll i formuläret nedan eller ring oss direkt.");
      setLookupState("error");
    }
  }

  if (state.status === "success") {
    return (
      <div className="bg-[var(--color-dark-700)] p-8 rounded-2xl border border-green-500/30 text-center space-y-3">
        <div className="text-5xl">✅</div>
        <h3 className="text-xl font-bold">Tack! Vi hör av oss snart.</h3>
        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
          Vi återkommer inom 2 timmar under kontorstid.{" "}
          <br className="hidden sm:block" />
          Ring gärna{" "}
          <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold hover:underline">
            0171-210 02
          </a>{" "}
          om det är bråttom.
        </p>
      </div>
    );
  }

  const offer = vehicle ? estimateOffer(vehicle) : null;

  return (
    <div className="space-y-5">
      {/* ── Vehicle lookup ── */}
      <div className="bg-[var(--color-dark-700)] p-6 rounded-2xl border border-[var(--color-dark-500)]">
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
          Registreringsnummer — slå upp fordon & estimerat pris
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={regnr}
            onChange={(e) => {
              setRegnr(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
              if (lookupState !== "idle") {
                setLookupState("idle");
                setVehicle(null);
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="ABC123"
            maxLength={7}
            className="flex-1 border border-[var(--color-dark-500)] rounded-lg px-3 py-2.5 text-sm bg-[var(--color-dark-800)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors font-mono tracking-widest"
          />
          <button
            type="button"
            onClick={lookup}
            disabled={lookupState === "loading" || regnr.replace(/[^A-Z0-9]/g, "").length < 5}
            className="px-4 py-2.5 rounded-lg bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
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
          <p className="mt-2 text-xs text-amber-400">{lookupError}</p>
        )}

        {lookupState === "found" && vehicle && offer && (
          <div className="mt-4 p-4 rounded-xl bg-[var(--color-dark-800)] border border-[var(--color-brand-orange)]/30">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Fordon</div>
                <div className="font-bold text-[var(--color-text-primary)] text-base">
                  {vehicle.fabrikat}
                  {vehicle.model ? ` ${vehicle.model}` : ""}
                  {vehicle.year && (
                    <span className="text-[var(--color-text-secondary)] font-normal"> · {vehicle.year}</span>
                  )}
                </div>
                {vehicle.color && (
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{vehicle.color}</div>
                )}
                {(vehicle.körförbud || vehicle.avställd) && (
                  <div className="mt-1 text-xs text-amber-400 font-medium">{vehicle.statusLabel}</div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Estimerat erbjudande</div>
                <div className="font-black text-[var(--color-brand-orange)] text-xl leading-none">
                  {offer.min.toLocaleString("sv-SE")}–{offer.max.toLocaleString("sv-SE")} kr
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] mt-1">Bekräftas vid hämtning</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Booking form ── */}
      <form
        action={formAction}
        className="space-y-4 bg-[var(--color-dark-700)] p-6 rounded-2xl border border-[var(--color-dark-500)]"
      >
        {/* Hidden fields — vehicle data from lookup */}
        <input type="hidden" name="regnr" value={regnr.trim().toUpperCase()} />
        {vehicle && (
          <>
            <input type="hidden" name="fabrikat" value={vehicle.fabrikat} />
            <input type="hidden" name="fordonsmodell" value={vehicle.model} />
            <input type="hidden" name="fordonsaar" value={vehicle.year ?? ""} />
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">
              Namn *
            </label>
            <input
              type="text"
              name="namn"
              required
              placeholder="Ditt namn"
              className="w-full border border-[var(--color-dark-500)] rounded-lg px-3 py-2.5 text-sm bg-[var(--color-dark-800)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">
              Telefon *
            </label>
            <input
              type="tel"
              name="telefon"
              required
              placeholder="070-XXX XX XX"
              className="w-full border border-[var(--color-dark-500)] rounded-lg px-3 py-2.5 text-sm bg-[var(--color-dark-800)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">
              Ort
            </label>
            <select
              name="ort"
              defaultValue=""
              className="w-full border border-[var(--color-dark-500)] rounded-lg px-3 py-2.5 text-sm bg-[var(--color-dark-800)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
            >
              <option value="" disabled>Välj ort</option>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
              <option value="annan">Annan ort</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">
              E-post (valfritt)
            </label>
            <input
              type="email"
              name="email"
              placeholder="din@email.se"
              className="w-full border border-[var(--color-dark-500)] rounded-lg px-3 py-2.5 text-sm bg-[var(--color-dark-800)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">
            Adress *
          </label>
          <input
            type="text"
            name="adress"
            required
            placeholder="Gatuadress där bilen står"
            className="w-full border border-[var(--color-dark-500)] rounded-lg px-3 py-2.5 text-sm bg-[var(--color-dark-800)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">
            Övrigt (valfritt)
          </label>
          <textarea
            rows={3}
            name="ovrigt"
            placeholder="Bilens skick, tillgänglighet, önskad tid…"
            className="w-full border border-[var(--color-dark-500)] rounded-lg px-3 py-2.5 text-sm resize-none bg-[var(--color-dark-800)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
          />
        </div>

        {state.status === "error" && (
          <p className="text-sm text-red-400 text-center rounded-lg bg-red-400/10 py-2 px-3">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Skickar…" : "Skicka bokningsförfrågan"}
        </button>

        <p className="text-xs text-center text-[var(--color-text-muted)]">
          Vi ringer upp inom 2 timmar under kontorstid (Mån–Tors 08–17, Fre 08–15)
        </p>
      </form>
    </div>
  );
}
