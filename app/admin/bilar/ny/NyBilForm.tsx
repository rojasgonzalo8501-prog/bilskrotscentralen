"use client";

import { useActionState, useEffect, useState } from "react";
import { lookupRegAction, createVehicleAction } from "./actions";
import type { LookupState, CreateState } from "./actions";
import { MODELS } from "@/lib/models";

const BRANDS = Object.keys(MODELS).sort((a, b) => {
  // Mercedes first (specialistfokus), rest alphabetical
  if (a === "Mercedes-Benz") return -1;
  if (b === "Mercedes-Benz") return 1;
  return a.localeCompare(b, "sv");
});

const SLUG_MAP: Record<string, string> = {
  "Mercedes-Benz": "mercedes-benz",
  "Volvo": "volvo",
  "BMW": "bmw",
  "Audi": "audi",
  "Volkswagen": "volkswagen",
  "Toyota": "toyota",
  "Ford": "ford",
  "Peugeot": "peugeot",
  "Opel": "opel",
  "Saab": "saab",
  "Renault": "renault",
  "Škoda": "skoda",
  "Kia": "kia",
  "Hyundai": "hyundai",
  "Nissan": "nissan",
  "Mazda": "mazda",
  "Honda": "honda",
  "Mitsubishi": "mitsubishi",
  "Subaru": "subaru",
  "Suzuki": "suzuki",
  "Fiat": "fiat",
  "Alfa Romeo": "alfa-romeo",
  "Lancia": "lancia",
  "Citroën": "citroen",
  "DS": "ds",
  "Dacia": "dacia",
  "SEAT": "seat",
  "Cupra": "cupra",
  "Mini": "mini",
  "Jaguar": "jaguar",
  "Land Rover": "land-rover",
  "Porsche": "porsche",
  "Tesla": "tesla",
  "Polestar": "polestar",
  "Jeep": "jeep",
  "Chevrolet": "chevrolet",
  "Chrysler": "chrysler",
  "Dodge": "dodge",
  "Lexus": "lexus",
  "Infiniti": "infiniti",
  "Smart": "smart",
  "MG": "mg",
  "BYD": "byd",
};

// Reverse map: slug → display name
const SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_MAP).map(([name, slug]) => [slug, name]),
);

