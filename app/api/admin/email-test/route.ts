/**
 * GET /api/admin/email-test?to=<email>&type=<all|test|welcome|order|reset>
 *
 * Admin diagnostic that fires sample copies of every customer-facing
 * mail through the same code paths production uses. Admin-only.
 *
 * Types:
 *  - test     (default) — minimal Resend ping, verifies API key + domain
 *  - welcome  — sendWelcomeEmail with a fake account name
 *  - order    — sendOrderConfirmationEmail with one demo line item
 *  - reset    — sendPasswordResetEmail with a real signed token
 *  - all      — runs welcome → order → reset → test in sequence and
 *               reports per-mail status
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/welcome-email";
import { sendOrderConfirmationEmail } from "@/lib/order-emails";
import { sendPasswordResetEmail } from "@/lib/password-reset-email";

export const dynamic = "force-dynamic";

const FROM =
  process.env.RESEND_FROM_EMAIL ??
  "Bilskrotscentralen <noreply@bilskrotscentralen.com>";

type Result = { ok: boolean; note?: string; error?: string };

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ ok: false, reason: "forbidden" }, { status: 403 });
  }

  const rawTo = req.nextUrl.searchParams.get("to")?.trim();
  const type = (req.nextUrl.searchParams.get("type") ?? "test").toLowerCase();

  if (!rawTo || !rawTo.includes("@")) {
    return NextResponse.json(
      { ok: false, reason: "missing-to", hint: "Anropa med ?to=din@email.se&type=all" },
      { status: 400 }
    );
  }
  // Locked to a definite string so closures below don't carry the
  // string | undefined union through capture.
  const to: string = rawTo;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        reason: "missing-api-key",
        hint: "Lägg till RESEND_API_KEY i Vercel → Settings → Environment Variables.",
      },
      { status: 500 }
    );
  }

  const results: Record<string, Result> = {};

  async function runTest(): Promise<Result> {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: FROM,
        to,
        subject: "Test från Bilskrotscentralen",
        html: `<p>Test-ping ${new Date().toLocaleString("sv-SE")}. Om du läser detta funkar Resend, API-nyckeln och domän-verifieringen.</p>`,
        text: "Test-ping.",
      });
      if (error) return { ok: false, error: JSON.stringify(error) };
      return { ok: true, note: `Resend id ${data?.id}` };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }

  async function runWelcome(): Promise<Result> {
    try {
      const r = await sendWelcomeEmail({
        email: to,
        name: "Testkund Testsson",
        username: "test-konto",
      });
      if (!r.ok) return { ok: false, error: r.error };
      return { ok: true, note: "sendWelcomeEmail levererad" };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }

  async function runOrder(): Promise<Result> {
    try {
      const r = await sendOrderConfirmationEmail({
        orderNumber: "MS-TEST-0001",
        email: to,
        firstName: "Test",
        lastName: "Testsson",
        address: "Testgatan 1",
        postalCode: "123 45",
        city: "Enköping",
        subtotalSek: 2000,
        shippingSek: 0,
        vatSek: 500,
        totalSek: 2500,
        items: [
          { partName: "TEST: Strålkastare vänster", priceSek: 2000, quantity: 1 },
        ],
      });
      if (!r.ok) return { ok: false, error: r.error };
      return { ok: true, note: "sendOrderConfirmationEmail levererad" };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }

  async function runReset(): Promise<Result> {
    try {
      const user =
        (await db.user.findFirst({
          where: { email: to.toLowerCase(), active: true },
          select: { id: true, name: true, passwordHash: true },
        })) ??
        ({
          id: "fake-id-for-testing",
          name: "Testkund",
          passwordHash: "fake-hash-for-testing",
        });
      const r = await sendPasswordResetEmail({
        email: to,
        name: user.name,
        userId: user.id,
        passwordHash: user.passwordHash,
      });
      if (!r.ok) return { ok: false, error: r.error };
      return {
        ok: true,
        note:
          user.id === "fake-id-for-testing"
            ? "levererad MEN länken är ogiltig (ingen riktig user matchar e-posten)"
            : "skickat med giltig reset-länk",
      };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }

  if (type === "test") results.test = await runTest();
  else if (type === "welcome") results.welcome = await runWelcome();
  else if (type === "order") results.order = await runOrder();
  else if (type === "reset") results.reset = await runReset();
  else if (type === "all") {
    results.welcome = await runWelcome();
    results.order = await runOrder();
    results.reset = await runReset();
    results.test = await runTest();
  } else {
    return NextResponse.json(
      { ok: false, reason: "unknown-type", validTypes: ["test", "welcome", "order", "reset", "all"] },
      { status: 400 }
    );
  }

  const allOk = Object.values(results).every((r) => r.ok);
  return NextResponse.json({
    ok: allOk,
    from: FROM,
    to,
    type,
    results,
    note: "Kolla inkorg + skräpposten. Vid fel — se 'error'-fältet och Vercel runtime logs.",
  });
}
