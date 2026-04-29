"use client";

import { useState, useTransition } from "react";
import { signupAction, type SignupResult } from "./actions";

export function SignupForm() {
  const [error, setError] = useState<string>("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res: SignupResult = await signupAction(fd);
      if (!res.ok && res.error) {
        setError(res.error);
      }
      // On success, the action issues a redirect — control won't return here.
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass rounded-2xl p-6 sm:p-8 space-y-4"
    >
      {error && (
        <div className="rounded-lg border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          Fullständigt namn
        </label>
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder="Anna Andersson"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          E-post
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="anna@exempel.se"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          Användarnamn
        </label>
        <input
          type="text"
          name="username"
          required
          autoComplete="username"
          minLength={3}
          pattern="[a-zA-Z0-9._-]+"
          placeholder="t.ex. anna_a"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all"
        />
        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          Minst 3 tecken. Endast a–z, 0–9, ._-
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          Lösenord
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="new-password"
          minLength={8}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all"
        />
        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          Minst 8 tecken.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          Bekräfta lösenord
        </label>
        <input
          type="password"
          name="confirm"
          required
          autoComplete="new-password"
          minLength={8}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Skapar konto…" : "Skapa konto →"}
      </button>

      <p className="text-[11px] text-[var(--color-text-muted)] text-center">
        Genom att skapa ett konto godkänner du våra{" "}
        <a
          href="/kopvillkor"
          className="text-[var(--color-brand-orange)] hover:underline"
        >
          köpvillkor
        </a>{" "}
        och vår{" "}
        <a
          href="/integritetspolicy"
          className="text-[var(--color-brand-orange)] hover:underline"
        >
          integritetspolicy
        </a>
        .
      </p>
    </form>
  );
}
