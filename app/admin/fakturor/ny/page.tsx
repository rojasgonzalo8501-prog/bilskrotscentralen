"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ItemRow {
  taxCode: string;
  description: string;
  year: string;
  carMake: string;
  itemType: string;
  quantity: number;
  unitPriceSek: number;
  vatPercent: number;
}

const EMPTY_ITEM: ItemRow = {
  taxCode: "A",
  description: "",
  year: "",
  carMake: "",
  itemType: "",
  quantity: 1,
  unitPriceSek: 0,
  vatPercent: 25,
};

export default function NyFakturaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Customer
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPostal, setCustomerPostal] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerOrgNr, setCustomerOrgNr] = useState("");
  const [customerRef, setCustomerRef] = useState("");
  const [note, setNote] = useState("");
  const [reqNumber, setReqNumber] = useState("");

  // Invoice meta
  const [paymentTerms, setPaymentTerms] = useState(10);
  const [isExport, setIsExport] = useState(false);
  const [writtenBy, setWrittenBy] = useState("Adam");

  // Fees
  const [expeditionFee, setExpeditionFee] = useState(49);
  const [shippingFee, setShippingFee] = useState(0);

  // Items
  const [items, setItems] = useState<ItemRow[]>([{ ...EMPTY_ITEM }]);

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, field: keyof ItemRow, value: string | number) {
    setItems((prev) =>
      prev.map((row, idx) => {
        if (idx !== i) return row;
        const updated = { ...row, [field]: value };
        // Auto-set vatPercent based on taxCode
        if (field === "taxCode") {
          updated.vatPercent = value === "A" ? 25 : 0;
        }
        // Auto-compute amount (shown in summary)
        return updated;
      })
    );
  }

  // Live totals
  const subtotal = items.reduce((s, i) => s + i.unitPriceSek * i.quantity, 0) + expeditionFee + shippingFee;
  const vat = items.filter((i) => i.taxCode === "A").reduce((s, i) => s + Math.round(i.unitPriceSek * i.quantity * (i.vatPercent / (100 + i.vatPercent))), 0)
    + Math.round(expeditionFee * 0.2);
  const total = subtotal;

  async function handleSave(andSend: boolean) {
    if (!customerName.trim()) { setError("Kundnamn krävs."); return; }
    if (items.some((i) => !i.description.trim())) { setError("Alla rader behöver en beskrivning."); return; }
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/faktura/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName, customerEmail, customerPhone,
          customerAddress, customerPostal, customerCity,
          customerOrgNr, customerRef, note, reqNumber,
          paymentTerms, isExport, writtenBy,
          expeditionFee, shippingFee,
          items: items.map((i) => ({
            ...i,
            amountSek: i.unitPriceSek * i.quantity,
          })),
          andSend,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fel vid sparande");
      router.push(`/admin/fakturor/${data.invoiceId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Något gick fel");
      setSaving(false);
    }
  }

  return (
    <section className="max-w-5xl">
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)]">Admin</a>
        <span>›</span>
        <Link href="/admin/fakturor" className="hover:text-[var(--color-brand-orange)]">Fakturor</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Ny faktura</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black"><span className="gradient-text">Ny faktura</span></h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer */}
          <Card title="Kunduppgifter">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Namn *" value={customerName} onChange={setCustomerName} className="sm:col-span-2" />
              <Field label="E-post" value={customerEmail} onChange={setCustomerEmail} type="email" />
              <Field label="Telefon" value={customerPhone} onChange={setCustomerPhone} type="tel" />
              <Field label="Gatuadress" value={customerAddress} onChange={setCustomerAddress} className="sm:col-span-2" />
              <Field label="Postnummer" value={customerPostal} onChange={setCustomerPostal} />
              <Field label="Ort" value={customerCity} onChange={setCustomerCity} />
              <Field label="Köparens Org. nr" value={customerOrgNr} onChange={setCustomerOrgNr} />
              <Field label="Er referens" value={customerRef} onChange={setCustomerRef} />
              <Field label="Anmärkning" value={note} onChange={setNote} className="sm:col-span-2" />
              <Field label="Rekv. nr" value={reqNumber} onChange={setReqNumber} />
            </div>
          </Card>

          {/* Rows */}
          <Card title="Fakturarader">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[var(--color-text-muted)] border-b border-[var(--color-dark-500)]">
                    <th className="pb-2 text-left w-10">Skatt</th>
                    <th className="pb-2 text-left">Beskrivning</th>
                    <th className="pb-2 text-left w-16">År</th>
                    <th className="pb-2 text-left w-28">Bilanmärkning</th>
                    <th className="pb-2 text-left w-12">Typ</th>
                    <th className="pb-2 text-right w-12">Antal</th>
                    <th className="pb-2 text-right w-24">À-pris</th>
                    <th className="pb-2 text-right w-24">Belopp</th>
                    <th className="pb-2 w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-dark-600)]">
                  {items.map((item, i) => (
                    <tr key={i} className="group">
                      <td className="py-2 pr-2">
                        <select
                          value={item.taxCode}
                          onChange={(e) => updateItem(i, "taxCode", e.target.value)}
                          className="w-full px-1 py-1.5 rounded bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs"
                        >
                          <option value="A">A (25%)</option>
                          <option value="M">M (Marginal)</option>
                          <option value="O">O (0%)</option>
                        </select>
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          value={item.description}
                          onChange={(e) => updateItem(i, "description", e.target.value)}
                          placeholder="Reservdel / tjänst"
                          className="w-full px-2 py-1.5 rounded bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          value={item.year}
                          onChange={(e) => updateItem(i, "year", e.target.value)}
                          placeholder="2019"
                          className="w-full px-2 py-1.5 rounded bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          value={item.carMake}
                          onChange={(e) => updateItem(i, "carMake", e.target.value)}
                          placeholder="Mercedes E220"
                          className="w-full px-2 py-1.5 rounded bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          value={item.itemType}
                          onChange={(e) => updateItem(i, "itemType", e.target.value)}
                          placeholder="B"
                          className="w-full px-2 py-1.5 rounded bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 1)}
                          className="w-full px-2 py-1.5 rounded bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs text-right"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPriceSek || ""}
                          onChange={(e) => updateItem(i, "unitPriceSek", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full px-2 py-1.5 rounded bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs text-right"
                        />
                      </td>
                      <td className="py-2 pr-2 text-right text-[var(--color-text-secondary)] font-medium">
                        {(item.unitPriceSek * item.quantity).toLocaleString("sv-SE", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2">
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(i)}
                            className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addItem}
              className="mt-3 text-xs text-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange-light)] transition-colors flex items-center gap-1"
            >
              + Lägg till rad
            </button>

            {/* Fees */}
            <div className="mt-4 pt-4 border-t border-[var(--color-dark-500)] grid sm:grid-cols-2 gap-4 max-w-xs">
              <NumberField label="Expeditionsavgift (kr)" value={expeditionFee} onChange={setExpeditionFee} />
              <NumberField label="Frakt (kr)" value={shippingFee} onChange={setShippingFee} />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Invoice settings */}
          <Card title="Fakturainställningar">
            <div className="space-y-3">
              <NumberField label="Betalningsvillkor (dagar)" value={paymentTerms} onChange={setPaymentTerms} />
              <Field label="Utskrivet av" value={writtenBy} onChange={setWrittenBy} />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isExport}
                  onChange={(e) => setIsExport(e.target.checked)}
                  className="rounded"
                />
                <span>Export-faktura</span>
              </label>
            </div>
          </Card>

          {/* Summary */}
          <Card title="Summering">
            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <div className="flex justify-between">
                <span>Delsumma</span>
                <span>{subtotal.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Moms (25%)</span>
                <span>{vat.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-[var(--color-dark-500)]">
              <span>ATT BETALA</span>
              <span className="text-[var(--color-brand-orange)]">
                {total.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr
              </span>
            </div>
          </Card>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full btn-secondary py-3 disabled:opacity-60"
            >
              {saving ? "Sparar…" : "Spara som utkast"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !customerEmail}
              className="w-full btn-primary py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              title={!customerEmail ? "Ange e-postadress för att skicka direkt" : ""}
            >
              {saving ? "Sparar…" : "Spara & skicka mejl →"}
            </button>
            {!customerEmail && (
              <p className="text-xs text-center text-[var(--color-text-muted)]">Lägg till e-post för att kunna skicka direkt</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-5">
      <h2 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", className = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs text-[var(--color-text-muted)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-[var(--color-text-muted)] mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
      />
    </div>
  );
}
