import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SakerhetClient } from "./SakerhetClient";

export const metadata: Metadata = { title: "Säkerhet — Admin" };
export const dynamic = "force-dynamic";

export default async function SakerhetPage() {
  const session = await getSession();
  if (!session) redirect("/logga-in");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { username: true, totpEnabled: true },
  });
  if (!user) redirect("/logga-in");

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Säkerhet</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">
          <span className="gradient-text">Säkerhet</span>
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Tvåfaktor-autentisering (TOTP) — samma som Google Authenticator.
        </p>
      </div>

      <div className="max-w-2xl">
        <SakerhetClient
          initialStatus={user.totpEnabled ? "enabled" : "disabled"}
          username={user.username}
        />
      </div>
    </section>
  );
}
