import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Logga in",
  description:
    "Logga in på Bilskrotscentralen — välj mellan kundportal och adminportal.",
};

type SearchParams = Promise<{ fel?: string; portal?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Already logged in? Send them where they belong.
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/konto");
  }

  const { fel, portal } = await searchParams;
  const activePortal = portal === "admin" ? "admin" : "customer";
  const hasError = fel === "1";

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden pt-10 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-dark-900)] via-[#0f0d1a] to-[var(--color-dark-900)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

      <div className="relative max-w-md mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-center">
          Logga in på <span className="gradient-text">Merca</span>
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
          Välj portal och ange dina uppgifter.
        </p>

        {/* Portal toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] mb-6">
          <PortalTab
            label="Kundportal"
            sub="För dig som handlar"
            active={activePortal === "customer"}
            href="/logga-in?portal=customer"
          />
          <PortalTab
            label="Adminportal"
            sub="Endast personal"
            active={activePortal === "admin"}
            href="/logga-in?portal=admin"
          />
        </div>

        {/* Login form */}
        <form
          action={loginAction}
          className="glass rounded-2xl p-6 sm:p-8 space-y-4"
        >
          <input type="hidden" name="portal" value={activePortal} />

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
              placeholder={activePortal === "admin" ? "admin" : "kund"}
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

          <div className="pt-4 border-t border-[var(--color-dark-500)] text-xs text-[var(--color-text-muted)] leading-relaxed">
            <div className="font-semibold text-[var(--color-text-secondary)] mb-1">
              Demo-konton
            </div>
            <div>
              Kund: <code className="text-[var(--color-brand-orange-light)]">kund</code> / <code className="text-[var(--color-brand-orange-light)]">kund123</code>
            </div>
            <div>
              Admin: <code className="text-[var(--color-brand-orange-light)]">admin</code> / <code className="text-[var(--color-brand-orange-light)]">admin123</code>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function PortalTab({
  label,
  sub,
  active,
  href,
}: {
  label: string;
  sub: string;
  active: boolean;
  href: string;
}) {
  return (
    <a
      href={href}
      className={`rounded-lg px-4 py-3 text-center transition-all ${
        active
          ? "bg-[var(--color-brand-orange)] text-white shadow-lg"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      }`}
    >
      <div className="text-sm font-bold">{label}</div>
      <div
        className={`text-[10px] uppercase tracking-wider ${
          active ? "text-white/80" : "text-[var(--color-text-muted)]"
        }`}
      >
        {sub}
      </div>
    </a>
  );
}
