"use server";

import { Resend } from "resend";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export type SkrotaState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitSkrotaBokning(
  _prev: SkrotaState,
  formData: FormData
): Promise<SkrotaState> {
  const namn         = (formData.get("namn")          as string | null)?.trim() ?? "";
  const telefon      = (formData.get("telefon")       as string | null)?.trim() ?? "";
  const email        = (formData.get("email")         as string | null)?.trim() ?? "";
  const regnr        = (formData.get("regnr")         as string | null)?.trim().toUpperCase() ?? "";
  const adress       = (formData.get("adress")        as string | null)?.trim() ?? "";
  const postnummer   = (formData.get("postnummer")    as string | null)?.trim() ?? "";
  const ort          = (formData.get("ort")           as string | null)?.trim() ?? "";
  const ovrigt       = (formData.get("ovrigt")        as string | null)?.trim() ?? "";
  const fabrikat     = (formData.get("fabrikat")      as string | null)?.trim() ?? "";
  const fordonsmodell= (formData.get("fordonsmodell") as string | null)?.trim() ?? "";
  const fordonsaar   = (formData.get("fordonsaar")    as string | null)?.trim() ?? "";
  const betalning    = (formData.get("betalning")     as string | null)?.trim() ?? "swish";

  if (!namn || !telefon || !regnr || !adress) {
    return { status: "error", message: "Fyll i alla obligatoriska fält (*)." };
  }

  const vehicleDesc = fabrikat
    ? `${fabrikat}${fordonsmodell ? ` ${fordonsmodell}` : ""}${fordonsaar ? ` (${fordonsaar})` : ""}`
    : "—";

  const html = `
    <div style="font-family:sans-serif;max-width:560px">
      <h2 style="color:#c87941;margin-bottom:16px">Ny bokningsförfrågan — Rensona Metall</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr style="background:#f9f5f0"><td style="padding:8px 16px;font-weight:600;width:140px">Fordon</td><td style="padding:8px 16px">${esc(vehicleDesc)}</td></tr>
        <tr><td style="padding:8px 16px;font-weight:600">Regnr</td><td style="padding:8px 16px"><strong>${esc(regnr)}</strong></td></tr>
        <tr style="background:#f9f5f0"><td style="padding:8px 16px;font-weight:600">Namn</td><td style="padding:8px 16px">${esc(namn)}</td></tr>
        <tr><td style="padding:8px 16px;font-weight:600">Telefon</td><td style="padding:8px 16px"><a href="tel:${esc(telefon)}">${esc(telefon)}</a></td></tr>
        ${email ? `<tr style="background:#f9f5f0"><td style="padding:8px 16px;font-weight:600">E-post</td><td style="padding:8px 16px"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>` : ""}
        <tr><td style="padding:8px 16px;font-weight:600">Adress</td><td style="padding:8px 16px">${esc(adress)}${postnummer ? `, ${esc(postnummer)}` : ""}${ort ? ` ${esc(ort)}` : ""}</td></tr>
        <tr style="background:#f9f5f0"><td style="padding:8px 16px;font-weight:600">Betalning</td><td style="padding:8px 16px">${esc(betalning)}</td></tr>
        ${ovrigt ? `<tr><td style="padding:8px 16px;font-weight:600">Övrigt</td><td style="padding:8px 16px">${esc(ovrigt)}</td></tr>` : ""}
      </table>
    </div>
  `;

  const subject = fabrikat
    ? `Skrotabokning — ${regnr} ${vehicleDesc.replace(/[^\w\s\-.,åäöÅÄÖ]/g, "")} (${namn.replace(/[^\w\s\-åäöÅÄÖ]/g, "")})`
    : `Skrotabokning — ${regnr} (${namn.replace(/[^\w\s\-åäöÅÄÖ]/g, "")})`;

  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Rensona Metall <noreply@rensona.se>",
        to:   ["info@rensona.se"],
        subject,
        html,
      });
    } else {
      console.log("[skrota-bokning]", { regnr, namn, telefon, email, adress, fabrikat, fordonsmodell, fordonsaar, betalning, ovrigt });
    }
    return { status: "success" };
  } catch (err) {
    console.error("[skrota-bokning] Resend error:", err);
    return { status: "error", message: "Något gick fel. Ring oss direkt på 0171-210 02." };
  }
}
