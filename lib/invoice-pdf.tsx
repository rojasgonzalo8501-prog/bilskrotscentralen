/**
 * Bilskrotscentralen i Sverige AB — Invoice PDF template
 * Faithfully replicates the paper invoice layout photographed by Adam.
 *
 * Rendered server-side via @react-pdf/renderer, returned as a PDF stream
 * from the /api/faktura/[id]/pdf route.
 */

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

/* ─── Company constants ──────────────────────────────────────── */
export const COMPANY = {
  name: "Bilskrotscentralen i Sverige AB",
  address: "Magasingatan 2",
  postal: "749 35 ENKÖPING",
  phone: "0171-210 02",
  email: "info@bilskrotscentralen.se",
  bankgiro: "5497-3441",
  iban: "SE6380000830550045518503",
  swift: "SWEDSESS",
  vatNo: "SE556634081501",
  orgNo: "556634-0815",
  fSkatt: true,
};

/* ─── Starting invoice number ────────────────────────────────── */
export const FIRST_INVOICE_NUMBER = 11101;

/* ─── Types ──────────────────────────────────────────────────── */
export interface InvoiceData {
  invoiceNumber: number;
  invoiceDate: string;   // "YYYY-MM-DD"
  dueDate: string;
  paymentTerms: number;
  writtenBy?: string;
  isExport?: boolean;

  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerPostal?: string;
  customerCity?: string;
  customerOrgNr?: string;
  customerRef?: string;
  note?: string;
  reqNumber?: string;

  items: InvoiceItemData[];
  expeditionFee: number;
  shippingFee: number;

  subtotalSek: number;
  vatSek: number;
  totalSek: number;
}

export interface InvoiceItemData {
  taxCode: string;   // M | A | O
  description: string;
  year?: string;
  carMake?: string;
  itemType?: string;
  quantity: number;
  unitPriceSek: number;
  vatPercent: number;
  amountSek: number;
}

