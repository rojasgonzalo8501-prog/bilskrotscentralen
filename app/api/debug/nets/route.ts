import { NextRequest, NextResponse } from "next/server";
import { getPayment, netsApiBase, netsCheckoutKey, netsCheckoutJs } from "@/lib/nets";

/**
 * Debug endpoint — inspects a Nets payment object or, with no paymentId,
 * just reports the configured environment.
 * Usage: /api/debug/nets[?paymentId=<id>]
 */
export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get("paymentId");
  if (!paymentId) {
    const ck = netsCheckoutKey();
    return NextResponse.json({
      env: process.env.NETS_EASY_ENV ?? "(unset, defaults to test)",
      publicEnv: process.env.NEXT_PUBLIC_NETS_EASY_ENV ?? "(unset)",
      apiBase: netsApiBase(),
      checkoutJs: netsCheckoutJs(),
      checkoutKeyHint: ck ? `${ck.slice(0, 12)}…(${ck.length}ch)` : "(empty)",
      secretKeyPresent: !!process.env.NETS_EASY_SECRET_KEY,
      webhookAuthPresent: !!process.env.NETS_EASY_WEBHOOK_AUTH,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "(unset)",
    });
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
