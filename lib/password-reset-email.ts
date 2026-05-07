/**
 * Password-reset email — sends a one-time link tied to the user.
 *
 * Always returns void. Failures are logged but never thrown — the
 * server action that calls this should not reveal whether an email
 * was actually sent (it should always tell the user "if the address
 * exists, an email is on its way") to avoid leaking which addresses
 * are registered.
 */

import { Resend } from "resend";
import { buildResetToken } from "@/lib/password-reset-token";

const FROM =
  process.env.RESEND_FROM_EMAIL ??
  "Bilskrotscentralen <noreply@bilskrotscentralen.com>";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bilskrotscentralen.com";

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendPasswordResetEmail(opts: {
  email: string;
  name: string;
  userId: string;
  passwordHash: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[password-reset] RESEND_API_KEY missing — skipping email");
    return;
  }

  const token = buildResetToken({
    userId: opts.userId,
    passwordHash: opts.passwordHash,
  });
  const url = `${SITE_URL.replace(/\/+$/, "")}/aterstall-losenord/${token}`;

  const html = `<!doctype html>
<html lang="sv"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px">
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:28px">
      <div style="font-size:13px;letter-spacing:1px;color:#888;text-transform:uppercase;margin-bottom:6px">Bilskrotscentralen</div>
      <h1 style="margin:0 0 14px;font-size:22px">Återställ ditt lösenord</h1>
      <p style="margin:0 0 18px;color:#444;font-size:15px;line-height:1.55">
        Hej ${escape(opts.name)},
      </p>
      <p style="margin:0 0 18px;color:#444;font-size:15px;line-height:1.55">
        Vi fick en förfrågan om att återställa lösenordet på ditt konto.
        Klicka på knappen nedan för att välja ett nytt. Länken är giltig i
        60 minuter.
      </p>
      <p style="text-align:center;margin:24px 0">
        <a href="${url}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#ea580c;color:#fff;font-weight:700;font-size:15px;text-decoration:none">
          Välj nytt lösenord →
        </a>
      </p>
      <p style="margin:0 0 12px;color:#666;font-size:13px;line-height:1.55">
        Eller kopiera länken till webbläsaren:<br>
        <a href="${url}" style="color:#ea580c;word-break:break-all">${url}</a>
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="margin:0;color:#888;font-size:13px;line-height:1.55">
        Var det inte du som bad om det här? Då kan du ignorera mejlet —
        ditt nuvarande lösenord fortsätter att fungera.
      </p>
    </div>
    <div style="text-align:center;color:#888;font-size:12px;line-height:1.6;margin-top:14px">
      Bilskrotscentralen · Magasingatan 2, Enköping<br>
      <a href="tel:+46171210002" style="color:#888">0171-210 02</a>
    </div>
  </div>
</body></html>`;

  const text = `Hej ${opts.name},

Vi fick en förfrågan om att återställa lösenordet på ditt konto.
Öppna länken nedan för att välja ett nytt. Länken är giltig i 60 minuter.

${url}

Var det inte du som bad om det här? Då kan du ignorera mejlet — ditt
nuvarande lösenord fortsätter att fungera.

Bilskrotscentralen · 0171-210 02
`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.email,
      subject: "Återställ ditt lösenord — Bilskrotscentralen",
      html,
      text,
    });
    if (error) console.error("[password-reset] Resend error:", error);
  } catch (err) {
    console.error("[password-reset] send threw:", err);
  }
}
