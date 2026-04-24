"use client";

import { useActionState } from "react";
import { submitEftersok, type EftersokState } from "./actions";

const initial: EftersokState = { status: "idle" };

function Field({
  label, name, type = "text", required, placeholder,
}: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
        {label}{required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
      />
    </label>
  );
}

export function EftersokForm() {
  const [state, formAction, pending] = useActionState(submitEftersok, initial);

  if (state.status === "success") {
    return (
      <div className="glass rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <div className="text-5xl">📨</div>
        <h3 className="text-2xl font-bold">Eftersökning skickad!</h3>
        <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto">
          Adam kollar lagret personligen och återkommer inom 24 h.
          Ring gärna{" "}
          <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold hover:underline">
            0171-210 02
          </a>{" "}
          om det är bråttom.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Ditt namn" name="namn" required />
        <Field label="Telefon" name="telefon" type="tel" required />
      </div>
      <Field label="E-post" name="epost" type="email" required />

      <div className="border-t border-[var(--color-dark-500)] pt-5">
        <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Bilen</div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Registreringsnummer" name="regnr" placeholder="ABC 123" />
          <Field label="Eller VIN" name="vin" placeholder="WDB..." />
        </div>
        <div className="grid sm:grid-cols-3 gap-5 mt-5">
          <Field label="Märke" name="marke" placeholder="Mercedes-Benz" />
          <Field label="Modell" name="modell" placeholder="E220 CDI" />
          <Field label="Årsmodell" name="ar" placeholder="2014" type="number" />
        </div>
      </div>

      <div className="border-t border-[var(--color-dark-500)] pt-5">
        <label className="block">
          <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Vad letar du efter? *
          </span>
          <textarea
            name="del"
            rows={5}
            required
            placeholder="Beskriv delen så detaljerat du kan. OE-nummer hjälper mycket."
            className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
          />
        </label>
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-400 text-center rounded-lg bg-red-400/10 py-2 px-3">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full text-base py-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Skickar…" : "📨 Skicka eftersökning"}
      </button>

      <p className="text-xs text-[var(--color-text-muted)] text-center">
        Eller ring direkt:{" "}
        <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold">
          0171-210 02
        </a>
      </p>
    </form>
  );
}
