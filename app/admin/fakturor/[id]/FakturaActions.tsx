"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  invoiceId: string;
  status: string;
  customerEmail: string | null;
}

export function FakturaActions({ invoiceId, status, customerEmail }: Props) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [marking, setMarking] = useState(false);
  const [sendEmail, setSendEmail] = useState(customerEmail ?? "");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"ok" | "err">("ok");

  async function handleSend() {
    if (!sendEmail) { setShowEmailInput(true); return; }
    setSending(true);
    setMsg("");
    try {
      const res = await fetch("/api/faktura/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, toEmail: sendEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fel");
      setMsg(`✓ Faktura skickad till ${sendEmail}`);
      setMsgType("ok");
      router.refresh();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Kunde inte skicka");
      setMsgType("err");
    } finally {
      setSending(false);
      setShowEmailInput(false);
    }
  }

  async function handleMarkPaid() {
    if (!confirm("Markera fakturan som betald?")) return;
    setMarking(true);
    setMsg("");
    try {
      const res = await fetch("/api/faktura/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      if (!res.ok) throw new Error("Fel");
      setMsg("✓ Fakturan markerad som betald");
      setMsgType("ok");
      router.refresh();
    } catch {
      setMsg("Något gick fel");
      setMsgType("err");
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2">
        {/* Download PDF */}
        <a
          href={`/api/faktura/pdf?id=${invoiceId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary px-4 py-2 text-sm flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
          </svg>
          Ladda ned PDF
        </a>

        {/* Send email */}
        {status !== "CANCELLED" && (
          <button
            onClick={() => setShowEmailInput(true)}
            disabled={sending}
            className="btn-secondary px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-60"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            {sending ? "Skickar…" : "Skicka mejl"}
          </button>
        )}

        {/* Mark paid */}
        {status !== "PAID" && status !== "CANCELLED" && (
          <button
            onClick={handleMarkPaid}
            disabled={marking}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-60"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {marking ? "Sparar…" : "Markera betald"}
          </button>
        )}
      </div>

      {/* Email input popup */}
      {showEmailInput && (
        <div className="glass rounded-xl p-4 w-72 border border-[var(--color-dark-400)]">
          <label className="block text-xs text-[var(--color-text-muted)] mb-1">Skicka till e-post</label>
          <input
            type="email"
            value={sendEmail}
            onChange={(e) => setSendEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="kund@example.com"
            autoFocus
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSend}
              disabled={sending || !sendEmail}
              className="flex-1 btn-primary py-2 text-sm disabled:opacity-60"
            >
              {sending ? "Skickar…" : "Skicka →"}
            </button>
            <button onClick={() => setShowEmailInput(false)} className="btn-secondary px-3 py-2 text-sm">
              Avbryt
            </button>
          </div>
        </div>
      )}

      {msg && (
        <p className={`text-sm ${msgType === "ok" ? "text-[var(--color-success-bright)]" : "text-red-400"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
