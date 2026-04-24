import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Swish calls this URL when a payment request is updated.
// The body contains the payment result.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id: paymentRequestToken, status, payerAlias } = body;

    if (!paymentRequestToken) {
      return new NextResponse("Missing id", { status: 400 });
    }

    if (status === "PAID") {
      // Mark order as paid
      await db.order.updateMany({
        where: { swishPaymentRequestToken: paymentRequestToken },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      });

      // Reserve parts
      const order = await db.order.findFirst({
        where: { swishPaymentRequestToken: paymentRequestToken },
        include: { items: true },
      });
      if (order) {
        await Promise.all(
          order.items.map((item) =>
            db.part.update({ where: { id: item.partId }, data: { status: "RESERVED" } })
          )
        );
      }

      console.log(`Swish payment PAID: token=${paymentRequestToken} payer=${payerAlias}`);
    } else if (status === "DECLINED" || status === "ERROR" || status === "CANCELLED") {
      await db.order.updateMany({
        where: { swishPaymentRequestToken: paymentRequestToken },
        data: { paymentStatus: "FAILED", status: "CANCELLED" },
      });
      console.log(`Swish payment ${status}: token=${paymentRequestToken}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("Swish callback error:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
