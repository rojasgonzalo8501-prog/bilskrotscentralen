"use server";

import { Resend } from "resend";
import { db } from "@/lib/db";
import { orderTrackingUrl } from "@/lib/order-token";

export type FindOrderState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

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

/**
 * Re-send tracking links for every order matching the supplied email.
 * Always responds "if the email matches, links are on the way" so we
 * don't leak which addresses have ordered.
 */
export async function findOrder(
  _prev: FindOrderState,
  formData: FormData
): Promise<FindOrderState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  // Honeypot
  const trap = String(formData.get("company_url") ?? "").trim();
  if (trap) return { status: "sent" };

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Skriv en giltig e-postadress." };
  }

  try {
    const orders = await db.order.findMany({
      where: { email },
      select: {
        orderNumber: true,
        firstName: true,
        createdAt: true,
        totalSek: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    if (orders.length > 0 && process.env.RESEND_API_KEY) {
      const links = orders
        .map((o) => {
          const url = orderTrackingUrl(SITE_URL, o.orderNumber);
          const date = o.createdAt.toLocaleDateString("sv-SE", {
            day: "numeric", month: "short", year: "numeric",
          });
          return `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee">
              <strong>#${escape(o.orderNumber)}</strong>
              <span style="color:#888"> · ${date} · ${o.totalSek.toLocaleString("sv-SE")} kr</span>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">
              <a href="${url}" style="color:#ea580c;text-decoration:none;font-weight:700">Spåra →</a>
            </td>
          </tr>`;
        })
        .join("");

      const html = `<!doctype html>
<html lang="sv"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px">
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:24px">
      <div style="font-size:13px;letter-spacing:1px;color:#888;text-transform:uppercase;margin-bottom:6px">Bilskrotscentralen</div>
      <h1 style="margin:0 0 12px;font-size:20px">Dina order-spårningslänkar</h1>
      <p style="margin:0 0 16px;color:#444;font-size:14px">
        Här är alla dina ordrar hos oss. Klicka på "Spåra →" för att se
        status, leveransadress och artiklar.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${links}
      </table>
      <p style="margin:18px 0 0;color:#888;font-size:12px">
        Var det inte du som bad om det här? Då kan du ignorera mejlet —
        ingen ändring sker.
      </p>
    </div>
  </div>
</body></html>`;

      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: `Dina order-spårningslänkar — Bilskrotscentralen`,
          html,
        });
      } catch (err) {
        console.error("[findOrder] Resend error:", err);
        // Don't reveal — neutral response below.
      }
    }
  } catch (err) {
    console.error("[findOrder]", err);
  }

  return { status: "sent" };
}