/* ─── Styles ─────────────────────────────────────────────────── */
const C = {
  black: "#000000",
  darkGray: "#333333",
  gray: "#666666",
  lightGray: "#cccccc",
  lineGray: "#aaaaaa",
  bg: "#f0f0f0",
  white: "#ffffff",
};

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 8, color: C.black, padding: "14mm 14mm 18mm 14mm" },

  /* Header */
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  companyName: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 2 },

  /* Faktura box (top right) */
  fakturaBox: { border: "1pt solid #000", minWidth: 160 },
  fakturaTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", textAlign: "center", paddingVertical: 3, paddingHorizontal: 6, borderBottom: "1pt solid #000" },
  fakturaNumber: { fontSize: 18, fontFamily: "Helvetica-Bold", textAlign: "right", paddingHorizontal: 6, paddingBottom: 2 },
  fakturaRow: { flexDirection: "row", borderTop: "1pt solid #000" },
  fakturaCell: { flex: 1, paddingHorizontal: 4, paddingVertical: 2 },
  fakturaCellRight: { flex: 1, paddingHorizontal: 4, paddingVertical: 2, borderLeft: "1pt solid #000" },
  fakturaCellLabel: { fontSize: 6.5, color: C.gray, marginBottom: 1 },
  fakturaCellValue: { fontSize: 8, fontFamily: "Helvetica-Bold" },

  /* Export badge */
  exportBadge: { fontSize: 14, fontFamily: "Helvetica-Bold", color: C.gray, position: "absolute", right: 0, top: 22 },

  /* Address section */
  addressSection: { flexDirection: "row", marginTop: 8, marginBottom: 6 },
  addressLeft: { flex: 1 },
  addressRight: { flex: 1 },
  addressLabel: { fontSize: 6.5, color: C.gray, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  addressBlock: { fontSize: 8, lineHeight: 1.5 },

  /* Meta row */
  metaSection: { flexDirection: "row", marginBottom: 2 },
  metaLeft: { flex: 1.2 },
  metaRight: { flex: 1 },
  metaLine: { flexDirection: "row", marginBottom: 1.5 },
  metaLabel: { fontSize: 7, color: C.gray, width: 90 },
  metaValue: { fontSize: 7 },
  metaValueBold: { fontSize: 7, fontFamily: "Helvetica-Bold" },

  /* Table */
  table: { marginTop: 8, border: "1pt solid #000" },
  tableHeader: { flexDirection: "row", backgroundColor: C.bg, borderBottom: "1pt solid #000" },
  tableRow: { flexDirection: "row", borderBottom: "0.5pt solid " + C.lightGray, minHeight: 14 },
  tableRowLast: { flexDirection: "row" },

  colSkatt:  { width: 16,  paddingHorizontal: 2, paddingVertical: 2, borderRight: "0.5pt solid " + C.lightGray },
  colDel:    { flex: 1,    paddingHorizontal: 3, paddingVertical: 2, borderRight: "0.5pt solid " + C.lightGray },
  colAr:     { width: 28,  paddingHorizontal: 2, paddingVertical: 2, borderRight: "0.5pt solid " + C.lightGray },
  colBil:    { width: 80,  paddingHorizontal: 2, paddingVertical: 2, borderRight: "0.5pt solid " + C.lightGray },
  colTyp:    { width: 20,  paddingHorizontal: 2, paddingVertical: 2, borderRight: "0.5pt solid " + C.lightGray },
  colApris:  { width: 50,  paddingHorizontal: 2, paddingVertical: 2, textAlign: "right", borderRight: "0.5pt solid " + C.lightGray },
  colPct:    { width: 18,  paddingHorizontal: 2, paddingVertical: 2, textAlign: "center", borderRight: "0.5pt solid " + C.lightGray },
  colBelopp: { width: 52,  paddingHorizontal: 2, paddingVertical: 2, textAlign: "right" },

  thText: { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.darkGray },
  tdText: { fontSize: 7.5 },
  tdTextRight: { fontSize: 7.5, textAlign: "right" },
  tdTextCenter: { fontSize: 7.5, textAlign: "center" },

  /* Thank you row */
  thankYou: { textAlign: "center", fontSize: 9, fontFamily: "Helvetica-Bold", borderTop: "0.5pt solid " + C.lightGray, borderBottom: "0.5pt solid " + C.lightGray, paddingVertical: 4, marginTop: 2, marginBottom: 2 },

  /* Fees row */
  feesSection: { marginTop: 4, marginBottom: 8 },
  feeRow: { flexDirection: "row", marginBottom: 2 },
  feeLabel: { width: 80, fontSize: 7.5 },
  feeValue: { width: 50, fontSize: 7.5, textAlign: "right" },

  /* VAT spec */
  vatBox: { border: "1pt solid #000", marginTop: 0, marginBottom: 6 },
  vatTitle: { fontSize: 7, fontFamily: "Helvetica-Bold", paddingHorizontal: 4, paddingVertical: 2, borderBottom: "0.5pt solid #000" },
  vatHeader: { flexDirection: "row", backgroundColor: C.bg, borderBottom: "0.5pt solid #000" },
  vatRow: { flexDirection: "row", borderBottom: "0.5pt solid " + C.lightGray },
  vatRowLast: { flexDirection: "row", borderBottom: "0.5pt solid " + C.lightGray },
  vatTotal: { flexDirection: "row", borderTop: "1pt solid #000", backgroundColor: C.bg },

  vatColCode:    { width: 14, paddingHorizontal: 2, paddingVertical: 1.5, borderRight: "0.5pt solid " + C.lightGray },
  vatColDesc:    { flex: 1,   paddingHorizontal: 3, paddingVertical: 1.5, borderRight: "0.5pt solid " + C.lightGray },
  vatColPct:     { width: 28, paddingHorizontal: 2, paddingVertical: 1.5, textAlign: "center", borderRight: "0.5pt solid " + C.lightGray },
  vatColNetto:   { width: 54, paddingHorizontal: 2, paddingVertical: 1.5, textAlign: "right", borderRight: "0.5pt solid " + C.lightGray },
  vatColMoms:    { width: 44, paddingHorizontal: 2, paddingVertical: 1.5, textAlign: "right", borderRight: "0.5pt solid " + C.lightGray },
  vatColSumma:   { width: 52, paddingHorizontal: 2, paddingVertical: 1.5, textAlign: "right" },

  vatText:       { fontSize: 7 },
  vatTextRight:  { fontSize: 7, textAlign: "right" },
  vatTextBold:   { fontSize: 7, fontFamily: "Helvetica-Bold" },
  vatTextCenter: { fontSize: 7, textAlign: "center" },

  /* Att betala */
  attBetalaRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginBottom: 4 },
  attBetalaLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", marginRight: 8 },
  attBetalaValue: { fontSize: 11, fontFamily: "Helvetica-Bold" },

  /* OCR notice */
  ocrBox: { border: "1pt solid #000", paddingHorizontal: 6, paddingVertical: 4, marginBottom: 6 },
  ocrText: { fontSize: 7.5, fontFamily: "Helvetica-Bold" },

  /* Legal notice */
  legalBox: { border: "1pt solid #000", paddingHorizontal: 6, paddingVertical: 4, marginBottom: 8 },
  legalText: { fontSize: 6.5, lineHeight: 1.5, color: C.darkGray },

  /* Footer */
  footer: { position: "absolute", bottom: "10mm", left: "14mm", right: "14mm" },
  footerLine: { borderTop: "1pt solid #000", marginBottom: 4 },
  footerRow: { flexDirection: "row", justifyContent: "space-between" },
  footerCol: { flex: 1 },
  footerLabel: { fontSize: 6.5, color: C.gray, marginBottom: 1 },
  footerValue: { fontSize: 7 },
  footerValueBold: { fontSize: 7, fontFamily: "Helvetica-Bold" },
});

