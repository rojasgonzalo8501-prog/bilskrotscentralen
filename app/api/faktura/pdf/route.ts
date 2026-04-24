/**
 * GET /api/faktura/pdf?id=<invoiceId>
 * Streams the invoice as a PDF file.
 * Used for both download and email attachment.
 */
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { db } from "@/lib/db";
import { InvoicePDF, type InvoiceData } from "@/lib/invoice-pdf";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: InvoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate.toISOString().split("T")[0],
    dueDate: invoice.dueDate.toISOString().split("T")[0],
    paymentTerms: invoice.paymentTerms,
    writtenBy: invoice.writtenBy ?? "Adam",
    isExport: invoice.isExport,
    customerName: invoice.customerName,
    customerEmail: invoice.customerEmail ?? undefined,
    customerPhone: invoice.customerPhone ?? undefined,
    customerAddress: invoice.customerAddress ?? undefined,
    customerPostal: invoice.customerPostal ?? undefined,
    customerCity: invoice.customerCity ?? undefined,
    customerOrgNr: invoice.customerOrgNr ?? undefined,
    customerRef: invoice.customerRef ?? undefined,
    note: invoice.note ?? undefined,
    reqNumber: invoice.reqNumber ?? undefined,
    expeditionFee: invoice.expeditionFee,
    shippingFee: invoice.shippingFee,
    subtotalSek: invoice.subtotalSek,
    vatSek: invoice.vatSek,
    totalSek: invoice.totalSek,
    items: invoice.items.map((item) => ({
      taxCode: item.taxCode,
      description: item.description,
      year: item.year ?? undefined,
      carMake: item.carMake ?? undefined,
      itemType: item.itemType ?? undefined,
      quantity: item.quantity,
      unitPriceSek: item.unitPriceSek,
      vatPercent: item.vatPercent,
      amountSek: item.amountSek,
    })),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(React.createElement(InvoicePDF, { data }) as any);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="faktura-${invoice.invoiceNumber}.pdf"`,
      "Content-Length": String(pdfBuffer.byteLength),
    },
  });
}
