/**
 * Shared utilities for creating invoices from orders and computing totals.
 */
import { db } from "@/lib/db";
import { FIRST_INVOICE_NUMBER } from "@/lib/invoice-pdf";

/* ─── Get the next sequential invoice number ─────────────────── */
export async function getNextInvoiceNumber(): Promise<number> {
  const result = await db.invoice.aggregate({
    _max: { invoiceNumber: true },
  });
  const max = result._max.invoiceNumber;
  return max ? max + 1 : FIRST_INVOICE_NUMBER;
}

/* ─── Compute due date from invoice date + payment terms ──────── */
export function computeDueDate(invoiceDate: Date, paymentTermsDays: number): Date {
  const d = new Date(invoiceDate);
  d.setDate(d.getDate() + paymentTermsDays);
  return d;
}

/* ─── Compute totals from items + fees ───────────────────────── */
export interface ItemInput {
  taxCode: string;
  unitPriceSek: number;
  quantity: number;
  vatPercent: number;
}

export function computeInvoiceTotals(
  items: ItemInput[],
  expeditionFee: number,
  shippingFee: number
): { subtotalSek: number; vatSek: number; totalSek: number } {
  // Subtotal = sum of all item amounts + fees
  const itemsTotal = items.reduce((s, i) => s + i.unitPriceSek * i.quantity, 0);
  const subtotalSek = itemsTotal + expeditionFee + shippingFee;

  // VAT = sum of A-type items × 0.25 (B items are margin taxed, no VAT)
  const vatSek = items
    .filter((i) => i.taxCode === "A")
    .reduce((s, i) => s + Math.round(i.unitPriceSek * i.quantity * (i.vatPercent / (100 + i.vatPercent)) * 100) / 100, 0)
    + Math.round(expeditionFee * 0.2 * 100) / 100; // expedition fee includes 25% VAT

  const totalSek = subtotalSek;

  return {
    subtotalSek: Math.round(subtotalSek * 100) / 100,
    vatSek: Math.round(vatSek * 100) / 100,
    totalSek: Math.round(totalSek * 100) / 100,
  };
}

/* ─── Create an invoice from a paid order ────────────────────── */
export async function createInvoiceFromOrder(orderId: string): Promise<string> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error(`Order ${orderId} not found`);

  // Don't double-create
  const existing = await db.invoice.findFirst({ where: { orderId } });
  if (existing) return existing.id;

  const invoiceNumber = await getNextInvoiceNumber();
  const invoiceDate = new Date();
  const dueDate = computeDueDate(invoiceDate, 10);

  const items = order.items.map((item) => ({
    taxCode: "A",          // Webshop sales default to 25% VAT
    description: item.partName,
    quantity: item.quantity,
    unitPriceSek: item.priceSek,
    vatPercent: 25,
    amountSek: item.priceSek * item.quantity,
    sortOrder: 0,
  }));

  const expeditionFee = 49;  // standard expedition fee
  const shippingFee = order.shippingSek;

  const totals = computeInvoiceTotals(items, expeditionFee, shippingFee);

  const invoice = await db.invoice.create({
    data: {
      invoiceNumber,
      orderId,
      paymentTerms: 10,
      invoiceDate,
      dueDate,
      customerName: `${order.firstName} ${order.lastName}`,
      customerEmail: order.email,
      customerPhone: order.phone ?? undefined,
      customerAddress: order.address,
      customerPostal: order.postalCode,
      customerCity: order.city,
      expeditionFee,
      shippingFee,
      ...totals,
      status: "DRAFT",
      items: {
        create: items,
      },
    },
  });

  return invoice.id;
}
