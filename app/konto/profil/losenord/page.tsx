import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata: Metadata = {
  title: "Byt lösenord — Mitt konto",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const session = await getSession();
  if (!session) redirect("/logga-in");

  return (
    <section className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/konto" className="hover:text-[var(--color-brand-orange)]">Mitt konto</Link>
        <span>›</span>
        <Link href="/konto/profil" className="hover:text-[var(--color-brand-orange)]">Profil</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Byt lösenord</span>
      </nav>

      <h1 className="text-3xl font-black tracking-tight mb-2">Byt lösenord</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">
        Du behöver kunna ditt nuvarande lösenord. Glömt det? Gå till{" "}
        <Link href="/glomt-losenord" className="text-[var(--color-brand-orange)] hover:underline">
          /glomt-losenord
        </Link>{" "}
        istället.
      </p>

      <ChangePasswordForm />
    </section>
  );
}
