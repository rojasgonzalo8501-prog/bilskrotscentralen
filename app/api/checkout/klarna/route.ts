import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface CartLine {
  partId: string;
  sku: string;
  name: string;
  priceSek: number;
  quantity: number;
}

interface CheckoutBody {
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

function klarnaAuth() {
  const creds = Buffer.from(
    `${process.env.KLARNA_USERNAME}:${process.env.KLARNA_PASSWORD}`
  ).toString("base64");
  return `Basic ${creds}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();
    const { items, customer } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Tom varukorg" }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + i.priceSek * i.quantity, 0);
    const shipping = subtotal >= 500 ? 0 : 99;
    const total = subtotal + shipping;
    const vat = Math.round(total * 0.2); // 25% VAT (total includes VAT)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const klarnaOrder = {
      purchase_country: "SE",
      purchase_currency: "SEK",
      locale: "sv-SE",
      order_amount: total * 100,   // Klarna uses öre
      order_tax_amount: vat * 100,
      order_lines: items.map((item) => ({
        type: "physical",
        reference: item.sku,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.priceSek * 100,
        tax_rate: 2500,
        total_amount: item.priceSek * item.quantity * 100,
        total_tax_amount: Math.round(item.priceSek * item.quantity * 100 * 0.2),
      })),
      billing_address: {
        given_name: customer.firstName,
        family_name: customer.lastName,
        email: customer.email,
        phone: customer.phone ?? "",
        street_address: customer.address,
        postal_code: customer.postalCode,
        city: customer.city,
        country: "SE",
      },
      merchant_urls: {
        terms: `${baseUrl}/villkor`,
        checkout: `${baseUrl}/kassa`,
        confirmation: `${baseUrl}/kassa/bekraftelse?klarna_order_id={checkout.order.id}`,
        push: `${baseUrl}/api/checkout/klarna/confirm`,
      },
    };

    const res = await fetch(
      `${process.env.KLARNA_API_URL}/checkout/v3/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: klarnaAuth(),
        },
        body: JSON.stringify(klarnaOrder),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Klarna error:", err);
      return NextResponse.json(
        { error: "Klarna-fel: " + res.status },
        { status: 500 }
      );
    }

    const data = await res.json();

    // Create pending order in our DB
    const orderNumber = await generateOrderNumber();
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
        paymentMethod: "KLARNA",
        paymentStatus: "PENDING",
        klarnaOrderId: data.order_id,
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
      klarnaOrderId: data.order_id,
      htmlSnippet: data.html_snippet,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.order.count();
  return `MS-${year}-${String(count + 1).padStart(4, "0")}`;
}
