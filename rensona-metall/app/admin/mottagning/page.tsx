"use client";

import { useState } from "react";
import { MATERIALS_SEED } from "@/data/materials";
import { KYC_THRESHOLD_SEK, formatSEK, type CartItem, type PaymentMethod } from "@/lib/types";

const STEPS = ["Incheckning", "Sortera", "KYC", "Betala", "Klar"] as const;
type Step = (typeof STEPS)[number];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-bold"
              style={
                i < current
                  ? { background: "var(--color-ok)", color: "white" }
                  : i === current
                  ? { background: "var(--color-cu)", color: "var(--color-dark)" }
                  : { background: "rgba(250,247,243,0.1)", color: "rgba(250,247,243,0.35)" }
              }
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span
              className="font-mono text-[8px] tracking-[1px] uppercase mt-1.5 hidden sm:block"
              style={{ color: i === current ? "var(--color-cu)" : "rgba(250,247,243,0.35)" }}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-8 sm:w-16 h-px mx-1" style={{ background: i < current ? "var(--color-ok)" : "rgba(250,247,243,0.1)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 1: Incheckning ───────────────────────────────────────────────────────
function Incheckning({ onNext }: { onNext: (name: string, id: string, phone: string) => void }) {
  const [name, setName] = useState("");
  const [idNum, setIdNum] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-3xl tracking-wider uppercase mb-6" style={{ color: "var(--color-white)" }}>
        Kund incheckning
      </h2>
      <div className="space-y-4 mb-6">
        <div>
          <label className="font-mono text-[8.5px] tracking-[1.3px] uppercase block mb-2" style={{ color: "rgba(250,247,243,0.5)" }}>Namn</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="För- och efternamn"
            className="w-full rounded-lg px-4 py-3 text-sm"
            style={{ background: "rgba(250,247,243,0.07)", border: "1px solid rgba(250,247,243,0.15)", color: "var(--color-white)" }}
          />
        </div>
        <div>
          <label className="font-mono text-[8.5px] tracking-[1.3px] uppercase block mb-2" style={{ color: "rgba(250,247,243,0.5)" }}>Personnr / Org.nr</label>
          <input
            value={idNum}
            onChange={(e) => setIdNum(e.target.value)}
            placeholder="YYYYMMDD-XXXX"
            className="w-full rounded-lg px-4 py-3 text-sm"
            style={{ background: "rgba(250,247,243,0.07)", border: "1px solid rgba(250,247,243,0.15)", color: "var(--color-white)" }}
          />
        </div>
        <div>
          <label className="font-mono text-[8.5px] tracking-[1.3px] uppercase block mb-2" style={{ color: "rgba(250,247,243,0.5)" }}>Telefon</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07X-XXX XX XX"
            className="w-full rounded-lg px-4 py-3 text-sm"
            style={{ background: "rgba(250,247,243,0.07)", border: "1px solid rgba(250,247,243,0.15)", color: "var(--color-white)" }}
          />
        </div>
      </div>
      <button
        onClick={() => name && idNum && onNext(name, idNum, phone)}
        disabled={!name || !idNum}
        className="btn-cu"
      >
        Nästa: Sortera material →
      </button>
    </div>
  );
}

