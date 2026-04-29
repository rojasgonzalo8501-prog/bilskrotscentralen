"use client";

import { useActionState, useState } from "react";
import { submitMetallinkop, type MetallinkopState } from "./actions";
import { metals } from "@/lib/metal-prices";

const initial: MetallinkopState = { status: "idle" };

export function MetalForm() {
  const [state, formAction, pending] = useActionState(submitMetallinkop, initial);
  const [typ, setTyp] = useState<"privat" | "foretag">("privat");
  const [leverans, setLeverans] = useState<"inlamning" | "hamtning">("inlamning");

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-xl font-bold mb-2">Tack — din förfrågan är skickad!</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Vi hör av oss inom en arbetsdag med pris och nästa steg. Ring 0171-210 02 om det är bråttom.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.message}
        </div>
      )}

      {/* Customer type */}
      <fieldset>
        <legend className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          Privat eller företag *
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {(["privat", "foretag"] as const).map((v) => (
            <label
              key={v}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                typ === v
                  ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)]"
                  : "border-[var(--color-dark-500)] hover:border-[var(--color-dark-400)]"
              }`}
            >
              <input
                type="radio"
                name="typ"
                value={v}
                checked={typ === v}
                onChange={() => setTyp(v)}
                className="sr-only"
              />
              <span className="text-sm font-semibold">{v === "privat" ? "Privatperson" : "Företag"}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Företagsfält */}
      {typ === "foretag" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Företagsnamn" name="foretag" required placeholder="Ditt företag AB" />
          <Field label="Org.nr" name="orgnr" placeholder="556677-8899" />
        </div>
      )}

      {/* Kontaktfält */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Namn" name="namn" required placeholder="För- och efternamn" />
        <Field label="Telefon" name="telefon" required type="tel" placeholder="070-123 45 67" />
      </div>
      <Field label="E-post" name="epost" type="email" placeholder="du@exempel.se" />

      {/* Vad har du? */}
      <Field
        label="Vilken metall? *"
        name="metaller"
        required
        placeholder="t.ex. blandat järn + lite koppar"
        textarea
      />
      <p className="-mt-3 text-xs text-[var(--color-text-muted)]">
        Du kan skriva fritt eller välja från listan ovan. Tveka inte att skicka även om du är osäker.
      </p>

      <Field label="Ungefärlig mängd / vikt" name="vikt" placeholder="t.ex. 50 kg, 1 ton, en pall" />

      {/* Leverans */}
      <fieldset>
        <legend className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          Inlämning eller hämtning?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { v: "inlamning", label: "Jag kommer själv" },
              { v: "hamtning", label: "Behöver hämtning" },
            ] as const
          ).map(({ v, label }) => (
            <label
              key={v}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                leverans === v
                  ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)]"
                  : "border-[var(--color-dark-500)] hover:border-[var(--color-dark-400)]"
              }`}
            >
              <input
                type="radio"
                name="leverans"
                value={v}
                checked={leverans === v}
                onChange={() => setLeverans(v)}
                className="sr-only"
              />
              <span className="text-sm font-semibold">{label}</span>
            </label>
          ))}
        </div>
        {leverans === "hamtning" && (
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Hämtning bokas vid större mängder. Vi återkommer med tid.
          </p>
        )}
      </fieldset>

      {leverans === "hamtning" && (
        <Field label="Hämtningsadress" name="adress" placeholder="Gatuadress, postort" />
      )}

      <Field
        label="Övrigt meddelande (valfritt)"
        name="meddelande"
        placeholder="Något vi bör veta? Foton kan skickas via SMS till 0171-210 02."
        textarea
      />

      <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
        Vi följer Lag (2014:799) om handel med metallskrot — alla utbetalningar sker via Swish
        (privatperson) eller bankgiro (företag). Inga kontanter. Legitimation krävs vid inlämning.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Skickar…" : "Skicka förfrågan →"}
      </button>

      {/* Quick-pick chips for metal types — populates the textarea via JS */}
      <details className="mt-2">
        <summary className="text-xs text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-brand-orange)]">
          Visa metaller du kan välja från
        </summary>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {metals.map((m) => (
            <button
              key={m.id}
              type="button"
              className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)]/50 transition-all"
              onClick={(e) => {
                const form = (e.target as HTMLElement).closest("form");
                const ta = form?.querySelector<HTMLTextAreaElement>('textarea[name="metaller"]');
                if (ta) {
                  ta.value = ta.value ? `${ta.value}, ${m.name}` : m.name;
                  ta.focus();
                }
              }}
            >
              {m.icon} {m.name}
            </button>
          ))}
        </div>
      </details>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all resize-y"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
        />
      )}
    </label>
  );
}
