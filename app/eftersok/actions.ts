"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type EftersokState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitEftersok(
  _prev: EftersokState,
  formData: FormData
): Promise<EftersokState> {
  const namn    = (formData.get("namn")    as string | null)?.trim() ?? "";
  const telefon = (formData.get("telefon") as string | null)?.trim() ?? "";
  const epost   = (formData.get("epost")   as string | null)?.trim() ?? "";
  const del     = (formData.get("del")     as string | null)?.trim() ?? "";
  const regnr   = (formData.get("regnr")   as string | null)?.trim().toUpperCase() ?? "";
  const vin     = (formData.get("vin")     as string | null)?.trim() ?? "";
  const marke   = (formData.get("marke")   as string | null)?.trim() ?? "";
  const modell  = (formData.get("modell")  as string | null)?.trim() ?? "";
  const ar      = (formData.get("ar")      as string | null)?.trim() ?? "";
  const sku     = (formData.get("sku")     as string | null)?.trim() ?? "";

  if (!namn || !telefon || !epost || !del) {
    return { status: "error", message: "Fyll i namn, telefon, e-post och vad du letar efter." };
  }

  // Distinguish a price-on-request inquiry (came from a part page with
  // an existing SKU) from a generic eftersökning so the inbox sees it.
  const isPriceInquiry = Boolean(sku);
  const partUrl = sku ? `https://bilskrotscentralen.com/bildelar/${sku}` : "";

  const html = `
    <h2 style="font-family:sans-serif">${isPriceInquiry ? "Pris-förfrågan" : "Ny eftersökning"}</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Namn</td><td>${namn}</td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Telefon</td><td><a href="tel:${telefon}">${telefon}</a></td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">E-post</td><td><a href="mailto:${epost}">${epost}</a></td></tr>
      ${sku ? `<tr><td style="padding:5px 16px 5px 0;font-weight:bold;color:#888">─ Del ─</td><td></td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Art.nr</td><td><a href="${partUrl}">${sku}</a></td></tr>` : ""}
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold;color:#888">─ Bilen ─</td><td></td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Regnr</td><td>${regnr || "—"}</td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">VIN</td><td>${vin || "—"}</td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Märke</td><td>${marke || "—"}</td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Modell</td><td>${modell || "—"}</td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">År</td><td>${ar || "—"}</td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold;color:#888">─ ${isPriceInquiry ? "Meddelande" : "Söker"} ─</td><td></td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">${isPriceInquiry ? "Kund skrev" : "Söker"}</td><td style="white-space:pre-wrap">${del}</td></tr>
    </table>
  `;

  const subject = isPriceInquiry
    ? `Pris-förfrågan — ${sku} (${namn})`
    : `Eftersökning — ${marke || "okänt märke"} ${modell || ""} (${namn})`;

  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Bilskrotscentralen <noreply@bilskrotscentralen.com>",
        to:   "eftersok@bilskrotscentralen.com",
        cc:   ["adam@bilskrotscentralen.com", "gonzalo@bilskrotscentralen.com"],
        replyTo: epost,
        subject,
        html,
      });
    } else {
      console.log("[eftersok]", { namn, telefon, epost, regnr, vin, marke, modell, ar, del, sku });
    }
    return { status: "success" };
  } catch (err) {
    console.error("[eftersok] Resend error:", err);
    return { status: "error", message: "Något gick fel. Ring oss på 0171-210 02 direkt." };
  }
}