// ── Step 2: Sortera ───────────────────────────────────────────────────────────
function Sortera({ onNext }: { onNext: (cart: CartItem[]) => void }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [materialId, setMaterialId] = useState(MATERIALS_SEED[0].id);
  const [weight, setWeight] = useState("");

  const materials = MATERIALS_SEED.filter((m) => m.category !== "Bil");
  const selected = materials.find((m) => m.id === materialId)!;

  const addItem = () => {
    const kg = parseFloat(weight);
    if (!kg || kg <= 0) return;
    setCart((c) => [...c, { material: selected, weight_kg: kg, price_per_kg: selected.price_per_kg }]);
    setWeight("");
  };

  const removeItem = (i: number) => setCart((c) => c.filter((_, idx) => idx !== i));
  const total = cart.reduce((s, item) => s + item.weight_kg * item.material.price_per_kg, 0);

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-3xl tracking-wider uppercase mb-6" style={{ color: "var(--color-white)" }}>
        Sortera material
      </h2>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div className="sm:col-span-2">
          <label className="font-mono text-[8.5px] tracking-[1.3px] uppercase block mb-2" style={{ color: "rgba(250,247,243,0.5)" }}>Material</label>
          <select
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm"
            style={{ background: "rgba(250,247,243,0.07)", border: "1px solid rgba(250,247,243,0.15)", color: "var(--color-white)" }}
          >
            {materials.map((m) => (
              <option key={m.id} value={m.id} style={{ background: "#0f0a06" }}>
                {m.name} — {formatSEK(m.price_per_kg)}/kg
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono text-[8.5px] tracking-[1.3px] uppercase block mb-2" style={{ color: "rgba(250,247,243,0.5)" }}>Vikt (kg)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
              className="flex-1 min-w-0 rounded-lg px-4 py-3 text-sm"
              style={{ background: "rgba(250,247,243,0.07)", border: "1px solid rgba(250,247,243,0.15)", color: "var(--color-white)" }}
            />
            <button
              onClick={addItem}
              className="rounded-lg px-4 py-3 font-bold text-sm"
              style={{ background: "var(--color-cu)", color: "var(--color-dark)" }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {cart.length > 0 && (
        <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid rgba(250,247,243,0.1)" }}>
          {cart.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 text-sm" style={{ borderBottom: i < cart.length - 1 ? "1px solid rgba(250,247,243,0.07)" : undefined }}>
              <span style={{ color: "var(--color-white)" }}>{item.material.name}</span>
              <span style={{ color: "rgba(250,247,243,0.5)" }}>{item.weight_kg} kg</span>
              <span style={{ color: "var(--color-cu)" }}>{formatSEK(item.weight_kg * item.material.price_per_kg)}</span>
              <button onClick={() => removeItem(i)} className="text-xs" style={{ color: "rgba(250,247,243,0.35)" }}>✕</button>
            </div>
          ))}
          <div className="flex justify-between px-5 py-4" style={{ background: "rgba(200,121,65,0.1)" }}>
            <span className="font-mono text-[9px] tracking-[1.2px] uppercase" style={{ color: "rgba(250,247,243,0.5)" }}>Totalt</span>
            <span className="font-display text-2xl" style={{ color: "var(--color-cu)" }}>{formatSEK(total)}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => cart.length > 0 && onNext(cart)}
        disabled={cart.length === 0}
        className="btn-cu"
      >
        Nästa: KYC-kontroll →
      </button>
    </div>
  );
}

// ── Step 3: KYC ───────────────────────────────────────────────────────────────
function KYCStep({ total, onNext }: { total: number; onNext: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const needsKyc = total >= KYC_THRESHOLD_SEK;

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-3xl tracking-wider uppercase mb-4" style={{ color: "var(--color-white)" }}>
        KYC-kontroll
      </h2>

      {needsKyc ? (
        <div className="rounded-xl p-5 mb-6" style={{ background: "rgba(192,57,43,0.12)", border: "1px solid rgba(192,57,43,0.35)" }}>
          <div className="font-mono text-[9px] tracking-[1.3px] uppercase mb-2" style={{ color: "var(--color-err)" }}>
            ⚠ KYC obligatorisk — {formatSEK(total)} överstiger {formatSEK(KYC_THRESHOLD_SEK)}
          </div>
          <p className="text-sm" style={{ color: "rgba(250,247,243,0.6)" }}>
            Penningtvättslagen kräver extra ID-kontroll vid belopp ≥ 58 000 kr. Verifiera legitimation och dokumentera.
          </p>
        </div>
      ) : (
        <div className="rounded-xl p-5 mb-6" style={{ background: "rgba(58,138,82,0.1)", border: "1px solid rgba(58,138,82,0.25)" }}>
          <div className="font-mono text-[9px] tracking-[1.3px] uppercase mb-2" style={{ color: "var(--color-ok)" }}>
            ✓ Standardkontroll — {formatSEK(total)}
          </div>
          <p className="text-sm" style={{ color: "rgba(250,247,243,0.6)" }}>
            Beloppet understiger KYC-gränsen. Kontrollera legitimation och signera.
          </p>
        </div>
      )}

      <div className="space-y-3 mb-6">
        {["Legitimation visad och verifierad", "Registreringsbevis kontrollerat (vid bil)", "Kund har informerats om prissättning"].map((check) => (
          <label key={check} className="flex items-center gap-3 cursor-pointer text-sm" style={{ color: "rgba(250,247,243,0.7)" }}>
            <input type="checkbox" className="w-4 h-4 rounded" />
            {check}
          </label>
        ))}
        <label className="flex items-center gap-3 cursor-pointer text-sm" style={{ color: "rgba(250,247,243,0.7)" }}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="w-4 h-4 rounded" />
          <span>KYC-kontroll genomförd och godkänd</span>
        </label>
      </div>

      <button onClick={onNext} disabled={!confirmed} className="btn-cu">
        Nästa: Betalning →
      </button>
    </div>
  );
}

// ── Step 4: Betala ────────────────────────────────────────────────────────────
function Betala({ total, onNext }: { total: number; onNext: (method: PaymentMethod) => void }) {
  const [method, setMethod] = useState<PaymentMethod>("swish");

  const METHODS: { id: PaymentMethod; label: string; desc: string }[] = [
    { id: "swish", label: "Swish", desc: "Direkt till kund" },
    { id: "bankgiro", label: "Bankgiro", desc: "1–2 bankdagar" },
    { id: "cash", label: "Kontant", desc: "Kontanthantering" },
  ];

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-3xl tracking-wider uppercase mb-4" style={{ color: "var(--color-white)" }}>
        Betalning
      </h2>

      <div className="rounded-xl p-5 mb-6" style={{ background: "rgba(200,121,65,0.1)", border: "1px solid rgba(200,121,65,0.2)" }}>
        <div className="font-mono text-[9px] tracking-[1.2px] uppercase mb-1" style={{ color: "rgba(250,247,243,0.5)" }}>Att betala</div>
        <div className="font-display text-5xl" style={{ color: "var(--color-cu)" }}>{formatSEK(total)}</div>
      </div>

      <div className="space-y-2 mb-6">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className="w-full text-left rounded-xl px-5 py-4 flex items-center justify-between transition-all"
            style={method === m.id
              ? { background: "var(--color-cu)", color: "var(--color-dark)" }
              : { background: "rgba(250,247,243,0.06)", border: "1px solid rgba(250,247,243,0.12)", color: "var(--color-white)" }}
          >
            <span className="font-medium">{m.label}</span>
            <span className="text-xs opacity-60">{m.desc}</span>
          </button>
        ))}
      </div>

      <button onClick={() => onNext(method)} className="btn-cu">
        Bekräfta betalning →
      </button>
    </div>
  );
}

