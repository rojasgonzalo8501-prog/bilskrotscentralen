import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface CheckoutBody {
  items: { partId: string; sku: string; name: string; priceSek: number; quantity: number }[];
  customer: {
    email: string; phone: string; firstName: string;
    lastName: string; address: string; postalCode: string; city: string;
  };
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.order.count();
  return `MS-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();
    const { items, customer } = body;

    if (!customer.phone) {
      return NextResponse.json({ error: "Telefonnummer krävs för Swish" }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + i.priceSek * i.quantity, 0);
    const shipping = subtotal >= 500 ? 0 : 99;
    const total = subtotal + shipping;
    const vat = Math.round(total * 0.2);

    const orderNumber = await generateOrderNumber();
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/swish/callback`;

    // Swish payment request payload
    const swishPayload = {
      payeeAlias: process.env.SWISH_PAYEE_ALIAS,
      payerAlias: customer.phone.replace(/\D/g, ""),
      amount: total.toString(),
      currency: "SEK",
      message: `Bilskrotscentralen ${orderNumber}`.slice(0, 50),
      callbackUrl,
    };

    // NOTE: Production Swish requires a client certificate (PKCS#12 .p12 file)
    // from your bank. For test environment, use the Swish simulator at:
    // https://developer.swish.nu/documentation/environments
    //
    // To add the certificate, set SWISH_CERT_PATH and SWISH_CERT_PASSPHRASE in .env
    // and uncomment the https agent code below.

    const res = await fetch(
      `${process.env.SWISH_API_URL}/api/v2/paymentrequests`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(swishPayload),
      }
    );

    let token = "";
    if (res.ok || res.status === 201) {
      token = res.headers.get("Location")?.split("/").pop() ?? "";
    } else {
      const err = await res.text();
      console.error("Swish error:", err);
      // Fall through — save order as pending anyway so we can retry
    }

    await db.order.create({
      data: {
        orderNumber,
        email: customer.email,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        postalCode: customer.postalCode,
        city: customer.city,
        subtotalSek: subtotal,
        shippingSek: shipping,
        vatSek: vat,
        totalSek: total,
        paymentMethod: "SWISH",
        paymentStatus: "PENDING",
        swishPaymentRequestToken: token || null,
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

    return NextResponse.json({ orderNumber, token, status: "PENDING" });
  } catch (err) {
    console.error("Swish error:", err);
    return NextResponse.json({ error: "Swish-fel" }, { status: 500 });
  }
}
