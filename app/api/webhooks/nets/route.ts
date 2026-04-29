import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPayment, isPaymentSuccessful } from "@/lib/nets";
import { createInvoiceFromOrder } from "@/lib/invoice-utils";
import { sendOrderConfirmationEmail } from "@/lib/order-emails";

/**
 * Nets Easy webhook receiver.
 *
 * Configured via the `notifications.webhooks` block when the payment is
 * created. Nets sends an `Authorization` header equal to the value we
 * registered (NETS_EASY_WEBHOOK_AUTH); we verify it before trusting the
 * payload. We don't trust amounts/state from the body — we re-fetch the
 * payment over our authenticated channel and act on that.
 *
 * Events we care about (others are ack'd 200 and ignored):
 *   - payment.checkout.completed → reservation succeeded → order PAID
 *   - payment.charge.created     → confirmation of capture (idempotent)
 *   - payment.cancel.created     → order cancelled → status FAILED
 */
export async function POST(req: NextRequest) {
  const expected = process.env.NETS_EASY_WEBHOOK_AUTH;
  if (expected) {
    const got = req.headers.get("authorization") ?? "";
    if (got !== expected) {
      console.warn("[nets webhook] auth mismatch");
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  let payload: { event?: string; data?: { paymentId?: string } };
  try {
    payload = await req.json();
  } catch {
    return new NextResponse("Bad JSON", { status: 400 });
  }

  const event = payload.event ?? "";
  const paymentId = payload.data?.paymentId;
  if (!paymentId) {
    return new NextResponse("Missing paymentId", { status: 400 });
  }

  try {
    if (event.startsWith("payment.cancel")) {
      await db.order.updateMany({
        where: { netsPaymentId: paymentId },
        data: { paymentStatus: "FAILED", status: "CANCELLED" },
      });
      return NextResponse.json({ ok: true });
    }

    // For completed / charge events, re-fetch from Nets so we trust the
    // amounts before flipping the order to PAID.
    const remote = await getPayment(paymentId);
    if (!isPaymentSuccessful(remote)) {
      return NextResponse.json({ ok: true, skipped: "not yet successful" });
    }

    const order = await db.order.findFirst({
      where: { netsPaymentId: paymentId },
      include: { items: true },
    });
    if (!order) {
      console.warn("[nets webhook] no DB order for", paymentId);
      return new NextResponse("Order not found", { status: 200 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ ok: true, alreadyPaid: true });
    }

    // Atomic transition guard: only the caller that flips PENDING→PAID
    // proceeds with side-effects (parts/invoice/email). Webhook + bekraftelse
    // page can race; this ensures exactly one of them does the work.
    const transition = await db.order.updateMany({
      where: { id: order.id, paymentStatus: { not: "PAID" } },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
    });

    if (transition.count === 0) {
      // Lost the race to bekraftelse page — that's fine.
      return NextResponse.json({ ok: true, alreadyHandled: true });
    }

    // Reserve the parts so they don't show as available
    await Promise.all(
      order.items.map((item) =>
        db.part.update({
          where: { id: item.partId },
          data: { status: "RESERVED" },
        })
      )
    );

    // Auto-generate invoice (non-fatal if it fails)
    try {
      await createInvoiceFromOrder(order.id);
    } catch (e) {
      console.error("[nets webhook] invoice creation failed:", e);
    }

    // Send order confirmation email (non-fatal if it fails)
    try {
      await sendOrderConfirmationEmail(order);
    } catch (e) {
      console.error("[nets webhook] email send failed:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[nets webhook] error:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
