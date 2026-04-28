"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type BilrutorState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitBilrutorForm(
  _prev: BilrutorState,
  formData: FormData
): Promise<BilrutorState> {
  const namn      = (formData.get("namn")      as string | null)?.trim() ?? "";
  const telefon   = (formData.get("telefon")   as string | null)?.trim() ?? "";
  const epost     = (formData.get("epost")     as string | null)?.trim() ?? "";
  const regnr     = (formData.get("regnr")     as string | null)?.trim().toUpperCase() ?? "";
  const marke     = (formData.get("marke")     as string | null)?.trim() ?? "";
  const modell    = (formData.get("modell")    as string | null)?.trim() ?? "";
  const ar        = (formData.get("ar")        as string | null)?.trim() ?? "";
  const rutaTyp   = (formData.get("rutaTyp")   as string | null)?.trim() ?? "";
  const sida      = (formData.get("sida")      as string | null)?.trim() ?? "";
  const ovrigt    = (formData.get("ovrigt")    as string | null)?.trim() ?? "";

  if (!namn || !telefon || !regnr || !rutaTyp) {
    return { status: "error", message: "Fyll i namn, telefon, regnummer och typ av ruta." };
  }

  const html = `
    <h2 style="font-family:sans-serif;margin:0 0 16px">Ny bilruta-förfrågan</h2>
    <table style="font-family:sans-serif;border-collapse:collapse;font-size:14px">
      <tr style="background:#f5f5f5"><td colspan="2" style="padding:8px 16px;font-weight:bold;color:#555">Kund</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold;min-width:120px">Namn</td><td>${namn}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Telefon</td><td><a href="tel:${telefon}">${telefon}</a></td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">E-post</td><td>${epost ? `<a href="mailto:${epost}">${epost}</a>` : "—"}</td></tr>

      <tr style="background:#f5f5f5"><td colspan="2" style="padding:8px 16px;font-weight:bold;color:#555">Fordon</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Regnummer</td><td><strong>${regnr}</strong></td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Märke</td><td>${marke || "—"}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Modell</td><td>${modell || "—"}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Årsmodell</td><td>${ar || "—"}</td></tr>

      <tr style="background:#f5f5f5"><td colspan="2" style="padding:8px 16px;font-weight:bold;color:#555">Ruta</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Typ</td><td><strong>${rutaTyp}</strong></td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Sida / position</td><td>${sida || "—"}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Övrigt</td><td style="white-space:pre-wrap">${ovrigt || "—"}</td></tr>
    </table>
  `;

  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      await resend.emails.send({
        from: "Bilskrotscentralen <noreply@bilskrotscentralen.com>",
        to:   "info@bilskrotscentralen.com",
        cc:   ["adam@bilskrotscentralen.com", "gonzalo@bilskrotscentralen.com"],
        replyTo: epost || undefined,
        subject: `Bilruta-förfrågan — ${rutaTyp} · ${regnr} (${namn})`,
        html,
      });
    } else {
      console.log("[bilrutor-form]", { namn, telefon, epost, regnr, marke, modell, ar, rutaTyp, sida, ovrigt });
    }
    return { status: "success" };
  } catch (err) {
    console.error("[bilrutor-form] Resend error:", err);
    return { status: "error", message: "Något gick fel. Ring oss direkt på 0171-210 02." };
  }
}
