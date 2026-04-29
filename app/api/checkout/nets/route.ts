import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createPayment } from "@/lib/nets";

interface CartLine {
  partId: string;
  sku: string;
  name: string;
  priceSek: number;
  quantity: number;
}

interface Body {
  items: CartLine[];
  customer: {
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const { items, customer } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Tom varukorg" }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + i.priceSek * i.quantity, 0);
    const shipping = subtotal >= 500 ? 0 : 99;
    const total = subtotal + shipping;
    // Total is gross (incl. VAT). Net = total / 1.25, VAT = total - net.
    const net = Math.round(total / 1.25);
    const vat = total - net;

    // Nets validates that the iframe's parent origin matches checkout.url.
    // We MUST use the actual origin the request came from, otherwise the
    // payment form silently refuses to render. Order of preference:
    //   1. Origin header (most accurate — matches the page the user sees)
    //   2. host header → derived URL
    //   3. NEXT_PUBLIC_BASE_URL (legacy fallback, can be wrong)
    //   4. hardcoded production domain
    const originHeader = req.headers.get("origin");
    const hostHeader = req.headers.get("host");
    const baseUrl =
      originHeader ??
      (hostHeader ? `https://${hostHeader}` : null) ??
      process.env.NEXT_PUBLIC_BASE_URL ??
      "https://bilskrotscentralen.com";

    const orderNumber = await generateOrderNumber();

    const nets = await createPayment({
      orderNumber,
      items: items.map((i) => ({
        reference: i.sku,
        name: i.name,
        quantity: i.quantity,
        unitPriceSek: i.priceSek,
        vatPercent: 25,
      })),
      shippingSek: shipping,
      customer,
      baseUrl,
    });

    await db.order.create({
      data: {
        orderNumber,
        email: customer.email,
        phone: customer.phone ?? null,
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        postalCode: customer.postalCode,
        city: customer.city,
        subtotalSek: subtotal,
        shippingSek: shipping,
        vatSek: vat,
        totalSek: total,
        paymentMethod: "NETS_EASY",
        paymentStatus: "PENDING",
        netsPaymentId: nets.paymentId,
        items: {
          create: items.map((i) => ({
            partId: i.partId,
            partSku: i.sku,
            partName: i.name,
            priceSek: i.priceSek,
            quantity: i.quantity,
          })),
        },
      },
    });

    return NextResponse.json({
      paymentId: nets.paymentId,
      checkoutKey: nets.checkoutKey,
      checkoutJs: nets.checkoutJs,
      hostedPaymentPageUrl: nets.hostedPaymentPageUrl,
      orderNumber,
    });
  } catch (err) {
    console.error("Nets checkout error:", err);
    const msg = err instanceof Error ? err.message : "Serverfel";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.order.count();
  return `MS-${year}-${String(count + 1).padStart(4, "0")}`;
}
