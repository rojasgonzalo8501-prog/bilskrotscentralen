/**
 * POST /api/faktura/send
 * Body: { invoiceId: string }
 *
 * Generates the PDF, sends it via Resend to the customer's email,
 * and marks the invoice as SENT.
 */
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { InvoicePDF, COMPANY, type InvoiceData } from "@/lib/invoice-pdf";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { invoiceId, toEmail: overrideEmail } = body as {
    invoiceId: string;
    toEmail?: string;
  };

  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId required" }, { status: 400 });
  }

  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const recipientEmail = overrideEmail ?? invoice.customerEmail;
  if (!recipientEmail) {
    return NextResponse.json(
      { error: "No email address on invoice. Add one or pass toEmail in the request." },
      { status: 400 }
    );
  }

  // ── Build PDF ──────────────────────────────────────────────────────────────
  const data: InvoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate.toISOString().split("T")[0],
    dueDate: invoice.dueDate.toISOString().split("T")[0],
    paymentTerms: invoice.paymentTerms,
    writtenBy: invoice.writtenBy ?? "Adam",
    isExport: invoice.isExport,
    customerName: invoice.customerName,
    customerEmail: recipientEmail,
    customerPhone: invoice.customerPhone ?? undefined,
    customerAddress: invoice.customerAddress ?? undefined,
    customerPostal: invoice.customerPostal ?? undefined,
    customerCity: invoice.customerCity ?? undefined,
    customerOrgNr: invoice.customerOrgNr ?? undefined,
    customerRef: invoice.customerRef ?? undefined,
    note: invoice.note ?? undefined,
    reqNumber: invoice.reqNumber ?? undefined,
    expeditionFee: invoice.expeditionFee,
    shippingFee: invoice.shippingFee,
    subtotalSek: invoice.subtotalSek,
    vatSek: invoice.vatSek,
    totalSek: invoice.totalSek,
    items: invoice.items.map((item) => ({
      taxCode: item.taxCode,
      description: item.description,
      year: item.year ?? undefined,
      carMake: item.carMake ?? undefined,
      itemType: item.itemType ?? undefined,
      quantity: item.quantity,
      unitPriceSek: item.unitPriceSek,
      vatPercent: item.vatPercent,
      amountSek: item.amountSek,
    })),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(React.createElement(InvoicePDF, { data }) as any);

  // ── Send via Resend ─────────────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_placeholder") {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured. Add it to .env." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? `faktura@${process.env.RESEND_FROM_DOMAIN ?? "bilskrotscentralen.com"}`;

  const { error: sendError } = await resend.emails.send({
    from: `Bilskrotscentralen i Sverige AB <${fromAddress}>`,
    to: [recipientEmail],
    bcc: ["adam@bilskrotscentralen.com", "gonzalo@bilskrotscentralen.com"],
    replyTo: COMPANY.email,
    subject: `Faktura ${invoice.invoiceNumber} från Bilskrotscentralen i Sverige AB`,
    html: buildEmailHtml(data),
    attachments: [
      {
        filename: `faktura-${invoice.invoiceNumber}.pdf`,
        content: Buffer.from(pdfBuffer),
      },
    ],
  });

  if (sendError) {
    console.error("Resend error:", sendError);
    return NextResponse.json({ error: String(sendError) }, { status: 500 });
  }

  // ── Mark invoice as SENT ───────────────────────────────────────────────────
  await db.invoice.update({
    where: { id: invoiceId },
    data: {
      status: "SENT",
      sentAt: new Date(),
      // Update email if it was overridden
      ...(overrideEmail ? { customerEmail: overrideEmail } : {}),
    },
  });

  return NextResponse.json({ success: true, invoiceNumber: invoice.invoiceNumber });
}

/* ─── HTML email body ─────────────────────────────────────────── */
function buildEmailHtml(data: InvoiceData): string {
  const total = data.totalSek.toLocaleString("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const itemRows = data.items
    .map(
      (i) => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;">${i.description}${i.carMake ? ` (${i.carMake}${i.year ? " " + i.year : ""})` : ""}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${i.amountSek.toLocaleString("sv-SE")} kr</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#222;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

      <!-- Header -->
      <tr>
        <td style="background:#1a1a1a;padding:24px 32px;">
          <table width="100%"><tr>
            <td><span style="font-size:20px;font-weight:900;color:#fff;">BILSKROTSCENTRALEN</span><br>
              <span style="font-size:12px;color:#aaa;">Bilskrotscentralen i Sverige AB</span></td>
            <td align="right">
              <span style="background:#ff6b1a;color:#fff;font-size:13px;font-weight:700;padding:6px 14px;border-radius:4px;">FAKTURA ${data.invoiceNumber}</span>
            </td>
          </tr></table>
        </td>
      </tr>

      <!-- Greeting -->
      <tr><td style="padding:28px 32px 0;">
        <p style="margin:0 0 8px;font-size:15px;">Hej ${data.customerName.split(" ")[0]},</p>
        <p style="margin:0;color:#555;font-size:14px;">
          Tack för din beställning! Bifogat hittar du faktura nr <strong>${data.invoiceNumber}</strong>
          att betala senast <strong>${data.dueDate}</strong>.
        </p>
      </td></tr>

      <!-- Summary box -->
      <tr><td style="padding:20px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:6px;overflow:hidden;">
          <tr style="background:#f9f9f9;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Artikel</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Belopp</th>
          </tr>
          ${itemRows}
          ${data.expeditionFee > 0 ? `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;">Expeditionsavgift</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${data.expeditionFee.toLocaleString("sv-SE")} kr</td></tr>` : ""}
          ${data.shippingFee > 0 ? `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;">Frakt</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${data.shippingFee.toLocaleString("sv-SE")} kr</td></tr>` : ""}
          <tr style="background:#fff8f0;">
            <td style="padding:12px;font-weight:700;font-size:15px;">ATT BETALA</td>
            <td style="padding:12px;font-weight:700;font-size:16px;text-align:right;color:#e55d00;">${total} kr</td>
          </tr>
        </table>
      </td></tr>

      <!-- Payment info -->
      <tr><td style="padding:0 32px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f8ff;border-radius:6px;padding:16px;">
          <tr><td>
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;">Betalningsinformation</p>
            <p style="margin:0;font-size:13px;color:#555;line-height:1.7;">
              Bankgiro: <strong>${COMPANY.bankgiro}</strong><br>
              IBAN: <strong>${COMPANY.iban}</strong> (SWIFT: ${COMPANY.swift})<br>
              Förfallodatum: <strong>${data.dueDate}</strong><br>
              <span style="color:#d44;">Obs! Ange fakturanummer ${data.invoiceNumber} vid betalning.</span>
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #eee;">
        <table width="100%"><tr>
          <td style="font-size:12px;color:#888;line-height:1.6;">
            ${COMPANY.name} · ${COMPANY.address} · ${COMPANY.postal}<br>
            Tel: ${COMPANY.phone} · ${COMPANY.email}<br>
            Org.nr: ${COMPANY.orgNo} · Momsreg: ${COMPANY.vatNo} · F-skatt
          </td>
          <td align="right">
            <p style="margin:0;font-size:13px;font-weight:700;color:#333;">TACK &amp; VÄLKOMMEN ÅTER!</p>
          </td>
        </tr></table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
