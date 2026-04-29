import { NextRequest, NextResponse } from "next/server";
import { getPayment, netsApiBase, netsCheckoutKey } from "@/lib/nets";

/**
 * Debug endpoint — inspects a Nets payment object.
 * Usage: /api/debug/nets?paymentId=<id>
 */
export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.json({ error: "paymentId required" }, { status: 400 });
  }
  try {
    const payment = await getPayment(paymentId);
    const ck = netsCheckoutKey();
    return NextResponse.json({
      env: process.env.NETS_EASY_ENV ?? "test",
      apiBase: netsApiBase(),
      checkoutKeyHint: ck ? `${ck.slice(0, 12)}…(${ck.length}ch)` : "(empty)",
      secretKeyPresent: !!process.env.NETS_EASY_SECRET_KEY,
      secretKeyHint: process.env.NETS_EASY_SECRET_KEY?.slice(0, 12) + "…",
      payment,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
