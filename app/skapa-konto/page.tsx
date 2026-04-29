import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Skapa konto",
  description:
    "Skapa ett kundkonto hos Bilskrotscentralen — snabbare checkout, sparade uppgifter och full koll på dina ordrar.",
};

export default async function SignupPage() {
  const session = await getSession();
  if (session) {
    redirect(
      ["admin", "superadmin"].includes(session.role) ? "/admin" : "/konto",
    );
  }

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
          Skapa konto på <span className="gradient-text">Bilskrotscentralen</span>
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
          Snabbare checkout, sparade uppgifter och en överblick av dina ordrar.
        </p>

        <SignupForm />

        <p className="text-center mt-6 text-xs text-[var(--color-text-muted)]">
          Har du redan ett konto?{" "}
          <Link
            href="/logga-in"
            className="text-[var(--color-brand-orange)] hover:underline"
          >
            Logga in
          </Link>
        </p>
      </div>
    </section>
  );
}