// ── Step 5: Klar ──────────────────────────────────────────────────────────────
function Klar({ name, total, method, onReset }: { name: string; total: number; method: PaymentMethod; onReset: () => void }) {
  const ref = `REN-${Date.now().toString(36).toUpperCase()}`;

  const LABELS: Record<PaymentMethod, string> = {
    swish: "Swish",
    bankgiro: "Bankgiro",
    cash: "Kontant",
    invoice: "Faktura",
  };

  return (
    <div className="max-w-lg text-center">
      <div className="text-5xl mb-4">✓</div>
      <h2 className="font-display text-3xl tracking-wider uppercase mb-2" style={{ color: "var(--color-ok)" }}>
        Klar!
      </h2>
      <p className="font-serif-it text-lg mb-6" style={{ color: "rgba(250,247,243,0.6)" }}>
        Transaktion registrerad för {name}
      </p>

      <div className="rounded-xl p-6 text-left mb-6 space-y-3" style={{ background: "rgba(250,247,243,0.06)", border: "1px solid rgba(250,247,243,0.1)" }}>
        <div className="flex justify-between text-sm">
          <span style={{ color: "rgba(250,247,243,0.5)" }}>Referens</span>
          <span className="font-mono" style={{ color: "var(--color-cu)" }}>{ref}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "rgba(250,247,243,0.5)" }}>Belopp</span>
          <span className="font-display text-xl" style={{ color: "var(--color-cu)" }}>{formatSEK(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "rgba(250,247,243,0.5)" }}>Betalningsmetod</span>
          <span style={{ color: "var(--color-white)" }}>{LABELS[method]}</span>
        </div>
      </div>

      <button onClick={onReset} className="btn-cu">
        Ny mottagning →
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MottagningPage() {
  const [step, setStep] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("swish");

  const total = cart.reduce((s, item) => s + item.weight_kg * item.material.price_per_kg, 0);

  const reset = () => {
    setStep(0);
    setCustomerName("");
    setCart([]);
    setPaymentMethod("swish");
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
      <div className="mb-6">
        <div className="font-mono text-[8.5px] tracking-[1.8px] uppercase mb-2" style={{ color: "var(--color-cu)" }}>
          Drop-in
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase" style={{ color: "var(--color-white)" }}>
          Mottagning
        </h1>
      </div>

      <StepIndicator current={step} />

      {step === 0 && (
        <Incheckning
          onNext={(name, id, phone) => {
            setCustomerName(name);
            void id; void phone;
            setStep(1);
          }}
        />
      )}
      {step === 1 && (
        <Sortera
          onNext={(items) => {
            setCart(items);
            setStep(2);
          }}
        />
      )}
      {step === 2 && <KYCStep total={total} onNext={() => setStep(3)} />}
      {step === 3 && (
        <Betala
          total={total}
          onNext={(method) => {
            setPaymentMethod(method);
            setStep(4);
          }}
        />
      )}
      {step === 4 && (
        <Klar name={customerName} total={total} method={paymentMethod} onReset={reset} />
      )}
    </div>
  );
}
