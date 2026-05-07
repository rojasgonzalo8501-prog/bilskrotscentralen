"use client";

import { useActionState } from "react";
import { findOrder, type FindOrderState } from "./actions";

const initial: FindOrderState = { status: "idle" };

export function FindOrderForm() {
  const [state, formAction, pending] = useActionState(findOrder, initial);

  if (state.status === "sent") {
    return (
      <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
        <div className="text-4xl mb-3">📨</div>
        <h2 className="font-bold text-slate-900 mb-2">Kolla din inkorg</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Om vi har ordrar registrerade på din e-post har vi skickat
          spårningslänkar dit. Hittar du inte mejlet? Kolla skräpposten
          eller ring oss på{" "}
          <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold">
            0171-210 02
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm"
    >
      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] top-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <label>
          Lämna detta fält tomt
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="block">
        <span className="block text-xs text-slate-500 uppercase tracking-wider mb-2 font-bold">
          E-post du beställde med *
        </span>
        <input
          type="email"
          name="email"
          required
          autoFocus
          autoComplete="email"
          placeholder="namn@exempel.se"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
        />
      </label>

      {state.status === "error" && state.message && (
        <p className="text-sm text-rose-700 text-center rounded-lg bg-rose-50 border border-rose-200 py-2 px-3">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors disabled:opacity-60"
      >
        {pending ? "Skickar…" : "📨 Skicka spårningslänkar"}
      </button>
    </form>
  );
}
