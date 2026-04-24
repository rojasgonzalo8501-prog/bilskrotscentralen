"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SkrotaState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitSkrotaForm(
  _prev: SkrotaState,
  formData: FormData
): Promise<SkrotaState> {
  const namn    = (formData.get("namn")    as string | null)?.trim() ?? "";
  const telefon = (formData.get("telefon") as string | null)?.trim() ?? "";
  const regnr   = (formData.get("regnr")   as string | null)?.trim().toUpperCase() ?? "";
  const ort     = (formData.get("ort")     as string | null)?.trim() ?? "";
  const adress  = (formData.get("adress")  as string | null)?.trim() ?? "";
  const ovrigt  = (formData.get("ovrigt")  as string | null)?.trim() ?? "";

  if (!namn || !telefon || !regnr || !adress) {
    return { status: "error", message: "Fyll i alla obligatoriska fält (*)." };
  }

  const html = `
    <h2 style="font-family:sans-serif">Ny bokningsförfrågan — Skrota bilen</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Namn</td><td>${namn}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Telefon</td><td><a href="tel:${telefon}">${telefon}</a></td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Regnr</td><td>${regnr}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Ort</td><td>${ort || "—"}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Adress</td><td>${adress}</td></tr>
      <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Övrigt</td><td>${ovrigt || "—"}</td></tr>
    </table>
  `;

  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Bilskrotscentralen <noreply@bilskrotscentralen.se>",
        to:   "info@bilskrotscentralen.se",
        cc:   ["adam@bilskrotscentralen.se", "gonzalo@bilskrotscentralen.se"],
        subject: `Bokningsförfrågan — ${regnr} (${namn})`,
        html,
      });
    } else {
      // Dev: logga till konsolen tills RESEND_API_KEY sätts
      console.log("[skrota-form]", { namn, telefon, regnr, ort, adress, ovrigt });
    }
    return { status: "success" };
  } catch (err) {
    console.error("[skrota-form] Resend error:", err);
    return { status: "error", message: "Något gick fel. Ring oss direkt på 0171-210 02." };
  }
}
