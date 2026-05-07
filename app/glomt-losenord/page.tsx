import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Glömt lösenord — Bilskrotscentralen",
  robots: { index: false, follow: false },
};

export default function GlomtLosenordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--color-dark-900)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Glömt lösenordet?
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Skriv in din e-post så skickar vi en återställnings-länk.
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          <Link href="/logga-in" className="hover:text-[var(--color-text-primary)] transition-colors">
            ← Tillbaka till inloggning
          </Link>
        </div>
      </div>
    </main>
  );
}
