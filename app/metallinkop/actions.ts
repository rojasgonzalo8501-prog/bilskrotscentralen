"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type MetallinkopState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function submitMetallinkop(
  _prev: MetallinkopState,
  formData: FormData
): Promise<MetallinkopState> {
  const namn = (formData.get("namn") as string | null)?.trim() ?? "";
  const telefon = (formData.get("telefon") as string | null)?.trim() ?? "";
  const epost = (formData.get("epost") as string | null)?.trim() ?? "";
  const typ = (formData.get("typ") as string | null) ?? "privat"; // "privat" | "foretag"
  const foretag = (formData.get("foretag") as string | null)?.trim() ?? "";
  const orgnr = (formData.get("orgnr") as string | null)?.trim() ?? "";
  const metaller = (formData.get("metaller") as string | null)?.trim() ?? "";
  const vikt = (formData.get("vikt") as string | null)?.trim() ?? "";
  const leverans = (formData.get("leverans") as string | null) ?? "inlamning"; // "inlamning" | "hamtning"
  const adress = (formData.get("adress") as string | null)?.trim() ?? "";
  const meddelande = (formData.get("meddelande") as string | null)?.trim() ?? "";

  if (!namn || !telefon || !metaller) {
    return {
      status: "error",
      message: "Fyll i namn, telefon och vilken metall det gäller.",
    };
  }

  if (typ === "foretag" && !foretag) {
    return {
      status: "error",
      message: "Ange företagsnamn när du valt företag.",
    };
  }

  const html = `
    <h2 style="font-family:sans-serif">Ny metallförfrågan</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Kundtyp</td><td>${escape(typ === "foretag" ? "Företag" : "Privat")}</td></tr>
      ${typ === "foretag" ? `<tr><td style="padding:5px 16px 5px 0;font-weight:bold">Företag</td><td>${escape(foretag)}</td></tr>` : ""}
      ${typ === "foretag" && orgnr ? `<tr><td style="padding:5px 16px 5px 0;font-weight:bold">Org.nr</td><td>${escape(orgnr)}</td></tr>` : ""}
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Namn</td><td>${escape(namn)}</td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Telefon</td><td><a href="tel:${escape(telefon)}">${escape(telefon)}</a></td></tr>
      ${epost ? `<tr><td style="padding:5px 16px 5px 0;font-weight:bold">E-post</td><td><a href="mailto:${escape(epost)}">${escape(epost)}</a></td></tr>` : ""}
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold;color:#888">─ Metall ─</td><td></td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Typ</td><td style="white-space:pre-wrap">${escape(metaller)}</td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Mängd</td><td>${escape(vikt || "—")}</td></tr>
      <tr><td style="padding:5px 16px 5px 0;font-weight:bold">Leverans</td><td>${escape(leverans === "hamtning" ? "Vill ha hämtning" : "Inlämning på Magasingatan 2")}</td></tr>
      ${leverans === "hamtning" && adress ? `<tr><td style="padding:5px 16px 5px 0;font-weight:bold">Adress</td><td>${escape(adress)}</td></tr>` : ""}
      ${meddelande ? `<tr><td style="padding:5px 16px 5px 0;font-weight:bold">Meddelande</td><td style="white-space:pre-wrap">${escape(meddelande)}</td></tr>` : ""}
    </table>
  `;

  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ??
          "Bilskrotscentralen <noreply@bilskrotscentralen.com>",
        to: "info@bilskrotscentralen.com",
        cc: ["adam@bilskrotscentralen.com", "gonzalo@bilskrotscentralen.com"],
        replyTo: epost || undefined,
        subject: `Metallförfrågan — ${typ === "foretag" ? foretag : namn} (${vikt || "vikt okänd"})`,
        html,
      });
    } else {
      console.log("[metallinkop]", {
        namn,
        telefon,
        epost,
        typ,
        foretag,
        orgnr,
        metaller,
        vikt,
        leverans,
        adress,
        meddelande,
      });
    }
    return { status: "success" };
  } catch (err) {
    console.error("[metallinkop] Resend error:", err);
    return {
      status: "error",
      message: "Något gick fel. Ring oss på 0171-210 02 så hjälper vi dig direkt.",
    };
  }
}
