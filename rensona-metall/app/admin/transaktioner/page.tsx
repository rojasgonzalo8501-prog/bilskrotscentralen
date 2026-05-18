"use client";

import { useState } from "react";
import { formatSEK, formatDate } from "@/lib/types";

interface TxRow {
  id: string;
  ref: string;
  customer: string;
  material: string;
  kg: number;
  amount: number;
  method: string;
  date: string;
}

const MOCK: TxRow[] = [
  { id: "1", ref: "REN-ABC123", customer: "Anna Svensson", material: "Kopparkabel", kg: 12.5, amount: 975, method: "Swish", date: "2026-05-17T10:23:00Z" },
  { id: "2", ref: "REN-DEF456", customer: "Björn Karlsson AB", material: "Blandat koppar", kg: 88, amount: 5632, method: "Bankgiro", date: "2026-05-17T13:45:00Z" },
  { id: "3", ref: "REN-GHI789", customer: "Lars Eriksson", material: "Aluminium blank", kg: 34, amount: 544, method: "Kontant", date: "2026-05-16T09:15:00Z" },
];

export default function TransaktionerPage() {
  const [search, setSearch] = useState("");

  const rows = MOCK.filter(
    (r) =>
      r.ref.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
      <div className="mb-8">
        <div className="font-mono text-[8.5px] tracking-[1.8px] uppercase mb-2" style={{ color: "var(--color-cu)" }}>
          Admin
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase" style={{ color: "var(--color-white)" }}>
          Transaktioner
        </h1>
      </div>

      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök på referens eller kund…"
          className="w-full max-w-md rounded-xl px-5 py-3 text-sm"
          style={{ background: "rgba(250,247,243,0.07)", border: "1px solid rgba(250,247,243,0.15)", color: "var(--color-white)" }}
        />
      </div>

      <div className="rounded-xl overflow-x-auto" style={{ border: "1px solid rgba(250,247,243,0.1)" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(250,247,243,0.05)", borderBottom: "1px solid rgba(250,247,243,0.08)" }}>
              {["Datum", "Ref", "Kund", "Material", "Kg", "Belopp", "Metod"].map((h) => (
                <th key={h} className="text-left px-5 py-3 font-mono text-[8px] tracking-[1.3px] uppercase" style={{ color: "rgba(250,247,243,0.4)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(250,247,243,0.06)" : undefined }}>
                <td className="px-5 py-4" style={{ color: "rgba(250,247,243,0.5)" }}>
                  {formatDate(r.date)}
                </td>
                <td className="px-5 py-4 font-mono text-xs" style={{ color: "var(--color-cu)" }}>{r.ref}</td>
                <td className="px-5 py-4" style={{ color: "var(--color-white)" }}>{r.customer}</td>
                <td className="px-5 py-4" style={{ color: "rgba(250,247,243,0.7)" }}>{r.material}</td>
                <td className="px-5 py-4" style={{ color: "rgba(250,247,243,0.7)" }}>{r.kg} kg</td>
                <td className="px-5 py-4 font-medium" style={{ color: "var(--color-cu)" }}>{formatSEK(r.amount)}</td>
                <td className="px-5 py-4" style={{ color: "rgba(250,247,243,0.5)" }}>{r.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: "rgba(250,247,243,0.35)" }}>
            Inga transaktioner hittades.
          </div>
        )}
      </div>

      <p className="mt-4 text-xs" style={{ color: "rgba(250,247,243,0.25)" }}>
        Visar exempeldata. Koppla till Supabase för live-transaktioner.
      </p>
    </div>
  );
}
