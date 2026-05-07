"use client";

import { useActionState } from "react";
import { applyForB2B, type ApplyState } from "./actions";

const initial: ApplyState = { status: "idle" };

function Field({
  label, name, type = "text", required, placeholder,
}: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">
        {label}{required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
      />
    </label>
  );
}

export function AnslutForm() {
  const [state, formAction, pending] = useActionState(applyForB2B, initial);

  if (state.status === "sent") {
    return (
      <div className="glass rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold">Tack — ansökan inskickad!</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto">
          Vi går igenom ansökan inom 1–3 arbetsdagar och ringer upp för en
          kort genomgång innan vi öppnar kontot. Frågor under tiden? Ring{" "}
          <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold hover:underline">
            0171-210 02
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] top-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <label>
          Lämna detta fält tomt
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-3 font-bold">Företag</div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Företagsnamn" name="company" required placeholder="Bengts Bilservice AB" />
          <Field label="Org-nr" name="orgNr" required placeholder="556789-1234" />
        </div>
      </div>

      <div className="border-t border-[var(--color-dark-500)] pt-5">
        <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-3 font-bold">Kontaktperson</div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Namn" name="name" required placeholder="Bengt Andersson" />
          <Field label="Telefon" name="phone" type="tel" required placeholder="070-123 45 67" />
        </div>
        <div className="mt-5">
          <Field label="E-post" name="email" type="email" required placeholder="bengt@verkstad.se" />
        </div>
      </div>

      <div className="border-t border-[var(--color-dark-500)] pt-5">
        <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-3 font-bold">Verkstaden (valfritt)</div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Antal anställda" name="employees" type="number" placeholder="3" />
          <Field label="Specialitet / märken" name="focus" placeholder="Mercedes-Benz, BMW" />
        </div>
        <label className="block mt-5">
          <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">
            Övrigt
          </span>
          <textarea
            name="note"
            rows={3}
            placeholder="Volym per månad, särskilda önskemål, etc."
            className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
          />
        </label>
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-rose-400 text-center rounded-lg bg-rose-400/10 py-2 px-3">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full text-base py-4 rounded-xl disabled:opacity-60"
      >
        {pending ? "Skickar…" : "Skicka ansökan →"}
      </button>

      <p className="text-xs text-[var(--color-text-muted)] text-center">
        Genom att skicka in godkänner du att vi gör en sedvanlig
        kreditkontroll innan vi öppnar fakturakonto.
      </p>
    </form>
  );
}
