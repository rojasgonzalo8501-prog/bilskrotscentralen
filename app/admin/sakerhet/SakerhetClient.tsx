"use client";

import { useState, useTransition } from "react";
import { startEnrollment, verifyEnrollment, disable2fa } from "./actions";
import { otpauthUrl, qrCodeUrl } from "@/lib/totp";

const ISSUER = "Bilskrotscentralen";

type Status = "disabled" | "enrolling" | "enabled";

export function SakerhetClient({
  initialStatus,
  username,
}: {
  initialStatus: "disabled" | "enabled";
  username: string;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  function start() {
    setError(null);
    startTransition(async () => {
      const r = await startEnrollment();
      if (r.ok && r.secret) {
        setSecret(r.secret);
        setStatus("enrolling");
        setCode("");
      } else if (!r.ok) {
        setError(r.error);
      }
    });
  }

  function confirmEnrollment() {
    if (!/^\d{6}$/.test(code)) {
      setError("Skriv den 6-siffriga koden från din authenticator-app.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const r = await verifyEnrollment(code);
      if (r.ok) {
        setStatus("enabled");
        setSecret(null);
        setCode("");
        setFeedback("✓ Tvåfaktor är nu aktiv på ditt konto.");
      } else {
        setError(r.error);
      }
    });
  }

  function turnOff() {
    if (!/^\d{6}$/.test(code)) {
      setError("Skriv en 6-siffrig kod från appen för att bekräfta.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const r = await disable2fa(code);
      if (r.ok) {
        setStatus("disabled");
        setCode("");
        setFeedback("Tvåfaktor är nu avaktiverat.");
      } else {
        setError(r.error);
      }
    });
  }

  if (status === "enabled") {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="font-bold text-emerald-300">2FA är aktiv</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Vid varje inloggning frågar vi efter en 6-siffrig kod från din
              authenticator-app utöver lösenordet.
            </p>
          </div>
        </div>

        <details className="rounded-2xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
          <summary className="text-sm font-bold cursor-pointer text-rose-300 hover:text-rose-200">
            Avaktivera 2FA
          </summary>
          <p className="text-xs text-[var(--color-text-muted)] mt-3 mb-3">
            Skriv en aktuell 6-siffrig kod från appen för att bekräfta att det
            är du.
          </p>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123 456"
              className="px-4 py-2 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-lg text-base font-mono tracking-widest focus:outline-none focus:border-[var(--color-brand-orange)] w-40"
            />
            <button
              type="button"
              onClick={turnOff}
              disabled={pending}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 disabled:opacity-50"
            >
              {pending ? "Avaktiverar…" : "Avaktivera"}
            </button>
          </div>
          {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
          {feedback && status !== "enabled" && (
            <p className="text-xs text-emerald-400 mt-2">{feedback}</p>
          )}
        </details>
      </div>
    );
  }

  if (status === "enrolling" && secret) {
    const otpauth = otpauthUrl({ secret, account: username, issuer: ISSUER });
    const qr = qrCodeUrl(otpauth, 220);
    return (
      <div className="space-y-5">
        <ol className="space-y-5">
          <li className="rounded-2xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
            <h3 className="font-bold mb-2">1. Installera en authenticator-app</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Använd Google Authenticator, 1Password, Authy eller Microsoft
              Authenticator. (Vilken som helst som stöder TOTP.)
            </p>
          </li>

          <li className="rounded-2xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
            <h3 className="font-bold mb-3">2. Skanna QR-koden</h3>
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr}
                alt="QR-kod för 2FA"
                width={220}
                height={220}
                className="rounded-lg bg-white p-2 shrink-0"
              />
              <div className="text-sm text-[var(--color-text-secondary)] space-y-3">
                <p>Öppna appen, välj ”Lägg till konto” / ”Scan QR code”.</p>
                <details>
                  <summary className="text-xs text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text-secondary)]">
                    Kan inte skanna? Visa hemlig nyckel manuellt
                  </summary>
                  <code className="block mt-2 px-3 py-2 bg-[var(--color-dark-800)] rounded font-mono text-xs break-all">
                    {secret}
                  </code>
                </details>
              </div>
            </div>
          </li>

          <li className="rounded-2xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
            <h3 className="font-bold mb-2">3. Bekräfta med en kod från appen</h3>
            <div className="flex gap-2 flex-wrap mt-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                pattern="[0-9]{6}"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123 456"
                autoFocus
                className="px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-lg text-xl font-mono tracking-widest focus:outline-none focus:border-[var(--color-brand-orange)] w-44 text-center"
              />
              <button
                type="button"
                onClick={confirmEnrollment}
                disabled={pending}
                className="btn-primary px-5 py-3 rounded-lg text-sm disabled:opacity-50"
              >
                {pending ? "Verifierar…" : "Aktivera 2FA"}
              </button>
            </div>
            {error && <p className="text-sm text-rose-400 mt-3">{error}</p>}
          </li>
        </ol>
      </div>
    );
  }

  // status === "disabled"
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <h3 className="font-bold text-amber-200">Tvåfaktor är inte aktiverat</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Admin-konton bör ha 2FA på. Det stoppar 99 % av kontostöldsförsök
            även om någon får tag i ditt lösenord.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={start}
        disabled={pending}
        className="btn-primary px-5 py-3 rounded-xl text-sm disabled:opacity-50"
      >
        {pending ? "Förbereder…" : "🔐 Aktivera 2FA"}
      </button>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {feedback && <p className="text-sm text-emerald-400">{feedback}</p>}
    </div>
  );
}
