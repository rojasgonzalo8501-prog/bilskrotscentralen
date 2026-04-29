import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Logga in",
  description: "Logga in på Bilskrotscentralen.",
};

type SearchParams = Promise<{ fel?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (session) {
    redirect(
      ["admin", "superadmin"].includes(session.role) ? "/admin" : "/konto"
    );
  }

  const { fel } = await searchParams;
  const hasError = fel === "1";

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden pt-10 pb-20 flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/verkstad-hero.jpeg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-dark-900)]/90 via-[var(--color-dark-900)]/85 to-[var(--color-dark-900)]/95" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.07] rounded-full blur-[120px]" />

      <div className="relative max-w-md mx-auto px-4 w-full">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-center">
          Logga in på <span className="gradient-text">Bilskrotscentralen</span>
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
          Ange dina uppgifter för att fortsätta.
        </p>

        <form
          action={loginAction}
          className="glass rounded-2xl p-6 sm:p-8 space-y-4"
        >
          {hasError && (
            <div className="rounded-lg border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
              Fel användarnamn eller lösenord. Försök igen.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Användarnamn
            </label>
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Lösenord
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold"
          >
            Logga in →
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-[var(--color-text-muted)]">
          Saknar du konto?{" "}
          <Link
            href="/skapa-konto"
            className="text-[var(--color-brand-orange)] hover:underline"
          >
            Skapa konto
          </Link>
        </p>
      </div>
    </section>
  );
}