/* ─── Helpers ────────────────────────────────────────────────── */
function fmt(n: number): string {
  return n.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ─── PDF Component ──────────────────────────────────────────── */
export function InvoicePDF({ data }: { data: InvoiceData }) {
  // Compute VAT breakdown by tax code
  const vatLines = computeVatBreakdown(data);
  const oresutjamning = computeOresutjamning(data.totalSek, vatLines);

  return (
    <Document title={`Faktura ${data.invoiceNumber} — ${data.customerName}`}>
      <Page size="A4" style={s.page}>

        {/* ── HEADER ─────────────────────────────────────────── */}
        <View style={s.headerRow}>
          {/* Company name + address (left) */}
          <View>
            <Text style={s.companyName}>{COMPANY.name}</Text>
            {data.isExport && <Text style={s.exportBadge}>Export</Text>}
          </View>

          {/* FAKTURA box (right) */}
          <View style={s.fakturaBox}>
            <Text style={s.fakturaTitle}>FAKTURA</Text>
            <Text style={s.fakturaNumber}>{data.invoiceNumber}</Text>
            <View style={s.fakturaRow}>
              <View style={s.fakturaCell}>
                <Text style={s.fakturaCellLabel}>Kund</Text>
                <Text style={s.fakturaCellValue}>—</Text>
              </View>
              <View style={s.fakturaCellRight}>
                <Text style={s.fakturaCellLabel}>Fakturadatum</Text>
                <Text style={s.fakturaCellValue}>{data.invoiceDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── ADDRESS SECTION ─────────────────────────────────── */}
        <View style={s.addressSection}>
          <View style={s.addressLeft}>
            <Text style={s.addressLabel}>Leveransadress</Text>
            <View style={s.addressBlock}>
              <Text>{COMPANY.name}</Text>
              <Text>{COMPANY.address}</Text>
              <Text>{COMPANY.postal}</Text>
              <Text style={{ marginTop: 3 }}>Tel: {COMPANY.phone}</Text>
            </View>
          </View>
          <View style={s.addressRight}>
            <Text style={s.addressLabel}>Fakturaadress</Text>
            <View style={s.addressBlock}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{data.customerName}</Text>
              {data.customerAddress && <Text>{data.customerAddress}</Text>}
              {(data.customerPostal || data.customerCity) && (
                <Text>{[data.customerPostal, data.customerCity].filter(Boolean).join("  ")}</Text>
              )}
              {data.customerEmail && <Text style={{ marginTop: 2 }}>{data.customerEmail}</Text>}
              {data.customerPhone && <Text>{data.customerPhone}</Text>}
            </View>
          </View>
        </View>

        {/* ── META ────────────────────────────────────────────── */}
        <View style={s.metaSection}>
          <View style={s.metaLeft}>
            <View style={s.metaLine}>
              <Text style={s.metaLabel}>Betalningsvillkor:</Text>
              <Text style={s.metaValue}>{data.paymentTerms} dagar netto</Text>
            </View>
            <View style={s.metaLine}>
              <Text style={s.metaLabel}>Förfallodatum:</Text>
              <Text style={s.metaValueBold}>{data.dueDate}</Text>
            </View>
            {data.customerOrgNr && (
              <View style={s.metaLine}>
                <Text style={s.metaLabel}>Köparens Org. nr:</Text>
                <Text style={s.metaValue}>{data.customerOrgNr}</Text>
              </View>
            )}
            <View style={s.metaLine}>
              <Text style={s.metaLabel}>Utskrivet av:</Text>
              <Text style={s.metaValue}>{data.writtenBy ?? "Adam"}</Text>
            </View>
          </View>
          <View style={s.metaRight}>
            {data.reqNumber && (
              <View style={s.metaLine}>
                <Text style={s.metaLabel}>Rekv. nr:</Text>
                <Text style={s.metaValue}>{data.reqNumber}</Text>
              </View>
            )}
            {data.customerRef && (
              <View style={s.metaLine}>
                <Text style={s.metaLabel}>Er referens:</Text>
                <Text style={s.metaValue}>{data.customerRef}</Text>
              </View>
            )}
            {data.note && (
              <View style={s.metaLine}>
                <Text style={s.metaLabel}>Anmärkning:</Text>
                <Text style={s.metaValue}>{data.note}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── ITEMS TABLE ─────────────────────────────────────── */}
        <View style={s.table}>
          {/* Header */}
          <View style={s.tableHeader}>
            <View style={s.colSkatt}><Text style={s.thText}>Skatt</Text></View>
            <View style={s.colDel}><Text style={s.thText}>Reservdel</Text></View>
            <View style={s.colAr}><Text style={s.thText}>År</Text></View>
            <View style={s.colBil}><Text style={s.thText}>Bilanmärkning</Text></View>
            <View style={s.colTyp}><Text style={s.thText}>Typ</Text></View>
            <View style={s.colApris}><Text style={[s.thText, { textAlign: "right" }]}>A-pris</Text></View>
            <View style={s.colPct}><Text style={[s.thText, { textAlign: "center" }]}>%</Text></View>
            <View style={s.colBelopp}><Text style={[s.thText, { textAlign: "right" }]}>Belopp</Text></View>
          </View>

          {/* Rows */}
          {data.items.map((item, i) => (
            <View key={i} style={i < data.items.length - 1 ? s.tableRow : s.tableRowLast}>
              <View style={s.colSkatt}><Text style={s.tdText}>{item.taxCode}</Text></View>
              <View style={s.colDel}><Text style={s.tdText}>{item.description}</Text></View>
              <View style={s.colAr}><Text style={s.tdText}>{item.year ?? ""}</Text></View>
              <View style={s.colBil}><Text style={s.tdText}>{item.carMake ?? ""}</Text></View>
              <View style={s.colTyp}><Text style={s.tdTextCenter}>{item.itemType ?? ""}</Text></View>
              <View style={s.colApris}><Text style={s.tdTextRight}>{fmt(item.unitPriceSek)}</Text></View>
              <View style={s.colPct}><Text style={s.tdTextCenter}>{item.vatPercent > 0 ? `${item.vatPercent}%` : ""}</Text></View>
              <View style={s.colBelopp}><Text style={s.tdTextRight}>{fmt(item.amountSek)}</Text></View>
            </View>
          ))}

          {/* Thank you row */}
          <View>
            <Text style={s.thankYou}>TACK &amp; VÄLKOMMEN ÅTER</Text>
          </View>
        </View>

        {/* ── FEES ────────────────────────────────────────────── */}
        <View style={s.feesSection}>
          <View style={s.feeRow}>
            <Text style={s.feeLabel}>Expeditionsavgift</Text>
            <Text style={s.feeValue}>{fmt(data.expeditionFee)}</Text>
          </View>
          <View style={s.feeRow}>
            <Text style={s.feeLabel}>Frakt</Text>
            <Text style={s.feeValue}>{fmt(data.shippingFee)}</Text>
          </View>
        </View>

        {/* ── VAT BREAKDOWN ───────────────────────────────────── */}
        <View style={s.vatBox}>
          <Text style={s.vatTitle}>Mervärdesskattespecifikation</Text>
          <View style={s.vatHeader}>
            <View style={s.vatColCode}/>
            <View style={s.vatColDesc}/>
            <View style={s.vatColPct}><Text style={s.vatText}>Procent</Text></View>
            <View style={s.vatColNetto}><Text style={s.vatTextRight}>Netto</Text></View>
            <View style={s.vatColMoms}><Text style={s.vatTextRight}>Moms</Text></View>
            <View style={s.vatColSumma}><Text style={s.vatTextRight}>Summa</Text></View>
          </View>

          {vatLines.map((line, i) => (
            <View key={i} style={s.vatRow}>
              <View style={s.vatColCode}><Text style={s.vatText}>{line.code}</Text></View>
              <View style={s.vatColDesc}><Text style={s.vatText}>{line.description}</Text></View>
              <View style={s.vatColPct}><Text style={s.vatTextCenter}>{line.pct > 0 ? `${line.pct} %` : "0 %"}</Text></View>
              <View style={s.vatColNetto}><Text style={s.vatTextRight}>{line.netto > 0 ? fmt(line.netto) : "–"}</Text></View>
              <View style={s.vatColMoms}><Text style={s.vatTextRight}>{line.moms > 0 ? fmt(line.moms) : "–"}</Text></View>
              <View style={s.vatColSumma}><Text style={s.vatTextRight}>{line.summa > 0 ? fmt(line.summa) : "–"}</Text></View>
            </View>
          ))}

          {/* Öresutjämning */}
          {oresutjamning !== 0 && (
            <View style={s.vatRow}>
              <View style={s.vatColCode}/>
              <View style={s.vatColDesc}><Text style={s.vatText}>Öresutjämning</Text></View>
              <View style={s.vatColPct}/>
              <View style={s.vatColNetto}/>
              <View style={s.vatColMoms}/>
              <View style={s.vatColSumma}><Text style={s.vatTextRight}>{fmt(oresutjamning)}</Text></View>
            </View>
          )}
        </View>

        {/* ── ATT BETALA ──────────────────────────────────────── */}
        <View style={s.attBetalaRow}>
          <Text style={s.attBetalaLabel}>ATT BETALA</Text>
          <Text style={s.attBetalaValue}>{fmt(data.totalSek)}</Text>
        </View>

        {/* ── OCR NOTICE ──────────────────────────────────────── */}
        <View style={s.ocrBox}>
          <Text style={s.ocrText}>Obs! Vid betalning ange fakturanummer : {data.invoiceNumber}</Text>
        </View>

        {/* ── LEGAL NOTICE ────────────────────────────────────── */}
        <View style={s.legalBox}>
          <Text style={s.legalText}>
            Invändningar mot denna faktura skall göras inom 8 dagar. Vid försenad betalning debiteras dröjsmålsränta.{"\n"}
            För skriftlig betalningspåminnelse debiteras kostnad enligt gällande lag.
          </Text>
        </View>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <View style={s.footer}>
          <View style={s.footerLine}/>
          <View style={s.footerRow}>
            <View style={s.footerCol}>
              <Text style={s.footerValueBold}>{COMPANY.name}</Text>
              <Text style={s.footerValue}>{COMPANY.address}</Text>
              <Text style={s.footerValue}>{COMPANY.postal}</Text>
            </View>
            <View style={s.footerCol}>
              <Text style={s.footerLabel}>Telefon</Text>
              <Text style={s.footerValue}>{COMPANY.phone}</Text>
              <Text style={{ marginTop: 3 }}/>
              <Text style={s.footerLabel}>E-post</Text>
              <Text style={s.footerValue}>{COMPANY.email}</Text>
            </View>
            <View style={s.footerCol}>
              <Text style={s.footerLabel}>Bankgiro</Text>
              <Text style={s.footerValueBold}>{COMPANY.bankgiro}</Text>
            </View>
            <View style={[s.footerCol, { flex: 1.5 }]}>
              <Text style={s.footerValue}>IBAN Nr: {COMPANY.iban}</Text>
              <Text style={s.footerValue}>SWIFT Nr: {COMPANY.swift}</Text>
              <Text style={s.footerValue}>Momsreg.nr/VAT no.: {COMPANY.vatNo}</Text>
              <Text style={s.footerValue}>Organisationsnr: {COMPANY.orgNo}</Text>
              {COMPANY.fSkatt && <Text style={s.footerValue}>Godkänd för F-skatt</Text>}
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
}

/* ─── VAT Calculation Helpers ────────────────────────────────── */
interface VatLine {
  code: string;
  description: string;
  pct: number;
  netto: number;
  moms: number;
  summa: number;
}

function computeVatBreakdown(data: InvoiceData): VatLine[] {
  const lines: VatLine[] = [];

  // M — Vinstmarginalbeskattning (margin scheme, 0% VAT shown)
  const mItems = data.items.filter((i) => i.taxCode === "M");
  if (mItems.length > 0) {
    lines.push({
      code: "M",
      description: "Vinstmarginalbeskattning för begagnade varor",
      pct: 0,
      netto: 0,
      moms: 0,
      summa: mItems.reduce((s, i) => s + i.amountSek, 0),
    });
  }

  // A — Försäljning 25%
  const aItems = data.items.filter((i) => i.taxCode === "A");
  // Include expedition fee in A items (standard VAT)
  const aBase = aItems.reduce((s, i) => s + i.amountSek, 0) + data.expeditionFee;
  if (aBase > 0 || aItems.length > 0) {
    const netto = Math.round(aBase / 1.25 * 100) / 100;
    const moms = Math.round((aBase - netto) * 100) / 100;
    lines.push({
      code: "A",
      description: "Försäljning 25%",
      pct: 25,
      netto,
      moms,
      summa: aBase,
    });
  }

  // O — Försäljning 0%
  const oItems = data.items.filter((i) => i.taxCode === "O");
  if (oItems.length > 0) {
    lines.push({
      code: "O",
      description: "Försäljning 0%",
      pct: 0,
      netto: 0,
      moms: 0,
      summa: oItems.reduce((s, i) => s + i.amountSek, 0),
    });
  }

  return lines;
}

function computeOresutjamning(totalSek: number, vatLines: VatLine[]): number {
  const lineSum = vatLines.reduce((s, l) => s + l.summa, 0);
  const diff = totalSek - lineSum;
  // Only show if non-zero (rounding adjustment)
  return Math.abs(diff) < 5 ? diff : 0;
}

/* ─── Invoice number helper ──────────────────────────────────── */
export async function getNextInvoiceNumber(db: {
  invoice: { aggregate: (args: { _max: { select: { invoiceNumber: boolean } } }) => Promise<{ _max: { invoiceNumber: number | null } }> };
}): Promise<number> {
  const result = await db.invoice.aggregate({
    _max: { select: { invoiceNumber: true } },
  } as Parameters<typeof db.invoice.aggregate>[0]);
  const max = (result._max as { invoiceNumber: number | null }).invoiceNumber;
  return max ? max + 1 : FIRST_INVOICE_NUMBER;
}
