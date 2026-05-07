"use server";

import { Resend } from "resend";
import { db } from "@/lib/db";

export type ApplyState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

const FROM =
  process.env.RESEND_FROM_EMAIL ??
  "Bilskrotscentralen <noreply@bilskrotscentralen.com>";

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function applyForB2B(
  _prev: ApplyState,
  formData: FormData
): Promise<ApplyState> {
  // Honeypot
  const trap = String(formData.get("company_url") ?? "").trim();
  if (trap) return { status: "sent" };

  const company  = String(formData.get("company")  ?? "").trim();
  const orgNr    = String(formData.get("orgNr")    ?? "").trim();
  const name     = String(formData.get("name")     ?? "").trim();
  const phone    = String(formData.get("phone")    ?? "").trim();
  const email    = String(formData.get("email")    ?? "").trim().toLowerCase();
  const employees = String(formData.get("employees") ?? "").trim();
  const focus    = String(formData.get("focus")    ?? "").trim();
  const note     = String(formData.get("note")     ?? "").trim();

  if (!company || !orgNr || !name || !phone || !email) {
    return {
      status: "error",
      message: "Fyll i företag, org-nr, kontaktperson, telefon och e-post.",
    };
  }
  if (!email.includes("@")) {
    return { status: "error", message: "Ogiltig e-postadress." };
  }

  // Compose a human-readable message body so admins see context at a
  // glance in the förfrågningar inbox.
  const message = [
    `Företag: ${company}`,
    `Org-nr: ${orgNr}`,
    employees && `Antal anställda: ${employees}`,
    focus && `Specialitet / märken: ${focus}`,
    note && `\nÖvrigt:\n${note}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Persist as a Lead so it shows up in /admin/eftersok with the
  // status workflow the inbox already supports.
  try {
    await db.lead.create({
      data: {
        kind: "WORKSHOP_APPLICATION",
        name,
        phone,
        email,
        brand: company,   // repurposed: holds the company name
        regnr: orgNr,     // repurposed: holds the org number
        partName: focus || null,
        message,
      },
    });
  } catch (err) {
    console.error("[b2b/anslut] Lead persist failed:", err);
    return {
      status: "error",
      message: "Något gick fel. Ring oss på 0171-210 02 så hjälper vi dig.",
    };
  }

  // Email admins so the application can't sit unseen in the inbox.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const html = `
        <h2 style="font-family:sans-serif">Ny B2B-ansökan</h2>
        <table style="font-family:sans-serif;border-collapse:collapse">
          <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Företag</td><td>${escape(company)}</td></tr>
          <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Org-nr</td><td>${escape(orgNr)}</td></tr>
          <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Kontakt</td><td>${escape(name)}</td></tr>
          <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Telefon</td><td><a href="tel:${escape(phone)}">${escape(phone)}</a></td></tr>
          <tr><td style="padding:5px 16px 5px 0;font-weight:bold">E-post</td><td><a href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
          ${employees ? `<tr><td style="padding:5px 16px 5px 0;font-weight:bold">Anställda</td><td>${escape(employees)}</td></tr>` : ""}
          ${focus ? `<tr><td style="padding:5px 16px 5px 0;font-weight:bold">Specialitet</td><td>${escape(focus)}</td></tr>` : ""}
          ${note ? `<tr><td style="padding:5px 16px 5px 0;font-weight:bold;vertical-align:top">Övrigt</td><td style="white-space:pre-wrap">${escape(note)}</td></tr>` : ""}
        </table>
        <p style="font-family:sans-serif;font-size:13px;color:#888;margin-top:18px">
          Ärendet har även lagts in i <a href="https://bilskrotscentralen.com/admin/eftersok?status=new">/admin/eftersok</a>.
        </p>
      `;
      await resend.emails.send({
        from: FROM,
        to: "info@bilskrotscentralen.com",
        cc: ["adam@bilskrotscentralen.com", "gonzalo@bilskrotscentralen.com"],
        replyTo: email,
        subject: `B2B-ansökan: ${company}`,
        html,
      });
    } catch (err) {
      console.error("[b2b/anslut] Resend error:", err);
      // Lead is saved either way; don't fail the user.
    }
  }

  return { status: "sent" };
}
