"use client";

import { useActionState } from "react";
import { changePassword, type ChangeState } from "./actions";

const initial: ChangeState = { status: "idle" };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initial);

  return (
    <form action={formAction} className="glass rounded-2xl p-6 sm:p-8 space-y-5 max-w-md">
      <label className="block">
        <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">
          Nuvarande lösenord *
        </span>
        <input
          type="password"
          name="current"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
        />
      </label>
      <label className="block">
        <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">
          Nytt lösenord * (min 8 tecken)
        </span>
        <input
          type="password"
          name="next"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
        />
      </label>
      <label className="block">
        <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">
          Bekräfta nytt lösenord *
        </span>
        <input
          type="password"
          name="confirm"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
        />
      </label>
      {state.status === "error" && state.message && (
        <p className="text-sm text-rose-400 rounded-lg bg-rose-400/10 py-2 px-3">{state.message}</p>
      )}
      {state.status === "ok" && state.message && (
        <p className="text-sm text-emerald-400 rounded-lg bg-emerald-400/10 py-2 px-3">✓ {state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full text-base py-3 rounded-xl disabled:opacity-60"
      >
        {pending ? "Sparar…" : "Spara nytt lösenord"}
      </button>
    </form>
  );
}
