import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { verifyResetToken } from "@/lib/password-reset-token";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Välj nytt lösenord — Bilskrotscentralen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Pre-flight check so a stale link doesn't waste the user's time
  // typing a new password before we tell them it's expired.
  let preflight: { ok: boolean; reason?: string } = { ok: false, reason: "malformed" };
  const parts = token.split(".");
  if (parts.length === 3) {
    try {
      const userId = Buffer.from(
        parts[0].replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString("utf-8");
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true, active: true },
      });
      if (user?.active) {
        const v = verifyResetToken(token, user.passwordHash);
        preflight = v.ok
          ? { ok: true }
          : { ok: false, reason: v.reason };
      } else {
        preflight = { ok: false, reason: "invalid" };
      }
    } catch {
      preflight = { ok: false, reason: "malformed" };
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--color-dark-900)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Välj nytt lösenord
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Minst 8 tecken. Mixa gärna stora bokstäver, siffror och tecken.
          </p>
        </div>

        {preflight.ok ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="bg-[var(--color-dark-700)] border border-rose-500/30 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">⏱️</div>
            <h2 className="text-lg font-bold mb-2">
              {preflight.reason === "expired"
                ? "Länken har gått ut"
                : "Länken är inte längre giltig"}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-5">
              {preflight.reason === "expired"
                ? "Reset-länken gäller i 60 minuter. Begär en ny så får du en fräsch."
                : "Det kan vara att lösenordet redan har återställts, eller att länken kopierats fel."}
            </p>
            <Link
              href="/glomt-losenord"
              className="btn-primary inline-block text-sm px-5 py-2.5 rounded-lg"
            >
              Begär ny länk
            </Link>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          <Link href="/logga-in" className="hover:text-[var(--color-text-primary)] transition-colors">
            ← Tillbaka till inloggning
          </Link>
        </div>
      </div>
    </main>
  );
}
