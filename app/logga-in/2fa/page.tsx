import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPending2FA } from "@/lib/auth";
import { verify2faAction, cancel2faAction } from "./actions";

export const metadata: Metadata = {
  title: "Tvåfaktor — Bilskrotscentralen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TwoFactorPage({
  searchParams,
}: {
  searchParams: Promise<{ fel?: string }>;
}) {
  const { fel } = await searchParams;
  const pending = await getPending2FA();
  if (!pending) redirect("/logga-in");

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--color-dark-900)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Tvåfaktor-verifiering
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Öppna din authenticator-app och skriv 6-siffriga koden för
            Bilskrotscentralen.
          </p>
        </div>

        <form
          action={verify2faAction}
          className="bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-2xl p-6 space-y-4"
        >
          <label className="block">
            <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">
              Engångskod *
            </span>
            <input
              type="text"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              required
              maxLength={6}
              pattern="[0-9]{6}"
              placeholder="123 456"
              className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-2xl font-mono tracking-widest text-center text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
            />
          </label>

          {fel && (
            <p className="text-sm text-rose-400 text-center rounded-lg bg-rose-400/10 py-2 px-3">
              Felaktig kod. Kontrollera tiden på din telefon och försök igen.
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full text-base py-3 rounded-xl"
          >
            Verifiera och logga in
          </button>
        </form>

        <form action={cancel2faAction} className="mt-4 text-center">
          <button
            type="submit"
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            ← Avbryt och börja om
          </button>
        </form>
      </div>
    </main>
  );
}