export default function NyBilForm({
  suggestedStockNumber,
}: {
  suggestedStockNumber: string;
}) {
  const [lookupState, lookupAction, lookupPending] = useActionState<
    LookupState,
    FormData
  >(lookupRegAction, null);

  const [createState, createAction, createPending] = useActionState<
    CreateState,
    FormData
  >(createVehicleAction, null);

  // Form fields that can be auto-filled from lookup
  const [brandSlug, setBrandSlug] = useState("");
  const [brandName, setBrandName] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [registration, setRegistration] = useState("");
  const [notes, setNotes] = useState("");
  const [stockNumber, setStockNumber] = useState(suggestedStockNumber);
  const [autoFilled, setAutoFilled] = useState(false);

  // Auto-fill when lookup succeeds
  useEffect(() => {
    if (lookupState?.ok) {
      const d = lookupState.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBrandSlug(d.brandSlug);
      setBrandName(SLUG_TO_NAME[d.brandSlug] ?? d.brandName);
      setModel(d.model);
      setYear(d.year ? String(d.year) : "");
      setVin(d.vin ?? "");
      setRegistration(d.registration);
      setAutoFilled(true);
    }
  }, [lookupState]);

  const d = lookupState?.ok ? lookupState.data : null;

  const availableModels =
    brandName && MODELS[brandName] ? MODELS[brandName] : [];

  return (
    <div className="space-y-8 max-w-2xl">
      {/* ─── Reg.nr lookup ─── */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-bold mb-1">1. Hämta från reg.nr</h2>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Ange registreringsnumret så hämtas bilens uppgifter automatiskt från
          Transportstyrelsen.
        </p>

        <form action={lookupAction} className="flex gap-3">
          <input
            name="regnr"
            type="text"
            placeholder="ABC 123"
            defaultValue={registration}
            className="flex-1 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-3 text-base uppercase placeholder:normal-case placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all tracking-widest font-mono"
          />
          <button
            type="submit"
            disabled={lookupPending}
            className="btn-primary px-6 py-3 rounded-xl text-sm whitespace-nowrap disabled:opacity-50"
          >
            {lookupPending ? "Hämtar…" : "🔍 Hämta"}
          </button>
        </form>

        {lookupState && !lookupState.ok && (
          <div className="mt-3 rounded-lg p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 text-sm text-[var(--color-error)]">
            {lookupState.error}
          </div>
        )}

        {autoFilled && lookupState?.ok && (
          <>
            <div className="mt-3 rounded-lg p-3 bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-sm text-[var(--color-success-bright)] flex items-center gap-2">
              <span>✓</span>
              <span>
                Hittade{" "}
                <strong>
                  {lookupState.data.brandName} {lookupState.data.model}
                </strong>{" "}
                ({lookupState.data.year ?? "okänt år"}) — kontrollera och spara
                nedan.
              </span>
            </div>

            {/* ─── Vehicle status panel ─── */}
            {d && (
              <div className="mt-3 rounded-lg border border-[var(--color-dark-500)] bg-[var(--color-dark-800)] overflow-hidden text-xs">
                {/* Alert strip for körförbud / avställd */}
                {(d.körförbud || d.avställd) && (
                  <div className={`px-4 py-2 font-semibold flex items-center gap-2 ${
                    d.körförbud
                      ? "bg-[var(--color-error)]/20 text-[var(--color-error)]"
                      : "bg-yellow-500/10 text-yellow-300"
                  }`}>
                    <span>{d.körförbud ? "⛔" : "⚠️"}</span>
                    <span>{d.statusLabel}</span>
                    {d.körförbudDeadline && (
                      <span className="ml-auto font-normal opacity-80">
                        Deadline: {d.körförbudDeadline}
                      </span>
                    )}
                  </div>
                )}

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[var(--color-dark-500)]">
                  {[
                    {
                      label: "Senast besiktad",
                      value: d.senastBesiktad ?? "—",
                      highlight: false,
                    },
                    {
                      label: "Besiktning giltig till",
                      value: d.besiktningGiltigTill ?? "—",
                      highlight: !d.besiktningGiltigTill,
                    },
                    {
                      label: "Färg",
                      value: d.color ?? "—",
                      highlight: false,
                    },
                    {
                      label: "Fordonstyp",
                      value: d.vehicleType ?? "—",
                      highlight: false,
                    },
                    {
                      label: "Status",
                      value: d.statusLabel,
                      highlight: d.körförbud || d.avställd,
                    },
                    {
                      label: "Stad (reg.)",
                      value: d.city ?? "—",
                      highlight: false,
                    },
                  ].map(({ label, value, highlight }) => (
                    <div
                      key={label}
                      className="bg-[var(--color-dark-800)] px-4 py-2.5"
                    >
                      <div className="text-[var(--color-text-muted)] mb-0.5">{label}</div>
                      <div className={`font-semibold ${highlight ? "text-[var(--color-error)]" : "text-[var(--color-text-primary)]"}`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Vehicle details form ─── */}
      <form action={createAction} className="glass rounded-xl p-6 space-y-5">
        <h2 className="font-bold">2. Fordonets uppgifter</h2>

        {/* Hidden slugs */}
        <input type="hidden" name="brandSlug" value={brandSlug} />

        {/* Stock number */}
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Lagernummer *
          </label>
          <input
            name="stockNumber"
            type="text"
            required
            value={stockNumber}
            onChange={(e) => setStockNumber(e.target.value)}
            className="w-full bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-3 text-sm font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
          />
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Auto-genererat — ändra om du vill ha ett annat nummer.
          </p>
        </div>

        {/* Brand selector */}
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Märke *
          </label>
          <select
            required
            value={brandName}
            onChange={(e) => {
              const selected = e.target.value;
              setBrandName(selected);
              setBrandSlug(SLUG_MAP[selected] ?? "");
              setModel(""); // reset model on brand change
            }}
            className="w-full bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
          >
            <option value="">Välj märke…</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {autoFilled && brandSlug && !SLUG_TO_NAME[brandSlug] && (
            <p className="mt-1 text-xs text-[var(--color-warning)]">
              Märket &quot;{brandName}&quot; finns inte i listan — välj närmaste alternativ.
            </p>
          )}
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Modell *
          </label>
          {availableModels.length > 0 ? (
            <div className="flex gap-2">
              <select
                value={availableModels.includes(model) ? model : ""}
                onChange={(e) => setModel(e.target.value)}
                className="flex-1 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
              >
                <option value="">Välj modell…</option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input type="hidden" name="model" value={model} />
            </div>
          ) : (
            <input
              name="model"
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="t.ex. E220 CDI"
              className="w-full bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
            />
          )}
          {availableModels.length > 0 && (
            <input
              type="text"
              placeholder="Eller ange fri text"
              value={availableModels.includes(model) ? "" : model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-2 w-full bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
            />
          )}
        </div>

        {/* Year + Reg + VIN */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Årsmodell
            </label>
            <input
              name="year"
              type="number"
              min="1950"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2014"
              className="w-full bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Reg.nr
            </label>
            <input
              name="registration"
              type="text"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              placeholder="ABC 123"
              className="w-full bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-3 text-sm font-mono uppercase text-[var(--color-text-primary)] placeholder:normal-case placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              VIN / Chassinr
            </label>
            <input
              name="vin"
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="WDB…"
              className="w-full bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-3 text-sm font-mono text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Anteckningar
          </label>
          <textarea
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ev. skador, saknade delar, plats i lagret…"
            className="w-full bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all resize-none"
          />
        </div>

        {/* Error */}
        {createState && !createState.ok && (
          <div className="rounded-lg p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 text-sm text-[var(--color-error)]">
            {createState.error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={createPending || !brandSlug || !model || !stockNumber}
            className="btn-primary px-8 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {createPending ? "Sparar…" : "✓ Registrera bil"}
          </button>
          <a
            href="/admin/bilar"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Avbryt
          </a>
        </div>
      </form>
    </div>
  );
}
