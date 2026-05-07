"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitEftersok, type EftersokState } from "./actions";

const initial: EftersokState = { status: "idle" };

function Field({
  label, name, type = "text", required, placeholder, defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
      />
    </label>
  );
}

function EftersokFormInner() {
  const sp = useSearchParams();
  const [state, formAction, pending] = useActionState(submitEftersok, initial);

  // Pre-fill from URL params (set by "Fråga om pris" buttons on
  // price-less part pages so the customer just adds contact info).
  const prefillSku    = sp.get("sku")    ?? "";
  const prefillDel    = sp.get("del")    ?? "";
  const prefillRegnr  = sp.get("regnr")  ?? "";
  const prefillMarke  = sp.get("marke")  ?? "";
  const prefillModell = sp.get("modell") ?? "";
  const prefillAr     = sp.get("ar")     ?? "";
  // If we got a SKU+name we know this is a "Fråga om pris"-flow.
  const isPriceInquiry = Boolean(prefillSku && prefillDel);

  if (state.status === "success") {
    return (
      <div className="glass rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <div className="text-5xl">📨</div>
        <h3 className="text-2xl font-bold">
          {isPriceInquiry ? "Förfrågan skickad!" : "Eftersökning skickad!"}
        </h3>
        <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto">
          {isPriceInquiry
            ? "Vi återkommer med pris och tillgänglighet inom 24 h."
            : "Adam kollar lagret personligen och återkommer inom 24 h."}{" "}
          Ring gärna{" "}
          <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold hover:underline">
            0171-210 02
          </a>{" "}
          om det är bråttom.
        </p>
      </div>
    );
  }

  // Body for the textarea: the part name + SKU if we got it, otherwise empty.
  const delDefault = isPriceInquiry
    ? `Vill ha pris på: ${prefillDel} (Art.nr ${prefillSku}).`
    : prefillDel;

  return (
    <form action={formAction} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
      {isPriceInquiry && (
        <div className="rounded-xl bg-[var(--color-brand-orange)]/10 border border-[var(--color-brand-orange)]/30 px-4 py-3 text-sm">
          <div className="text-[10px] font-bold text-[var(--color-brand-orange)] uppercase tracking-widest mb-1">
            Pris-förfrågan
          </div>
          <div className="font-semibold">{prefillDel}</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Art.nr {prefillSku}
          </div>
        </div>
      )}

      {/* Hidden SKU so the email/lead can be linked back to the part */}
      {prefillSku && <input type="hidden" name="sku" value={prefillSku} />}

      {/* Honeypot — bots fill in any field they can find. Real users
          never see this because tabIndex=-1 and aria-hidden + offscreen.
          The server-side action discards the submission if it's set. */}
      <div
        aria-hidden
        className="absolute left-[-9999px] top-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none"
      >
        <label>
          Lämna detta fält tomt
          <input
            type="text"
            name="company_url"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Ditt namn" name="namn" required />
        <Field label="Telefon" name="telefon" type="tel" required />
      </div>
      <Field label="E-post" name="epost" type="email" required />

      <div className="border-t border-[var(--color-dark-500)] pt-5">
        <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Bilen</div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Registreringsnummer" name="regnr" placeholder="ABC 123" defaultValue={prefillRegnr} />
          <Field label="Eller VIN" name="vin" placeholder="WDB..." />
        </div>
        <div className="grid sm:grid-cols-3 gap-5 mt-5">
          <Field label="Märke" name="marke" placeholder="Mercedes-Benz" defaultValue={prefillMarke} />
          <Field label="Modell" name="modell" placeholder="E220 CDI" defaultValue={prefillModell} />
          <Field label="Årsmodell" name="ar" placeholder="2014" type="number" defaultValue={prefillAr} />
        </div>
      </div>

      <div className="border-t border-[var(--color-dark-500)] pt-5">
        <label className="block">
          <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            {isPriceInquiry ? "Något du vill tillägga?" : "Vad letar du efter? *"}
          </span>
          <textarea
            name="del"
            rows={5}
            required={!isPriceInquiry}
            defaultValue={delDefault}
            placeholder={isPriceInquiry
              ? "T.ex. brådskande, behöver leverans till..."
              : "Beskriv delen så detaljerat du kan. OE-nummer hjälper mycket."}
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
        {pending ? "Skickar…" : isPriceInquiry ? "📨 Skicka pris-förfrågan" : "📨 Skicka eftersökning"}
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

export function EftersokForm() {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <EftersokFormInner />
    </Suspense>
  );
}
