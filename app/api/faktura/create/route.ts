import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getNextInvoiceNumber, computeDueDate, computeInvoiceTotals } from "@/lib/invoice-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName, customerEmail, customerPhone,
      customerAddress, customerPostal, customerCity,
      customerOrgNr, customerRef, note, reqNumber,
      paymentTerms = 10, isExport = false, writtenBy = "Adam",
      expeditionFee = 0, shippingFee = 0,
      items = [],
      andSend = false,
    } = body;

    if (!customerName) {
      return NextResponse.json({ error: "customerName required" }, { status: 400 });
    }

    const invoiceNumber = await getNextInvoiceNumber();
    const invoiceDate = new Date();
    const dueDate = computeDueDate(invoiceDate, paymentTerms);

    const mappedItems = (items as {
      taxCode: string; description: string; year?: string; carMake?: string;
      itemType?: string; quantity: number; unitPriceSek: number;
      vatPercent: number; amountSek: number;
    }[]).map((item, idx) => ({
      taxCode: item.taxCode ?? "A",
      description: item.description,
      year: item.year ?? null,
      carMake: item.carMake ?? null,
      itemType: item.itemType ?? null,
      quantity: item.quantity,
      unitPriceSek: item.unitPriceSek,
      vatPercent: item.vatPercent ?? 25,
      amountSek: item.amountSek ?? item.unitPriceSek * item.quantity,
      sortOrder: idx,
    }));

    const totals = computeInvoiceTotals(
      mappedItems.map((i) => ({
        taxCode: i.taxCode,
        unitPriceSek: i.unitPriceSek,
        quantity: i.quantity,
        vatPercent: i.vatPercent,
      })),
      expeditionFee,
      shippingFee
    );

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        paymentTerms,
        invoiceDate,
        dueDate,
        isExport,
        writtenBy,
        customerName,
        customerEmail: customerEmail || null,
        customerPhone: customerPhone || null,
        customerAddress: customerAddress || null,
        customerPostal: customerPostal || null,
        customerCity: customerCity || null,
        customerOrgNr: customerOrgNr || null,
        customerRef: customerRef || null,
        note: note || null,
        reqNumber: reqNumber || null,
        expeditionFee,
        shippingFee,
        ...totals,
        status: "DRAFT",
        items: { create: mappedItems },
      },
    });

    // If "save & send" was requested, trigger the send endpoint
    if (andSend && customerEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
      await fetch(`${baseUrl}/api/faktura/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });
    }

    return NextResponse.json({ invoiceId: invoice.id, invoiceNumber });
  } catch (err) {
    console.error("Invoice create error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
