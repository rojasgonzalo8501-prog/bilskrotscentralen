"use client";

import { useActionState } from "react";
import { resetPassword, type ResetState } from "./actions";

const initial: ResetState = { status: "idle" };

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, initial);

  return (
    <form
      action={formAction}
      className="bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-2xl p-6 space-y-4"
    >
      <input type="hidden" name="token" value={token} />

      <label className="block">
        <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">
          Nytt lösenord *
        </span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          minLength={8}
          autoComplete="new-password"
          placeholder="Minst 8 tecken"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
        />
      </label>

      <label className="block">
        <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">
          Bekräfta lösenord *
        </span>
        <input
          type="password"
          name="confirm"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Skriv lösenordet igen"
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
        {pending ? "Sparar…" : "Spara nytt lösenord"}
      </button>
    </form>
  );
}
