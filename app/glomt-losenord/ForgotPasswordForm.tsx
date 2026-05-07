"use client";

import { useActionState } from "react";
import { requestPasswordReset, type ForgotState } from "./actions";

const initial: ForgotState = { status: "idle" };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initial);

  if (state.status === "sent") {
    return (
      <div className="bg-[var(--color-dark-700)] border border-emerald-500/30 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">📨</div>
        <h2 className="text-lg font-bold mb-2">Kolla din inkorg</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Om e-posten finns hos oss har vi precis skickat dig en länk för att
          välja nytt lösenord. Länken är giltig i 60 minuter.
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-4">
          Hittar du inte mejlet? Kolla skräpposten — eller ring oss på{" "}
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
      className="bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-2xl p-6 space-y-4"
    >
      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] top-0 w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <label>
          Lämna detta fält tomt
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="block">
        <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">
          E-post *
        </span>
        <input
          type="email"
          name="email"
          required
          autoFocus
          autoComplete="email"
          placeholder="namn@exempel.se"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
        />
      </label>

      {state.status === "error" && state.message && (
        <p className="text-sm text-rose-400 text-center rounded-lg bg-rose-400/10 py-2 px-3">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full text-base py-3 rounded-xl disabled:opacity-60"
      >
        {pending ? "Skickar…" : "Skicka återställnings-länk"}
      </button>
    </form>
  );
}
