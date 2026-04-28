"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import type { Session } from "@/lib/auth";

type PaymentMethod = "NETS_EASY" | "KLARNA" | "SWISH";

declare global {
  interface Window {
    Dibs?: {
      Checkout: new (opts: {
        checkoutKey: string;
        paymentId: string;
        containerId: string;
        language?: string;
      }) => {
        on: (event: string, cb: (data: unknown) => void) => void;
      };
    };
  }
}

const NETS_CHECKOUT_JS =
  (process.env.NEXT_PUBLIC_NETS_EASY_ENV ?? "test").toLowerCase() === "live"
    ? "https://checkout.dibspayment.eu/checkout.js"
    : "https://test.checkout.dibspayment.eu/checkout.js";

const NETS_CHECKOUT_KEY = process.env.NEXT_PUBLIC_NETS_EASY_CHECKOUT_KEY ?? "";

interface CustomerForm {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
}

const EMPTY_FORM: CustomerForm = {
  email: "", phone: "", firstName: "", lastName: "",
  address: "", postalCode: "", city: "",
};

export function KassaClient({ session }: { session: Session | null }) {
  const { items, count, total, removeItem, updateQty, clearCart } = useCart();
  const [form, setForm] = useState<CustomerForm>(() => {
    if (session) {
      const parts = session.name.split(" ");
      return { ...EMPTY_FORM, firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
    }
    return EMPTY_FORM;
  });
  const [method, setMethod] = useState<PaymentMethod>("NETS_EASY");
  const [step, setStep] = useState<"auth" | "cart" | "info" | "payment">(
    session ? "cart" : "auth"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [klarnaSnippet, setKlarnaSnippet] = useState("");
  const [swishOrderNumber, setSwishOrderNumber] = useState("");
  const [swishPending, setSwishPending] = useState(false);
  const [netsPaymentId, setNetsPaymentId] = useState("");
  const [netsOrderNumber, setNetsOrderNumber] = useState("");

  const shipping = total >= 500 ? 0 : 99;
  const grandTotal = total + shipping;
  const vat = Math.round(grandTotal * 0.2);

  function setField(k: keyof CustomerForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  function formValid() {
    return (
      form.email && form.firstName && form.lastName &&
      form.address && form.postalCode && form.city &&
      (method !== "SWISH" || form.phone)
    );
  }

  async function handlePay() {
    if (!formValid()) { setError("Fyll i alla obligatoriska fält."); return; }
    setError("");
    setLoading(true);

    const payload = {
      items: items.map((i) => ({
        partId: i.partId, sku: i.sku, name: i.name,
        priceSek: i.priceSek, quantity: i.quantity,
      })),
      customer: form,
    };

    try {
      if (method === "NETS_EASY") {
        const res = await fetch("/api/checkout/nets", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Nets-fel");
        setNetsPaymentId(data.paymentId);
        setNetsOrderNumber(data.orderNumber);
        setStep("payment");
      } else if (method === "KLARNA") {
        const res = await fetch("/api/checkout/klarna", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Klarna-fel");
        setKlarnaSnippet(data.htmlSnippet);
        setStep("payment");
      } else {
        const res = await fetch("/api/checkout/swish", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Swish-fel");
        setSwishOrderNumber(data.orderNumber);
        setSwishPending(true);
        setStep("payment");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!klarnaSnippet) return;
    const el = document.getElementById("klarna-checkout-container");
    if (!el) return;
    el.innerHTML = klarnaSnippet;
    const scripts = Array.from(el.querySelectorAll("script"));
    scripts.forEach((old) => {
      const s = document.createElement("script");
      if (old.src) s.src = old.src;
      else s.textContent = old.textContent;
      old.parentNode?.replaceChild(s, old);
    });
  }, [klarnaSnippet]);

  // Nets Easy embedded checkout
  useEffect(() => {
    if (!netsPaymentId) return;
    if (!NETS_CHECKOUT_KEY) {
      setError("Nets-checkout är inte konfigurerad ännu (saknar publik nyckel).");
      return;
    }

    function mount() {
      if (!window.Dibs) return;
      const checkout = new window.Dibs.Checkout({
        checkoutKey: NETS_CHECKOUT_KEY,
        paymentId: netsPaymentId,
        containerId: "nets-checkout-container",
        language: "sv-SE",
      });
      checkout.on("payment-completed", () => {
        clearCart();
        window.location.href = `/kassa/bekraftelse?nets_payment_id=${netsPaymentId}`;
      });
    }

    if (window.Dibs) {
      mount();
      return;
    }

    const script = document.createElement("script");
    script.src = NETS_CHECKOUT_JS;
    script.async = true;
    script.onload = mount;
    script.onerror = () => setError("Kunde inte ladda Nets-checkout.");
    document.head.appendChild(script);
  }, [netsPaymentId, clearCart]);

  if (count === 0 && step === "cart") {
    return (
      <section className="max-w-5xl mx-auto px-4 pt-10 pb-20">
        <Breadcrumb />
        <h1 className="text-3xl sm:text-4xl font-black mb-8"><span className="gradient-text">Kassa</span></h1>
        <div className="glass rounded-xl p-12 text-center max-w-lg mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold mb-2">Din varukorg är tom</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Bläddra bland 30 000+ delar och hitta exakt det du behöver.
          </p>
          <Link href="/bildelar" className="btn-primary">Bläddra delar →</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 pt-10 pb-20">
      <Breadcrumb />
      <h1 className="text-3xl sm:text-4xl font-black mb-8"><span className="gradient-text">Kassa</span></h1>

      {/* ─── Step: auth choice ─── */}
      {step === "auth" && (
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-[var(--color-text-secondary)] mb-8 text-sm">
            Logga in för att använda sparade uppgifter, eller fortsätt som gäst.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Login card */}
            <a
              href={`/logga-in?redirect=/kassa`}
              className="group rounded-2xl border-2 border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/5 p-8 text-center hover:bg-[var(--color-brand-orange)]/10 transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-[var(--color-brand-orange)]/15 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[var(--color-brand-orange)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h2 className="font-bold text-lg mb-2">Logga in</h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                Dina uppgifter fylls i automatiskt — snabbare checkout.
              </p>
              <span className="btn-primary text-sm px-6 py-2.5 rounded-xl inline-block">
                Logga in →
              </span>
            </a>

            {/* Guest card */}
            <button
              onClick={() => setStep("cart")}
              className="group rounded-2xl border-2 border-[var(--color-dark-500)] bg-[var(--color-dark-800)] p-8 text-center hover:border-[var(--color-dark-400)] transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-[var(--color-dark-700)] flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </div>
              <h2 className="font-bold text-lg mb-2">Fortsätt som gäst</h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                Inget konto behövs — fyll i uppgifter manuellt vid kassan.
              </p>
              <span className="inline-block px-6 py-2.5 rounded-xl border border-[var(--color-dark-500)] text-sm font-semibold text-[var(--color-text-secondary)] group-hover:border-[var(--color-brand-orange)] group-hover:text-[var(--color-brand-orange)] transition-all">
                Fortsätt som gäst →
              </span>
            </button>
          </div>

          <p className="text-center mt-6 text-xs text-[var(--color-text-muted)]">
            Har du inget konto?{" "}
            <a href="/logga-in?portal=customer" className="text-[var(--color-brand-orange)] hover:underline">
              Skapa konto
            </a>
          </p>
        </div>
      )}

      {/* ─── Step indicator (cart + info) ─── */}
      {(step === "cart" || step === "info") && (
        <div className="flex items-center gap-3 mb-8 text-sm">
          {session && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-medium mb-4 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Inloggad som {session.name}
            </div>
          )}
        </div>
      )}

      {(step === "cart" || step === "info") && (
        <div className="flex items-center gap-3 mb-6 text-sm">
          <StepDot active={step === "cart"} done={step === "info"} n={1} label="Varukorg" />
          <div className="flex-1 h-px bg-[var(--color-dark-500)]" />
          <StepDot active={step === "info"} done={false} n={2} label="Uppgifter & betalning" />
        </div>
      )}

      {/* ─── Payment views ─── */}
      {step === "payment" && (
        <div className="mb-8">
          {method === "NETS_EASY" && (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-bold">Betala</h2>
                {netsOrderNumber && (
                  <span className="text-xs text-[var(--color-text-muted)]">Order #{netsOrderNumber}</span>
                )}
              </div>
              <div
                id="nets-checkout-container"
                className="rounded-xl overflow-hidden bg-white min-h-[600px]"
              />
              <p className="mt-3 text-xs text-[var(--color-text-muted)] text-center">
                🔒 Säker betalning via Nets Easy · Kort, Swish, faktura och delbetalning
              </p>
            </div>
          )}
          {method === "KLARNA" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Betala med Klarna</h2>
              <div id="klarna-checkout-container" className="rounded-xl overflow-hidden" />
            </div>
          )}
          {method === "SWISH" && swishPending && (
            <SwishPending orderNumber={swishOrderNumber} phone={form.phone} onDone={() => {
              clearCart();
              window.location.href = `/kassa/bekraftelse?order=${swishOrderNumber}`;
            }} />
          )}
        </div>
      )}

      {/* ─── Cart + info steps ─── */}
      {(step === "cart" || step === "info") && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {step === "cart" && (
              <>
                {items.map((item) => (
                  <CartRow
                    key={item.partId}
                    item={item}
                    onRemove={() => removeItem(item.partId)}
                    onQty={(q) => updateQty(item.partId, q)}
                  />
                ))}
                <div className="flex justify-between pt-2">
                  {!session && (
                    <button onClick={() => setStep("auth")} className="btn-secondary px-6 py-3 text-sm">
                      ← Logga in istället
                    </button>
                  )}
                  <button
                    onClick={() => setStep("info")}
                    className="btn-primary px-8 py-3 ml-auto"
                  >
                    Fortsätt till uppgifter →
                  </button>
                </div>
              </>
            )}

            {step === "info" && (
              <div className="glass rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Leveransuppgifter</h2>
                  {session && (
                    <span className="text-xs text-[var(--color-text-muted)]">
                      Namn förifyllt från ditt konto
                    </span>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Förnamn *" value={form.firstName} onChange={setField("firstName")} />
                  <Field label="Efternamn *" value={form.lastName} onChange={setField("lastName")} />
                  <Field label="E-post *" type="email" value={form.email} onChange={setField("email")} className="sm:col-span-2" />
                  <Field label={method === "SWISH" ? "Telefon * (Swish-nummer)" : "Telefon"} type="tel" value={form.phone} onChange={setField("phone")} className="sm:col-span-2" />
                  <Field label="Gatuadress *" value={form.address} onChange={setField("address")} className="sm:col-span-2" />
                  <Field label="Postnummer *" value={form.postalCode} onChange={setField("postalCode")} />
                  <Field label="Ort *" value={form.city} onChange={setField("city")} />
                </div>

                <div className="border-t border-[var(--color-dark-500)] pt-5">
                  <h2 className="font-bold text-lg mb-4">Betalningsmetod</h2>
                  <div className="grid sm:grid-cols-1 gap-3">
                    <PayMethodCard
                      id="NETS_EASY"
                      active={method === "NETS_EASY"}
                      onSelect={() => setMethod("NETS_EASY")}
                      icon="💳"
                      title="Kort, Swish & faktura"
                      desc="Visa, Mastercard, Swish, Klarna faktura och delbetalning — säker checkout via Nets"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button onClick={() => setStep("cart")} className="btn-secondary px-6 py-3">
                    ← Tillbaka
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={loading}
                    className="btn-primary px-8 py-3 flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Väntar…"
                      : method === "NETS_EASY" ? "Fortsätt till betalning →"
                      : method === "KLARNA" ? "Fortsätt till Klarna →"
                      : "Skicka Swish-begäran →"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="glass rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-bold mb-4">Sammanfattning</h2>
            <div className="space-y-1.5 text-sm text-[var(--color-text-secondary)] mb-4">
              {items.map((i) => (
                <div key={i.partId} className="flex justify-between gap-2">
                  <span className="truncate">{i.name} ×{i.quantity}</span>
                  <span className="shrink-0">{(i.priceSek * i.quantity).toLocaleString("sv-SE")} kr</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-dark-500)] pt-3 space-y-1.5 text-sm">
              <Row label="Delsumma" value={`${total.toLocaleString("sv-SE")} kr`} />
              <Row label="Frakt" value={shipping === 0 ? "Fri frakt" : `${shipping} kr`} />
              <Row label="Moms (25 %)" value={`${vat.toLocaleString("sv-SE")} kr`} />
            </div>
            <div className="border-t border-[var(--color-dark-500)] mt-3 pt-3 flex justify-between font-bold">
              <span>Totalt</span>
              <span className="text-[var(--color-brand-orange)]">{grandTotal.toLocaleString("sv-SE")} kr</span>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-dark-500)] space-y-1.5 text-xs text-[var(--color-text-muted)]">
              <div>💳 Klarna · Swish</div>
              <div>🚚 Fri frakt över 500 kr</div>
              <div>🛡️ Garanti på alla delar</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── Sub-components ─── */

function Breadcrumb() {
  return (
    <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
      <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
      <span>›</span>
      <span className="text-[var(--color-text-secondary)]">Kassa</span>
    </nav>
  );
}

function StepDot({ active, done, n, label }: { active: boolean; done: boolean; n: number; label: string }) {
  return (
    <div className={`flex items-center gap-2 ${active ? "text-[var(--color-brand-orange)]" : done ? "text-green-500" : "text-[var(--color-text-muted)]"}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${active ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/10" : done ? "border-green-500 bg-green-500/10" : "border-[var(--color-dark-500)]"}`}>
        {done ? "✓" : n}
      </div>
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}

function CartRow({ item, onRemove, onQty }: {
  item: { partId: string; sku: string; name: string; priceSek: number; quantity: number };
  onRemove: () => void;
  onQty: (q: number) => void;
}) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-[var(--color-dark-700)] flex items-center justify-center text-2xl shrink-0">🔩</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.name}</p>
        <p className="text-xs text-[var(--color-text-muted)]">Art.nr {item.sku}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onQty(item.quantity - 1)} className="w-7 h-7 rounded-md bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)] flex items-center justify-center text-sm">−</button>
        <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
        <button onClick={() => onQty(item.quantity + 1)} className="w-7 h-7 rounded-md bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)] flex items-center justify-center text-sm">+</button>
      </div>
      <div className="text-right shrink-0 min-w-[70px]">
        <p className="font-bold text-[var(--color-brand-orange)]">{(item.priceSek * item.quantity).toLocaleString("sv-SE")} kr</p>
        <button onClick={onRemove} className="text-xs text-[var(--color-text-muted)] hover:text-red-400 transition-colors mt-0.5">Ta bort</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", className = "" }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs text-[var(--color-text-muted)] mb-1">{label}</label>
      <input
        type={type} value={value} onChange={onChange}
        className="w-full px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
      />
    </div>
  );
}

function PayMethodCard({ id, active, onSelect, icon, title, desc }: {
  id: string; active: boolean; onSelect: () => void;
  icon: string; title: string; desc: string;
}) {
  return (
    <button
      type="button" onClick={onSelect}
      className={`rounded-xl p-4 text-left border transition-all ${
        active
          ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/5"
          : "border-[var(--color-dark-500)] hover:border-[var(--color-dark-400)] bg-[var(--color-dark-800)]"
      }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{desc}</div>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[var(--color-text-secondary)]">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

function SwishPending({ orderNumber, phone, onDone }: {
  orderNumber: string; phone: string; onDone: () => void;
}) {
  const [checking, setChecking] = useState(false);

  async function checkStatus() {
    setChecking(true);
    try {
      const res = await fetch(`/api/checkout/swish/status?order=${orderNumber}`);
      const data = await res.json();
      if (data.status === "PAID") { onDone(); }
      else { alert("Betalningen är ännu inte mottagen. Öppna Swish på din telefon och godkänn betalningen."); }
    } catch { alert("Kunde inte kontrollera status."); }
    finally { setChecking(false); }
  }

  return (
    <div className="glass rounded-xl p-8 max-w-lg text-center">
      <div className="text-6xl mb-4">📱</div>
      <h2 className="text-xl font-bold mb-2">Öppna Swish</h2>
      <p className="text-[var(--color-text-secondary)] text-sm mb-2">
        En betalningsbegäran har skickats till <strong>{phone}</strong>.
      </p>
      <p className="text-[var(--color-text-muted)] text-xs mb-6">Order #{orderNumber}</p>
      <ol className="text-sm text-left space-y-2 mb-8 text-[var(--color-text-secondary)]">
        <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--color-brand-orange)] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>Öppna Swish-appen på din telefon</li>
        <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--color-brand-orange)] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>Godkänn betalningsbegäran</li>
        <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-[var(--color-brand-orange)] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>Klicka på knappen nedan för att bekräfta</li>
      </ol>
      <button onClick={checkStatus} disabled={checking} className="btn-primary w-full py-3 disabled:opacity-60">
        {checking ? "Kontrollerar…" : "Jag har betalat i Swish ✓"}
      </button>
    </div>
  );
}
