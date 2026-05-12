/**
 * Welcome email sent on /skapa-konto success.
 *
 * Best-effort: failures are logged but never block account creation.
 * The user is already authenticated by the time we get here, so a
 * missed welcome mail is a soft loss — they can always reach support.
 */

import { sendEmail } from "@/lib/email-send";

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

export type EmailSendResult = { ok: true } | { ok: false; error: string };

export async function sendWelcomeEmail(opts: {
  email: string;
  name: string;
  username: string;
}): Promise<EmailSendResult> {

  const html = `<!doctype html>
<html lang="sv"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:13px;letter-spacing:1px;color:#888;text-transform:uppercase">Bilskrotscentralen</div>
      <h1 style="margin:8px 0 4px;font-size:22px">Välkommen, ${escape(opts.name.split(" ")[0])}!</h1>
      <p style="margin:0;color:#555;font-size:14px">Ditt konto är skapat och redo att användas.</p>
    </div>

    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;margin-bottom:16px;font-size:14px;color:#333;line-height:1.6">
      <p style="margin:0 0 12px"><strong>Användarnamn:</strong> ${escape(opts.username)}</p>
      <p style="margin:0 0 20px">
        Logga in på <a href="${SITE_URL}/logga-in" style="color:#ea580c">${SITE_URL.replace(/^https?:\/\//, "")}/logga-in</a>
        för att se ordrar, spara delar och hantera dina uppgifter.
      </p>
      <p style="text-align:center;margin:24px 0 8px">
        <a href="${SITE_URL}/bildelar" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#ea580c;color:#fff;font-weight:700;font-size:15px;text-decoration:none">
          Bläddra bildelar →
        </a>
      </p>
    </div>

    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;margin-bottom:16px;font-size:13px;color:#444;line-height:1.6">
      <strong style="display:block;margin-bottom:10px;font-size:14px">Vad du kan göra som inloggad</strong>
      <ul style="margin:0;padding-left:18px">
        <li>Spara delar i din lista (hjärtat) — kom tillbaka när du vill</li>
        <li>Snabbare kassa med sparade leveransadresser</li>
        <li>Se status på dina ordrar i realtid</li>
        <li>Köp igen-knapp på tidigare beställningar</li>
      </ul>
    </div>

    <div style="text-align:center;color:#888;font-size:12px;line-height:1.6">
      Frågor? Ring <a href="tel:+46171210002" style="color:#ea580c">0171-210 02</a>
      eller maila <a href="mailto:info@bilskrotscentralen.com" style="color:#ea580c">info@bilskrotscentralen.com</a><br><br>
      Bilskrotscentralen · Magasingatan 2, Enköping
    </div>
  </div>
</body></html>`;

  const text = `Välkommen, ${opts.name.split(" ")[0]}!

Ditt konto är skapat.

Användarnamn: ${opts.username}
Logga in: ${SITE_URL}/logga-in

Vad du kan göra som inloggad:
- Spara delar i din lista (hjärtat)
- Snabbare kassa med sparade leveransadresser
- Se status på dina ordrar i realtid
- "Köp igen"-knapp på tidigare beställningar

Frågor? Ring 0171-210 02 eller info@bilskrotscentralen.com.

Bilskrotscentralen · Magasingatan 2, Enköping
`;

  const r = await sendEmail({
    from: FROM,
    to: opts.email,
    subject: `Välkommen till Bilskrotscentralen, ${opts.name.split(" ")[0]}!`,
    html,
    text,
  });
  if (!r.ok) console.error("[welcome-email] failed:", r.error);
  return r.ok ? { ok: true } : { ok: false, error: r.error };
}
