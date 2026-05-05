"use client";

/**
 * Client-side wrapper around the parts table that adds:
 *   - row-level checkboxes + "select all on this page"
 *   - a floating action bar at the bottom when ≥1 row is selected
 *   - bulk status change (Tillgänglig / Reserverad / Såld / Dragen)
 *   - bulk price set (single shared price or "pris på förfrågan")
 *
 * The list is still filtered/sorted server-side; selection state is
 * page-local and resets when the URL changes (filters / pagination).
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { bulkUpdateStatus, bulkUpdatePrice } from "./actions";

type PartRow = {
  id: string;
  sku: string;
  name: string;
  oeNumber: string | null;
  priceSek: number | null;
  status: string;
  condition: string;
  vehicle: {
    brandSlug: string;
    brandName: string;
    brandLogo: string;
    model: string;
    year: number | null;
  };
};

const CONDITION_LABELS: Record<string, string> = {
  NEW:           "Ny",
  USED_LIKE_NEW: "Begagnad (som ny)",
  USED_GOOD:     "Begagnad (bra)",
  USED_OK:       "Begagnad (ok)",
  USED_POOR:     "Begagnad (sliten)",
};

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE:  "bg-[var(--color-success)]/10 text-[var(--color-success-bright)]",
  RESERVED:   "bg-blue-500/10 text-blue-300",
  SOLD:       "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]",
  WITHDRAWN:  "bg-[var(--color-error)]/10 text-[var(--color-error)]",
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE:  "Tillgänglig",
  RESERVED:   "Reserverad",
  SOLD:       "Såld",
  WITHDRAWN:  "Dragen",
};

export function PartsBulkTable({ parts }: { parts: PartRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [priceInput, setPriceInput] = useState("");

  const allOnPageSelected =
    parts.length > 0 && parts.every((p) => selected.has(p.id));
  const someSelected = selected.size > 0;

  function toggleAll() {
    if (allOnPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const p of parts) next.delete(p.id);
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const p of parts) next.add(p.id);
        return next;
      });
    }
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
    setFeedback(null);
    setError(null);
    setShowPriceInput(false);
    setPriceInput("");
  }

  function applyStatus(status: string) {
    if (selected.size === 0) return;
    setError(null);
    setFeedback(null);
    const ids = [...selected];
    startTransition(async () => {
      const r = await bulkUpdateStatus(ids, status);
      if (r.ok) {
        setFeedback(`✓ ${r.count} ${r.count === 1 ? "del" : "delar"} uppdaterade.`);
        clearSelection();
        router.refresh();
      } else {
        setError(r.error);
      }
    });
  }

  function applyPrice() {
    if (selected.size === 0) return;
    setError(null);
    setFeedback(null);
    const trimmed = priceInput.trim();
    let price: number | null;
    if (trimmed === "" || trimmed === "—") {
      price = null;
    } else {
      const parsed = parseInt(trimmed.replace(/[^0-9]/g, ""), 10);
      if (Number.isNaN(parsed) || parsed < 0) {
        setError("Skriv ett giltigt pris i hela kronor (eller lämna tomt för ”pris på förfrågan”).");
        return;
      }
      price = parsed;
    }
    const ids = [...selected];
    startTransition(async () => {
      const r = await bulkUpdatePrice(ids, price);
      if (r.ok) {
        setFeedback(
          price == null
            ? `✓ ${r.count} delar markerade som ”pris på förfrågan”.`
            : `✓ Pris ${price.toLocaleString("sv-SE")} kr satt på ${r.count} delar.`
        );
        clearSelection();
        router.refresh();
      } else {
        setError(r.error);
      }
    });
  }

  return (
    <>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
              <tr className="border-b border-[var(--color-dark-500)]">
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    aria-label="Markera alla på sidan"
                    checked={allOnPageSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-[var(--color-brand-orange)] cursor-pointer"
                  />
                </th>
                <th className="text-left px-5 py-3 font-semibold">SKU</th>
                <th className="text-left px-5 py-3 font-semibold">Namn</th>
                <th className="text-left px-5 py-3 font-semibold">Bil</th>
                <th className="text-left px-5 py-3 font-semibold">Skick</th>
                <th className="text-right px-5 py-3 font-semibold">Pris</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => {
                const isSelected = selected.has(p.id);
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-[var(--color-dark-500)]/50 hover:bg-white/[0.02] ${
                      isSelected ? "bg-[var(--color-brand-orange)]/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        aria-label={`Markera ${p.sku}`}
                        checked={isSelected}
                        onChange={(e) => toggleOne(p.id, e.target.checked)}
                        className="w-4 h-4 accent-[var(--color-brand-orange)] cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      <Link href={`/admin/delar/${p.id}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-orange)]">
                        {p.sku}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/delar/${p.id}`} className="block hover:text-[var(--color-brand-orange)]">
                        <div className="font-semibold">{p.name}</div>
                        {p.oeNumber && (
                          <div className="text-xs text-[var(--color-text-muted)]">OE: {p.oeNumber}</div>
                        )}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span>{p.vehicle.brandLogo || "🚗"}</span>
                        <div className="text-xs">
                          <div className="font-medium">{p.vehicle.brandName || p.vehicle.brandSlug}</div>
                          <div className="text-[var(--color-text-muted)]">
                            {p.vehicle.model} {p.vehicle.year ?? ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-[var(--color-text-secondary)]">
                      {CONDITION_LABELS[p.condition] ?? p.condition}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">
                      {p.priceSek != null ? `${p.priceSek.toLocaleString("sv-SE")} kr` : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[p.status] ?? ""}`}>
                        {STATUS_LABELS[p.status] ?? p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky bulk-action bar */}
      {someSelected && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-5 z-50 max-w-[min(960px,calc(100vw-2rem))] w-full">
          <div className="rounded-2xl bg-[var(--color-dark-700)] border border-[var(--color-brand-orange)]/40 shadow-2xl shadow-black/40 p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-bold mr-1">
                {selected.size} {selected.size === 1 ? "del" : "delar"} markerade
              </span>

              {!showPriceInput ? (
                <>
                  <BulkButton onClick={() => applyStatus("AVAILABLE")} disabled={pending} kind="success">
                    Tillgänglig
                  </BulkButton>
                  <BulkButton onClick={() => applyStatus("RESERVED")} disabled={pending} kind="info">
                    Reserverad
                  </BulkButton>
                  <BulkButton onClick={() => applyStatus("SOLD")} disabled={pending} kind="muted">
                    Såld
                  </BulkButton>
                  <BulkButton onClick={() => applyStatus("WITHDRAWN")} disabled={pending} kind="danger">
                    Dragen
                  </BulkButton>
                  <BulkButton onClick={() => setShowPriceInput(true)} disabled={pending} kind="brand">
                    💰 Sätt pris…
                  </BulkButton>
                </>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    placeholder="Pris i kr (tomt = pris på förfrågan)"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") applyPrice(); }}
                    className="px-3 py-2 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] w-[260px]"
                  />
                  <BulkButton onClick={applyPrice} disabled={pending} kind="brand">
                    {pending ? "Sparar…" : "Bekräfta"}
                  </BulkButton>
                  <BulkButton onClick={() => { setShowPriceInput(false); setPriceInput(""); }} disabled={pending} kind="ghost">
                    Avbryt
                  </BulkButton>
                </div>
              )}

              <div className="ml-auto flex items-center gap-3">
                {feedback && <span className="text-xs text-emerald-400">{feedback}</span>}
                {error && <span className="text-xs text-rose-400">{error}</span>}
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-2"
                >
                  Avmarkera alla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const KIND_STYLES: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25",
  info:    "bg-blue-500/15 text-blue-300 border-blue-500/30 hover:bg-blue-500/25",
  muted:   "bg-[var(--color-dark-500)] text-[var(--color-text-secondary)] border-[var(--color-dark-400)] hover:bg-[var(--color-dark-400)]",
  danger:  "bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25",
  brand:   "bg-[var(--color-brand-orange)]/15 text-[var(--color-brand-orange-light)] border-[var(--color-brand-orange)]/40 hover:bg-[var(--color-brand-orange)]/25",
  ghost:   "bg-transparent text-[var(--color-text-muted)] border-[var(--color-dark-500)] hover:bg-[var(--color-dark-600)]",
};

function BulkButton({
  onClick,
  disabled,
  kind,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  kind: keyof typeof KIND_STYLES;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${KIND_STYLES[kind]}`}
    >
      {children}
    </button>
  );
}
