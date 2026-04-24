import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Polled by the frontend to check if a Swish payment has been completed.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("order");

  if (!orderNumber) {
    return NextResponse.json({ error: "order required" }, { status: 400 });
  }

  const order = await db.order.findFirst({
    where: { orderNumber },
    select: { paymentStatus: true, status: true, orderNumber: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.paymentStatus,
    orderStatus: order.status,
  });
}
