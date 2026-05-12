/**
 * Order confirmation emails (Resend).
 *
 * Called from EXACTLY ONE caller per order, gated by the atomic
 * `paymentStatus -> PAID` transition (see usage in webhook + bekraftelse).
 * If RESEND_API_KEY is missing we log and no-op so the order flow doesn't
 * fail; the order is already PAID by the time we get here.
 */

import { sendEmail } from "@/lib/email-send";
import { orderTrackingUrl } from "@/lib/order-token";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bilskrotscentralen.com";

type OrderForEmail = {
  orderNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  subtotalSek: number;
  shippingSek: number;
  vatSek: number;
  totalSek: number;
  items: Array<{
    partName: string;
    priceSek: number;
    quantity: number;
  }>;
};

const FROM =
  process.env.RESEND_FROM_EMAIL ??
  "Bilskrotscentralen <noreply@bilskrotscentralen.com>";

const ADMIN_BCC = "info@bilskrotscentralen.com";

function fmt(n: number) {
  return n.toLocaleString("sv-SE");
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(order: OrderForEmail) {
  const trackUrl = orderTrackingUrl(SITE_URL, order.orderNumber);
  const lines = order.items
    .map((it) => {
      const lineTotal = it.priceSek * it.quantity;
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">
            ${escape(it.partName)}
            <span style="color:#888"> × ${it.quantity}</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">
            ${fmt(lineTotal)} kr
          </td>
        </tr>`;
    })
    .join("");

  const fraktRow =
    order.shippingSek === 0
      ? `<tr><td style="padding:4px 0;color:#666">Frakt</td><td style="padding:4px 0;text-align:right;color:#0a8a3a">Gratis</td></tr>`
      : `<tr><td style="padding:4px 0;color:#666">Frakt</td><td style="padding:4px 0;text-align:right">${fmt(order.shippingSek)} kr</td></tr>`;

  return `<!doctype html>
<html lang="sv"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:13px;letter-spacing:1px;color:#888;text-transform:uppercase">Bilskrotscentralen</div>
      <h1 style="margin:8px 0 4px;font-size:22px">Tack för din beställning!</h1>
      <p style="margin:0 0 16px;color:#555;font-size:14px">Vi har tagit emot din betalning. Order packas inom 1–3 arbetsdagar.</p>
      <a href="${trackUrl}" style="display:inline-block;padding:10px 20px;border-radius:8px;background:#ea580c;color:#fff;font-weight:700;font-size:14px;text-decoration:none">Spåra din order →</a>
    </div>

    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <strong style="font-size:15px">Order #${escape(order.orderNumber)}</strong>
        <span style="background:#dcfce7;color:#15803d;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600">✓ Betald</span>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px">
        ${lines}
      </table>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:14px">
        <tr><td style="padding:4px 0;color:#666">Delsumma</td><td style="padding:4px 0;text-align:right">${fmt(order.subtotalSek)} kr</td></tr>
        ${fraktRow}
        <tr><td style="padding:4px 0;color:#666">Moms (25 %)</td><td style="padding:4px 0;text-align:right">${fmt(order.vatSek)} kr</td></tr>
        <tr><td style="padding:10px 0 0;border-top:1px solid #eee;font-weight:700">Totalt</td><td style="padding:10px 0 0;border-top:1px solid #eee;text-align:right;font-weight:700;color:#ea580c">${fmt(order.totalSek)} kr</td></tr>
      </table>
    </div>

    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;margin-bottom:16px;font-size:14px">
      <strong style="display:block;margin-bottom:8px">Leveransadress</strong>
      <div>${escape(order.firstName)} ${escape(order.lastName)}</div>
      <div>${escape(order.address)}</div>
      <div>${escape(order.postalCode)} ${escape(order.city)}</div>
    </div>

    <div style="text-align:center;color:#888;font-size:12px;line-height:1.6">
      Frågor? Ring <a href="tel:+46171210002" style="color:#ea580c">0171-210 02</a><br>
      eller maila <a href="mailto:info@bilskrotscentralen.com" style="color:#ea580c">info@bilskrotscentralen.com</a><br><br>
      Bilskrotscentralen · Magasingatan 2, Enköping
    </div>
  </div>
</body></html>`;
}

function buildText(order: OrderForEmail) {
  const trackUrl = orderTrackingUrl(SITE_URL, order.orderNumber);
  const lines = order.items
    .map((it) => `  ${it.partName} × ${it.quantity}  —  ${fmt(it.priceSek * it.quantity)} kr`)
    .join("\n");
  return `Tack för din beställning!

Order #${order.orderNumber} — Betald ✓

Spåra din order: ${trackUrl}

${lines}

Delsumma:  ${fmt(order.subtotalSek)} kr
Frakt:     ${order.shippingSek === 0 ? "Gratis" : fmt(order.shippingSek) + " kr"}
Moms 25 %: ${fmt(order.vatSek)} kr
Totalt:    ${fmt(order.totalSek)} kr

Leveransadress:
${order.firstName} ${order.lastName}
${order.address}
${order.postalCode} ${order.city}

Frågor? Ring 0171-210 02 eller maila info@bilskrotscentralen.com.

Bilskrotscentralen · Magasingatan 2, Enköping
`;
}

export type EmailSendResult = { ok: true } | { ok: false; error: string };

export async function sendOrderConfirmationEmail(
  order: OrderForEmail
): Promise<EmailSendResult> {
  const r = await sendEmail({
    from: FROM,
    to: order.email,
    bcc: [ADMIN_BCC],
    subject: `Orderbekräftelse #${order.orderNumber} — Bilskrotscentralen`,
    html: buildHtml(order),
    text: buildText(order),
  });
  if (!r.ok) console.error("[order-email] failed:", r.error);
  return r.ok ? { ok: true } : { ok: false, error: r.error };
}
