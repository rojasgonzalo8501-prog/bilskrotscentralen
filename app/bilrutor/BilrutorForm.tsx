"use client";

import { useActionState } from "react";
import { submitBilrutorForm, type BilrutorState } from "./actions";

const RUTA_TYPER = ["Vindruta", "Bakruta", "Sidoruta fram vänster", "Sidoruta fram höger", "Sidoruta bak vänster", "Sidoruta bak höger", "Taklucka", "Annan"];

const initial: BilrutorState = { status: "idle" };

export default function BilrutorForm() {
  const [state, action, pending] = useActionState(submitBilrutorForm, initial);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-green-500/25 bg-green-500/8 p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-black mb-2">Förfrågan skickad!</h3>
        <p className="text-[var(--color-text-secondary)] text-sm max-w-sm mx-auto">
          Vi återkommer med pris och tillgänglighet inom kort. Har du bråttom — ring direkt på{" "}
          <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold">0171-210 02</a>.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      {/* ─── Kund ─── */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Dina uppgifter</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field name="namn"    label="Namn *"    placeholder="Anna Svensson" />
          <Field name="telefon" label="Telefon *" placeholder="070-000 00 00" type="tel" />
          <Field name="epost"   label="E-post"    placeholder="anna@mail.se"  type="email" />
        </div>
      </div>

      {/* ─── Fordon ─── */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Fordon</h3>
        <div className="grid sm:grid-cols-4 gap-4">
          <Field name="regnr"  label="Regnummer *" placeholder="ABC123"      className="uppercase" />
          <Field name="marke"  label="Märke"        placeholder="Mercedes"   />
          <Field name="modell" label="Modell"       placeholder="E220 CDI"   />
          <Field name="ar"     label="Årsmodell"    placeholder="2018"       type="number" />
        </div>
      </div>

      {/* ─── Ruta ─── */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Vilken ruta?</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {/* Ruta type — visual radio buttons */}
          <div>
            <label className="block text-xs text-[var(--color-text-muted)] mb-2">Typ av ruta *</label>
            <div className="grid grid-cols-2 gap-2">
              {RUTA_TYPER.map((typ) => (
                <label key={typ} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[var(--color-dark-500)] bg-[var(--color-dark-700)] cursor-pointer has-[:checked]:border-[var(--color-brand-orange)] has-[:checked]:bg-[var(--color-brand-orange)]/10 transition-colors text-sm">
                  <input type="radio" name="rutaTyp" value={typ} className="accent-orange-500" required />
                  {typ}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Field name="sida" label="Extra info om position (valfritt)" placeholder="T.ex. vänster bak, med el-värme..." />
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">Övrigt (valfritt)</label>
              <textarea
                name="ovrigt"
                rows={4}
                placeholder="T.ex. ruta med regnsensor, ADAS-kamera, panoramatak..."
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {state.status === "error" && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
      >
        {pending ? "Skickar…" : "Skicka förfrågan →"}
      </button>
    </form>
  );
}

function Field({
  name, label, placeholder, type = "text", className = "",
}: {
  name: string; label: string; placeholder?: string; type?: string; className?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[var(--color-text-muted)] mb-1">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors ${className}`}
      />
    </div>
  );
}
