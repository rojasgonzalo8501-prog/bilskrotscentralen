"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SkrotaState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 16px 6px 0;font-weight:bold;white-space:nowrap">${label}</td><td>${value}</td></tr>`;
}

export async function submitSkrotaForm(
  _prev: SkrotaState,
  formData: FormData
): Promise<SkrotaState> {
  const namn         = (formData.get("namn")         as string | null)?.trim() ?? "";
  const telefon      = (formData.get("telefon")      as string | null)?.trim() ?? "";
  const regnr        = (formData.get("regnr")        as string | null)?.trim().toUpperCase() ?? "";
  const ort          = (formData.get("ort")          as string | null)?.trim() ?? "";
  const email        = (formData.get("email")        as string | null)?.trim() ?? "";
  const adress       = (formData.get("adress")       as string | null)?.trim() ?? "";
  const ovrigt       = (formData.get("ovrigt")       as string | null)?.trim() ?? "";
  const fabrikat     = (formData.get("fabrikat")     as string | null)?.trim() ?? "";
  const fordonsmodell = (formData.get("fordonsmodell") as string | null)?.trim() ?? "";
  const fordonsaar   = (formData.get("fordonsaar")   as string | null)?.trim() ?? "";

  if (!namn || !telefon || !regnr || !adress) {
    return { status: "error", message: "Fyll i alla obligatoriska fält (*)." };
  }

  const vehicleDesc = fabrikat
    ? `${fabrikat}${fordonsmodell ? ` ${fordonsmodell}` : ""}${fordonsaar ? ` (${fordonsaar})` : ""}`
    : "—";

  const html = `
    <h2 style="font-family:sans-serif">Ny bokningsförfrågan — Skrota bilen</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${fabrikat ? row("Fordon", vehicleDesc) : ""}
      ${row("Regnr", regnr)}
      ${row("Namn", namn)}
      ${row("Telefon", `<a href="tel:${telefon}">${telefon}</a>`)}
      ${email ? row("E-post", `<a href="mailto:${email}">${email}</a>`) : ""}
      ${row("Ort", ort || "—")}
      ${row("Adress", adress)}
      ${ovrigt ? row("Övrigt", ovrigt) : ""}
    </table>
  `;

  const subject = fabrikat
    ? `Skrotaförfrågan — ${regnr} ${vehicleDesc} (${namn})`
    : `Skrotaförfrågan — ${regnr} (${namn})`;

  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Bilskrotscentralen <noreply@bilskrotscentralen.com>",
        to:   "info@bilskrotscentralen.com",
        cc:   ["adam@bilskrotscentralen.com", "gonzalo@bilskrotscentralen.com"],
        subject,
        html,
      });
    } else {
      console.log("[skrota-form]", { regnr, namn, telefon, email, ort, adress, ovrigt, fabrikat, fordonsmodell, fordonsaar });
    }
    return { status: "success" };
  } catch (err) {
    console.error("[skrota-form] Resend error:", err);
    return { status: "error", message: "Något gick fel. Ring oss direkt på 0171-210 02." };
  }
}
