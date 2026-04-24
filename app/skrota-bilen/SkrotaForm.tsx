"use client";

import { useActionState } from "react";
import { submitSkrotaForm, type SkrotaState } from "./actions";
import { CITIES } from "@/lib/cities";

const initial: SkrotaState = { status: "idle" };

export function SkrotaForm() {
  const [state, formAction, pending] = useActionState(submitSkrotaForm, initial);

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

  return (
    <form
      action={formAction}
      className="space-y-4 bg-[var(--color-dark-700)] p-6 rounded-2xl border border-[var(--color-dark-500)]"
    >
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
            Registreringsnummer *
          </label>
          <input
            type="text"
            name="regnr"
            required
            placeholder="ABC123"
            className="w-full border border-[var(--color-dark-500)] rounded-lg px-3 py-2.5 text-sm uppercase bg-[var(--color-dark-800)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">
            Ort
          </label>
          <select
            name="ort"
            defaultValue=""
            className="w-full border border-[var(--color-dark-500)] rounded-lg px-3 py-2.5 text-sm bg-[var(--color-dark-800)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
          >
            <option value="" disabled>
              Välj ort
            </option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
            <option value="annan">Annan ort</option>
          </select>
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
  );
}
