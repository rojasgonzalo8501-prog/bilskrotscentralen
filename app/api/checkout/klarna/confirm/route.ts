import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createInvoiceFromOrder } from "@/lib/invoice-utils";

// Klarna calls this endpoint (push URL) when payment is completed.
// We acknowledge the order back to Klarna and mark it paid in our DB.
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const klarnaOrderId = searchParams.get("klarna_order_id");

    if (!klarnaOrderId) {
      return new NextResponse("Missing klarna_order_id", { status: 400 });
    }

    // Fetch order details from Klarna to verify
    const creds = Buffer.from(
      `${process.env.KLARNA_USERNAME}:${process.env.KLARNA_PASSWORD}`
    ).toString("base64");

    const klarnaRes = await fetch(
      `${process.env.KLARNA_API_URL}/checkout/v3/orders/${klarnaOrderId}`,
      { headers: { Authorization: `Basic ${creds}` } }
    );

    if (!klarnaRes.ok) {
      console.error("Could not fetch Klarna order", klarnaOrderId);
      return new NextResponse("Klarna fetch failed", { status: 500 });
    }

    const klarnaOrder = await klarnaRes.json();

    if (klarnaOrder.status === "checkout_complete") {
      // Mark as paid in our database
      await db.order.updateMany({
        where: { klarnaOrderId },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
        },
      });

      // Mark parts as RESERVED (they have a buyer)
      const order = await db.order.findFirst({ where: { klarnaOrderId }, include: { items: true } });
      if (order) {
        await Promise.all(
          order.items.map((item) =>
            db.part.update({ where: { id: item.partId }, data: { status: "RESERVED" } })
          )
        );
      }

      // Auto-create invoice for the paid order
      if (order) {
        try {
          await createInvoiceFromOrder(order.id);
        } catch (invErr) {
          console.error("Invoice creation failed (non-fatal):", invErr);
        }
      }

      // Acknowledge to Klarna so they finalize the order
      await fetch(
        `${process.env.KLARNA_API_URL}/checkout/v3/orders/${klarnaOrderId}/acknowledgement`,
        {
          method: "POST",
          headers: { Authorization: `Basic ${creds}` },
        }
      );
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("Klarna confirm error:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
