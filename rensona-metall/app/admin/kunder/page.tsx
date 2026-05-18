"use client";

import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  idNum: string;
  phone: string;
  transactions: number;
  totalSEK: number;
  lastVisit: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Anna Svensson", idNum: "820315-XXXX", phone: "070-123 45 67", transactions: 5, totalSEK: 14500, lastVisit: "2026-05-15" },
  { id: "2", name: "Björn Karlsson AB", idNum: "556XX-XXXX", phone: "073-987 65 43", transactions: 12, totalSEK: 87000, lastVisit: "2026-05-17" },
  { id: "3", name: "Lars Eriksson", idNum: "751201-XXXX", phone: "076-555 44 33", transactions: 2, totalSEK: 3200, lastVisit: "2026-04-28" },
];

export default function KunderPage() {
  const [query, setQuery] = useState("");

  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.idNum.includes(query) ||
      c.phone.includes(query)
  );

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
      <div className="mb-8">
        <div className="font-mono text-[8.5px] tracking-[1.8px] uppercase mb-2" style={{ color: "var(--color-cu)" }}>
          Admin
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase" style={{ color: "var(--color-white)" }}>
          Kunder
        </h1>
      </div>

      <div className="mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök på namn, personnr eller telefon…"
          className="w-full max-w-md rounded-xl px-5 py-3 text-sm"
          style={{ background: "rgba(250,247,243,0.07)", border: "1px solid rgba(250,247,243,0.15)", color: "var(--color-white)" }}
        />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(250,247,243,0.1)" }}>
        <div className="grid grid-cols-5 px-5 py-3" style={{ background: "rgba(250,247,243,0.05)", borderBottom: "1px solid rgba(250,247,243,0.08)" }}>
          {["Namn", "ID", "Telefon", "Transaktioner", "Totalt"].map((h) => (
            <div key={h} className="font-mono text-[8px] tracking-[1.3px] uppercase" style={{ color: "rgba(250,247,243,0.4)" }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm" style={{ color: "rgba(250,247,243,0.35)" }}>
            Inga kunder hittades.
          </div>
        ) : (
          filtered.map((c, i) => (
            <div
              key={c.id}
              className="grid grid-cols-5 px-5 py-4 text-sm"
              style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(250,247,243,0.06)" : undefined }}
            >
              <div style={{ color: "var(--color-white)" }}>{c.name}</div>
              <div style={{ color: "rgba(250,247,243,0.5)" }}>{c.idNum}</div>
              <div style={{ color: "rgba(250,247,243,0.5)" }}>{c.phone}</div>
              <div style={{ color: "rgba(250,247,243,0.7)" }}>{c.transactions} st</div>
              <div style={{ color: "var(--color-cu)" }}>{c.totalSEK.toLocaleString("sv-SE")} kr</div>
            </div>
          ))
        )}
      </div>

      <p className="mt-4 text-xs" style={{ color: "rgba(250,247,243,0.25)" }}>
        Visar exempeldata. Koppla till Supabase för live-kundregister.
      </p>
    </div>
  );
}
