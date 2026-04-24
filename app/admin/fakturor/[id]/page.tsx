import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { FakturaActions } from "./FakturaActions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const inv = await db.invoice.findUnique({ where: { id }, select: { invoiceNumber: true, customerName: true } });
  if (!inv) return { title: "Faktura ej hittad" };
  return { title: `Faktura ${inv.invoiceNumber} — ${inv.customerName}` };
}

export default async function FakturaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } }, order: { select: { orderNumber: true } } },
  });
  if (!invoice) notFound();

  const isOverdue = invoice.status === "SENT" && new Date(invoice.dueDate) < new Date();

  // Compute VAT breakdown
  const aItems = invoice.items.filter((i) => i.taxCode === "A");
  const mItems = invoice.items.filter((i) => i.taxCode === "M");
  const oItems = invoice.items.filter((i) => i.taxCode === "O");

  const aBase = aItems.reduce((s, i) => s + i.amountSek, 0) + invoice.expeditionFee;
  const aNetto = Math.round((aBase / 1.25) * 100) / 100;
  const aMoms = Math.round((aBase - aNetto) * 100) / 100;

  return (
    <section className="max-w-5xl">
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)]">Admin</a>
        <span>›</span>
        <Link href="/admin/fakturor" className="hover:text-[var(--color-brand-orange)]">Fakturor</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">#{invoice.invoiceNumber}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black">Faktura <span className="gradient-text">{invoice.invoiceNumber}</span></h1>
            <StatusPill status={isOverdue ? "OVERDUE" : invoice.status} />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {invoice.customerName}
            {invoice.order && (
              <span className="ml-2 text-[var(--color-text-muted)]">
                · Order{" "}
                <a href={`/admin/ordrar`} className="hover:text-[var(--color-brand-orange)]">
                  {invoice.order.orderNumber}
                </a>
              </span>
            )}
          </p>
        </div>
        <FakturaActions invoiceId={id} status={invoice.status} customerEmail={invoice.customerEmail} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Invoice preview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info boxes */}
          <div className="glass rounded-xl p-5 grid sm:grid-cols-2 gap-5">
            <div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Leveransadress</div>
              <div className="text-sm space-y-0.5">
                <div className="font-semibold">Bilskrotscentralen i Sverige AB</div>
                <div>Magasingatan 2</div>
                <div>749 35 ENKÖPING</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Fakturaadress</div>
              <div className="text-sm space-y-0.5">
                <div className="font-semibold">{invoice.customerName}</div>
                {invoice.customerAddress && <div>{invoice.customerAddress}</div>}
                {(invoice.customerPostal || invoice.customerCity) && (
                  <div>{[invoice.customerPostal, invoice.customerCity].filter(Boolean).join(" ")}</div>
                )}
                {invoice.customerEmail && <div className="text-[var(--color-text-secondary)]">{invoice.customerEmail}</div>}
                {invoice.customerPhone && <div className="text-[var(--color-text-secondary)]">{invoice.customerPhone}</div>}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="glass rounded-xl p-5 grid sm:grid-cols-2 gap-4 text-sm">
            <MetaRow label="Fakturadatum" value={new Date(invoice.invoiceDate).toLocaleDateString("sv-SE")} />
            <MetaRow label="Förfallodatum" value={new Date(invoice.dueDate).toLocaleDateString("sv-SE")} highlight={isOverdue} />
            <MetaRow label="Betalningsvillkor" value={`${invoice.paymentTerms} dagar netto`} />
            <MetaRow label="Utskrivet av" value={invoice.writtenBy ?? "Adam"} />
            {invoice.customerOrgNr && <MetaRow label="Köparens Org. nr" value={invoice.customerOrgNr} />}
            {invoice.customerRef && <MetaRow label="Er referens" value={invoice.customerRef} />}
            {invoice.note && <MetaRow label="Anmärkning" value={invoice.note} />}
            {invoice.reqNumber && <MetaRow label="Rekv. nr" value={invoice.reqNumber} />}
          </div>

          {/* Items table */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-dark-700)] text-xs uppercase text-[var(--color-text-muted)] tracking-wider">
                  <tr>
                    <th className="px-3 py-2.5 text-left w-10">Skatt</th>
                    <th className="px-3 py-2.5 text-left">Beskrivning</th>
                    <th className="px-3 py-2.5 text-left w-14">År</th>
                    <th className="px-3 py-2.5 text-left w-28">Bil</th>
                    <th className="px-3 py-2.5 text-center w-10">Typ</th>
                    <th className="px-3 py-2.5 text-right w-20">À-pris</th>
                    <th className="px-3 py-2.5 text-center w-12">%</th>
                    <th className="px-3 py-2.5 text-right w-24">Belopp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-dark-600)]">
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--color-dark-700)] transition-colors">
                      <td className="px-3 py-2.5 font-mono text-[var(--color-brand-orange)]">{item.taxCode}</td>
                      <td className="px-3 py-2.5">{item.description}</td>
                      <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">{item.year ?? "—"}</td>
                      <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">{item.carMake ?? "—"}</td>
                      <td className="px-3 py-2.5 text-center text-[var(--color-text-secondary)]">{item.itemType ?? ""}</td>
                      <td className="px-3 py-2.5 text-right">
                        {item.unitPriceSek.toLocaleString("sv-SE", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-center text-[var(--color-text-secondary)]">
                        {item.vatPercent > 0 ? `${item.vatPercent}%` : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold">
                        {item.amountSek.toLocaleString("sv-SE", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-[var(--color-dark-400)] bg-[var(--color-dark-700)]">
                  {invoice.expeditionFee > 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">Expeditionsavgift</td>
                      <td className="px-3 py-1.5 text-right text-sm">
                        {invoice.expeditionFee.toLocaleString("sv-SE", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )}
                  {invoice.shippingFee > 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">Frakt</td>
                      <td className="px-3 py-1.5 text-right text-sm">
                        {invoice.shippingFee.toLocaleString("sv-SE", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>

          {/* VAT breakdown */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Mervärdesskattespecifikation
            </h3>
            <table className="w-full text-xs">
              <thead className="text-[var(--color-text-muted)] border-b border-[var(--color-dark-500)]">
                <tr>
                  <th className="pb-1.5 text-left w-6"/>
                  <th className="pb-1.5 text-left">Beskrivning</th>
                  <th className="pb-1.5 text-center w-16">Procent</th>
                  <th className="pb-1.5 text-right w-24">Netto</th>
                  <th className="pb-1.5 text-right w-20">Moms</th>
                  <th className="pb-1.5 text-right w-24">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-dark-600)]">
                {mItems.length > 0 && (
                  <VatRow code="M" desc="Vinstmarginalbeskattning för begagnade varor" pct="0 %" netto="–" moms="–"
                    summa={mItems.reduce((s, i) => s + i.amountSek, 0)} />
                )}
                {aBase > 0 && (
                  <VatRow code="A" desc="Försäljning 25%" pct="25 %" netto={aNetto} moms={aMoms} summa={aBase} />
                )}
                {oItems.length > 0 && (
                  <VatRow code="O" desc="Försäljning 0%" pct="0 %" netto="–" moms="–"
                    summa={oItems.reduce((s, i) => s + i.amountSek, 0)} />
                )}
              </tbody>
            </table>
          </div>

          <div className="glass rounded-xl p-4 text-xs text-[var(--color-text-muted)] italic">
            Obs! Vid betalning ange fakturanummer : {invoice.invoiceNumber}. Invändningar mot denna faktura skall göras inom 8 dagar. Vid försenad betalning debiteras dröjsmålsränta.
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
              Sammanfattning
            </h3>
            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <div className="flex justify-between">
                <span>Delsumma</span>
                <span>{invoice.subtotalSek.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Moms</span>
                <span>{invoice.vatSek.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr</span>
              </div>
            </div>
            <div className="flex justify-between font-black text-lg mt-3 pt-3 border-t border-[var(--color-dark-500)]">
              <span>ATT BETALA</span>
              <span className="text-[var(--color-brand-orange)]">
                {invoice.totalSek.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr
              </span>
            </div>
          </div>

          <div className="glass rounded-xl p-5 text-xs space-y-2 text-[var(--color-text-secondary)]">
            <div className="font-bold text-[var(--color-text-primary)] mb-1">Betalningsinformation</div>
            <div>Bankgiro: <span className="font-semibold">5497-3441</span></div>
            <div>IBAN: SE6380000830550045518503</div>
            <div>SWIFT: SWEDSESS</div>
            <div className="pt-2 border-t border-[var(--color-dark-500)]">
              Org.nr: 556634-0815<br />
              F-skatt · Momsreg: SE556634081501
            </div>
          </div>

          {/* Timeline */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Händelser</h3>
            <div className="space-y-2 text-xs">
              <Event label="Skapad" date={new Date(invoice.createdAt)} />
              {invoice.sentAt && <Event label="Skickad" date={new Date(invoice.sentAt)} color="blue" />}
              {invoice.paidAt && <Event label="Betald" date={new Date(invoice.paidAt)} color="green" />}
              {isOverdue && <Event label="Förfallen!" date={new Date(invoice.dueDate)} color="red" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-[var(--color-dark-500)] text-[var(--color-text-secondary)]",
    SENT: "bg-blue-500/15 text-blue-300",
    PAID: "bg-[var(--color-success)]/15 text-[var(--color-success-bright)]",
    OVERDUE: "bg-red-500/15 text-red-400",
    CANCELLED: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]",
  };
  const labels: Record<string, string> = {
    DRAFT: "Utkast",
    SENT: "Skickad",
    PAID: "✓ Betald",
    OVERDUE: "⚠ Förfallen",
    CANCELLED: "Annullerad",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${styles[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}

function MetaRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs text-[var(--color-text-muted)] mb-0.5">{label}</div>
      <div className={highlight ? "text-red-400 font-semibold" : ""}>{value}</div>
    </div>
  );
}

function VatRow({ code, desc, pct, netto, moms, summa }: {
  code: string; desc: string; pct: string;
  netto: number | string; moms: number | string; summa: number;
}) {
  function fmt(v: number | string) {
    if (typeof v === "string") return v;
    return v.toLocaleString("sv-SE", { minimumFractionDigits: 2 });
  }
  return (
    <tr>
      <td className="py-1.5 font-mono text-[var(--color-brand-orange)]">{code}</td>
      <td className="py-1.5">{desc}</td>
      <td className="py-1.5 text-center">{pct}</td>
      <td className="py-1.5 text-right">{fmt(netto)}</td>
      <td className="py-1.5 text-right">{fmt(moms)}</td>
      <td className="py-1.5 text-right font-semibold">{fmt(summa)}</td>
    </tr>
  );
}

function Event({ label, date, color = "default" }: {
  label: string; date: Date; color?: "default" | "blue" | "green" | "red";
}) {
  const colors = {
    default: "bg-[var(--color-dark-500)]",
    blue: "bg-blue-500",
    green: "bg-[var(--color-success)]",
    red: "bg-red-500",
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full shrink-0 ${colors[color]}`} />
      <span className="text-[var(--color-text-secondary)]">{label}</span>
      <span className="ml-auto text-[var(--color-text-muted)]">{date.toLocaleDateString("sv-SE")}</span>
    </div>
  );
}
