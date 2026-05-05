/**
 * Admin CSV export — server route handlers for each resource list.
 *
 * `GET /api/admin/export/<resource>` returns a UTF-8 CSV with BOM.
 * Filename includes today's ISO date so successive exports don't clobber.
 *
 * Supported resources: parts, orders, customers, invoices, leads.
 *
 * Auth: admin / superadmin only. Customers requesting this get 403.
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toCsv, csvResponseHeaders, exportDatestamp } from "@/lib/csv";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ resource: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return new NextResponse("Behörighet saknas", { status: 403 });
  }

  const { resource } = await params;
  const date = exportDatestamp();

  switch (resource) {
    case "delar":
    case "parts":
      return exportParts(date);
    case "ordrar":
    case "orders":
      return exportOrders(date);
    case "kunder":
    case "customers":
      return exportCustomers(date);
    case "fakturor":
    case "invoices":
      return exportInvoices(date);
    case "eftersok":
    case "leads":
      return exportLeads(date);
    default:
      return new NextResponse("Okänd resurs", { status: 404 });
  }
}

async function exportParts(date: string) {
  const parts = await db.part.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicle: { select: { stockNumber: true, brandSlug: true, model: true, year: true } } },
  });
  const rows = parts.map((p) => ({
    sku:            p.sku,
    namn:           p.name,
    oeNumber:       p.oeNumber,
    pris_sek:       p.priceSek,
    skick:          p.condition,
    status:         p.status,
    bil_lagernr:    p.vehicle.stockNumber,
    bil_marke:      p.vehicle.brandSlug,
    bil_modell:     p.vehicle.model,
    bil_ar:         p.vehicle.year,
    skapad:         p.createdAt,
  }));
  const csv = toCsv(rows, {
    columns: [
      { key: "sku",         label: "SKU" },
      { key: "namn",        label: "Namn" },
      { key: "oeNumber",    label: "OE-nummer" },
      { key: "pris_sek",    label: "Pris (kr)" },
      { key: "skick",       label: "Skick" },
      { key: "status",      label: "Status" },
      { key: "bil_lagernr", label: "Bil — lagernr" },
      { key: "bil_marke",   label: "Bil — märke" },
      { key: "bil_modell",  label: "Bil — modell" },
      { key: "bil_ar",      label: "Bil — år" },
      { key: "skapad",      label: "Skapad" },
    ],
  });
  return new NextResponse(csv, { headers: csvResponseHeaders(`delar-${date}.csv`) });
}

async function exportOrders(date: string) {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { select: { partSku: true, partName: true, priceSek: true, quantity: true } },
    },
  });
  const rows = orders.map((o) => ({
    ordernummer:    o.orderNumber,
    skapad:         o.createdAt,
    status:         o.status,
    betalstatus:    o.paymentStatus,
    betalmetod:     o.paymentMethod,
    fornamn:        o.firstName,
    efternamn:      o.lastName,
    epost:          o.email,
    telefon:        o.phone,
    adress:         o.address,
    postnummer:     o.postalCode,
    ort:            o.city,
    land:           o.country,
    delar:          o.items.map((i) => `${i.quantity}× ${i.partSku} (${i.partName})`).join(" | "),
    delsumma_sek:   o.subtotalSek,
    frakt_sek:      o.shippingSek,
    moms_sek:       o.vatSek,
    totalt_sek:     o.totalSek,
  }));
  const csv = toCsv(rows, {
    columns: [
      { key: "ordernummer",  label: "Ordernr" },
      { key: "skapad",       label: "Skapad" },
      { key: "status",       label: "Status" },
      { key: "betalstatus",  label: "Betalstatus" },
      { key: "betalmetod",   label: "Betalmetod" },
      { key: "fornamn",      label: "Förnamn" },
      { key: "efternamn",    label: "Efternamn" },
      { key: "epost",        label: "E-post" },
      { key: "telefon",      label: "Telefon" },
      { key: "adress",       label: "Adress" },
      { key: "postnummer",   label: "Postnummer" },
      { key: "ort",          label: "Ort" },
      { key: "land",         label: "Land" },
      { key: "delar",        label: "Delar" },
      { key: "delsumma_sek", label: "Delsumma (kr)" },
      { key: "frakt_sek",    label: "Frakt (kr)" },
      { key: "moms_sek",     label: "Moms (kr)" },
      { key: "totalt_sek",   label: "Totalt (kr)" },
    ],
  });
  return new NextResponse(csv, { headers: csvResponseHeaders(`ordrar-${date}.csv`) });
}

async function exportCustomers(date: string) {
  // Customers = unique buyer rows from Orders (we don't yet have a Customer
  // model). Group by email so each row reflects one customer's lifetime.
  const orders = await db.order.findMany({
    select: {
      email: true, phone: true, firstName: true, lastName: true,
      city: true, country: true, totalSek: true, createdAt: true,
      paymentStatus: true,
    },
  });
  const grouped = new Map<string, {
    email: string; phone: string | null; firstName: string; lastName: string;
    city: string; country: string;
    orders: number; spent: number; lastOrder: Date;
  }>();
  for (const o of orders) {
    const key = o.email.toLowerCase();
    const existing = grouped.get(key);
    const isPaid = o.paymentStatus === "PAID";
    if (existing) {
      existing.orders += 1;
      if (isPaid) existing.spent += o.totalSek;
      if (o.createdAt > existing.lastOrder) {
        existing.lastOrder = o.createdAt;
        existing.firstName = o.firstName;
        existing.lastName = o.lastName;
        existing.phone = o.phone;
        existing.city = o.city;
        existing.country = o.country;
      }
    } else {
      grouped.set(key, {
        email: o.email,
        phone: o.phone,
        firstName: o.firstName,
        lastName: o.lastName,
        city: o.city,
        country: o.country,
        orders: 1,
        spent: isPaid ? o.totalSek : 0,
        lastOrder: o.createdAt,
      });
    }
  }
  const rows = [...grouped.values()].sort((a, b) => b.spent - a.spent);
  const csv = toCsv(rows, {
    columns: [
      { key: "firstName", label: "Förnamn" },
      { key: "lastName",  label: "Efternamn" },
      { key: "email",     label: "E-post" },
      { key: "phone",     label: "Telefon" },
      { key: "city",      label: "Ort" },
      { key: "country",   label: "Land" },
      { key: "orders",    label: "Antal ordrar" },
      { key: "spent",     label: "Spenderat (kr)" },
      { key: "lastOrder", label: "Senaste order" },
    ],
  });
  return new NextResponse(csv, { headers: csvResponseHeaders(`kunder-${date}.csv`) });
}

async function exportInvoices(date: string) {
  const invoices = await db.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: { items: { select: { description: true, amountSek: true } } },
  });
  const rows = invoices.map((i) => ({
    fakturanr:    i.invoiceNumber,
    utfardad:     i.issuedAt,
    forfaller:    i.dueAt,
    kund:         i.customerName,
    epost:        i.customerEmail,
    status:       i.status,
    delsumma_sek: i.subtotalSek,
    moms_sek:     i.vatSek,
    totalt_sek:   i.totalSek,
    rader:        i.items.map((x) => `${x.description} (${x.amountSek} kr)`).join(" | "),
  }));
  const csv = toCsv(rows, {
    columns: [
      { key: "fakturanr",    label: "Fakturanr" },
      { key: "utfardad",     label: "Utfärdad" },
      { key: "forfaller",    label: "Förfaller" },
      { key: "kund",         label: "Kund" },
      { key: "epost",        label: "E-post" },
      { key: "status",       label: "Status" },
      { key: "delsumma_sek", label: "Delsumma (kr)" },
      { key: "moms_sek",     label: "Moms (kr)" },
      { key: "totalt_sek",   label: "Totalt (kr)" },
      { key: "rader",        label: "Rader" },
    ],
  });
  return new NextResponse(csv, { headers: csvResponseHeaders(`fakturor-${date}.csv`) });
}

async function exportLeads(date: string) {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { name: true } } },
  });
  const rows = leads.map((l) => ({
    skapad:       l.createdAt,
    typ:          l.kind,
    status:       l.status,
    namn:         l.name,
    epost:        l.email,
    telefon:      l.phone,
    sku:          l.sku,
    del:          l.partName,
    bil_marke:    l.brand,
    bil_modell:   l.model,
    bil_ar:       l.year,
    bil_regnr:    l.regnr,
    meddelande:   l.message,
    tilldelad:    l.assignedTo?.name,
    besvarad:     l.answeredAt,
  }));
  const csv = toCsv(rows, {
    columns: [
      { key: "skapad",      label: "Skapad" },
      { key: "typ",         label: "Typ" },
      { key: "status",      label: "Status" },
      { key: "namn",        label: "Namn" },
      { key: "epost",       label: "E-post" },
      { key: "telefon",     label: "Telefon" },
      { key: "sku",         label: "SKU" },
      { key: "del",         label: "Del" },
      { key: "bil_marke",   label: "Bil — märke" },
      { key: "bil_modell",  label: "Bil — modell" },
      { key: "bil_ar",      label: "Bil — år" },
      { key: "bil_regnr",   label: "Bil — regnr" },
      { key: "meddelande",  label: "Meddelande" },
      { key: "tilldelad",   label: "Tilldelad" },
      { key: "besvarad",    label: "Besvarad" },
    ],
  });
  return new NextResponse(csv, { headers: csvResponseHeaders(`forfragningar-${date}.csv`) });
}
