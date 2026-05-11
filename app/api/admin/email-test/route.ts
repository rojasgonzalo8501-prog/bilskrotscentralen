/**
 * GET /api/admin/email-test?to=<email>
 *
 * Admin-only diagnostic that fires a test email via Resend and reports
 * the response back as JSON. Use this to verify:
 *  - RESEND_API_KEY is set
 *  - The from-domain is verified at Resend
 *  - DNS (SPF/DKIM/DMARC) lets the mail through to the inbox
 *
 * Returns { ok: true, id } on success or { ok: false, reason, error }
 * so problems are obvious without sifting through Vercel logs.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const FROM =
  process.env.RESEND_FROM_EMAIL ??
  "Bilskrotscentralen <noreply@bilskrotscentralen.com>";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }

  const to = req.nextUrl.searchParams.get("to")?.trim();
  if (!to || !to.includes("@")) {
    return NextResponse.json(
      { ok: false, reason: "missing-to", hint: "Anropa med ?to=din@email.se" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, reason: "missing-api-key", hint: "Lägg till RESEND_API_KEY i Vercel → Settings → Environment Variables." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Test från Bilskrotscentralen",
    html: `<p>Det här är ett testmejl skickat från <strong>${FROM}</strong> via Resend kl ${new Date().toLocaleString("sv-SE")}.</p>
           <p>Om du läser det här fungerar Resend, API-nyckeln, och domän-verifieringen.</p>`,
    text: `Test från Bilskrotscentralen — om du läser detta fungerar Resend.`,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, reason: "resend-error", error, from: FROM },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: data?.id, from: FROM, to });
}
