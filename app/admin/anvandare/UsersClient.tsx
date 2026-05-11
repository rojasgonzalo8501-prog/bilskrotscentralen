"use client";

import { useState } from "react";
import { ShieldCheck, Shield, User, PauseCircle, PlayCircle, Trash2, Plus, KeyRound, Check, X } from "lucide-react";

type UserRow = {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: "SUPERADMIN" | "ADMIN" | "CUSTOMER";
  active: boolean;
  createdAt: Date | string;
};

const ROLE_LABEL: Record<string, string> = {
  SUPERADMIN: "Superadmin",
  ADMIN:      "Admin",
  CUSTOMER:   "Kund",
};

const ROLE_ICON: Record<string, React.ReactNode> = {
  SUPERADMIN: <ShieldCheck size={14} className="text-[var(--color-brand-orange)]" />,
  ADMIN:      <Shield size={14} className="text-blue-400" />,
  CUSTOMER:   <User size={14} className="text-[var(--color-text-muted)]" />,
};

export default function UsersClient({
  users: initial,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState<UserRow[]>(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  // Per-row "reset password" state — only one row open at a time.
  const [resetFor, setResetFor] = useState<string | null>(null);
  const [resetPw, setResetPw] = useState("");
  const [resetOk, setResetOk] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "", password: "", name: "", email: "",
    role: "ADMIN" as "SUPERADMIN" | "ADMIN" | "CUSTOMER",
  });

  async function toggleActive(user: UserRow) {
    setLoading(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, active: updated.active } : u)));
    }
    setLoading(null);
  }

  async function deleteUser(user: UserRow) {
    if (!confirm(`Ta bort ${user.name}? Detta går inte att ångra.`)) return;
    setLoading(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } else {
      const data = await res.json();
      setError(data.error ?? "Något gick fel");
    }
    setLoading(null);
  }

  async function resetPassword(user: UserRow) {
    if (resetPw.length < 8) {
      setError("Lösenordet måste vara minst 8 tecken.");
      return;
    }
    setLoading(user.id);
    setError("");
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: resetPw }),
    });
    if (res.ok) {
      setResetOk(`${user.name}: lösenord uppdaterat → ${resetPw}`);
      setResetPw("");
      setResetFor(null);
      // Auto-hide success after 8s
      setTimeout(() => setResetOk(null), 8000);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Kunde inte uppdatera lösenord.");
    }
    setLoading(null);
  }

  function genPassword() {
    // 12-char alphanumeric, no ambiguous chars (0/O/1/l)
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let out = "";
    const rnd = new Uint8Array(12);
    crypto.getRandomValues(rnd);
    for (let i = 0; i < rnd.length; i++) out += alphabet[rnd[i] % alphabet.length];
    setResetPw(out);
  }

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setLoading("add");
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Något gick fel");
    } else {
      setUsers((prev) => [...prev, data]);
      setForm({ username: "", password: "", name: "", email: "", role: "ADMIN" });
      setShowAdd(false);
    }
    setLoading(null);
  }

  return (
    <div className="space-y-6">
      {/* User table */}
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-dark-500)] text-[var(--color-text-muted)] text-xs uppercase tracking-widest">
              <th className="text-left px-5 py-3">Namn</th>
              <th className="text-left px-5 py-3 hidden sm:table-cell">Användarnamn</th>
              <th className="text-left px-5 py-3 hidden md:table-cell">E-post</th>
              <th className="text-left px-5 py-3">Roll</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-b border-[var(--color-dark-600)] last:border-0 ${
                  !user.active ? "opacity-50" : ""
                }`}
              >
                <td className="px-5 py-3.5 font-medium">
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="ml-2 text-[10px] bg-[var(--color-brand-orange)]/15 text-[var(--color-brand-orange)] px-1.5 py-0.5 rounded-full">
                      dig
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)] hidden sm:table-cell">
                  {user.username}
                </td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)] hidden md:table-cell">
                  {user.email ?? "—"}
                </td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1.5">
                    {ROLE_ICON[user.role]}
                    {ROLE_LABEL[user.role]}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.active
                      ? "bg-green-500/15 text-green-400"
                      : "bg-[var(--color-dark-600)] text-[var(--color-text-muted)]"
                  }`}>
                    {user.active ? "Aktiv" : "Pausad"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setResetFor(resetFor === user.id ? null : user.id);
                        setResetPw("");
                        setError("");
                      }}
                      disabled={loading === user.id}
                      title="Återställ lösenord"
                      className="p-1.5 rounded-lg hover:bg-[var(--color-brand-orange)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-brand-orange)] transition-colors disabled:opacity-40"
                    >
                      <KeyRound size={16} />
                    </button>
                    {user.id !== currentUserId && (
                      <>
                        <button
                          onClick={() => toggleActive(user)}
                          disabled={loading === user.id}
                          title={user.active ? "Pausa" : "Aktivera"}
                          className="p-1.5 rounded-lg hover:bg-[var(--color-dark-600)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-40"
                        >
                          {user.active
                            ? <PauseCircle size={16} />
                            : <PlayCircle size={16} className="text-green-400" />
                          }
                        </button>
                        <button
                          onClick={() => deleteUser(user)}
                          disabled={loading === user.id}
                          title="Ta bort"
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {/* Reset-password inline form spans the table when a row is selected */}
            {resetFor && (() => {
              const target = users.find((u) => u.id === resetFor);
              if (!target) return null;
              return (
                <tr className="bg-[var(--color-brand-orange)]/5 border-b border-[var(--color-brand-orange)]/20">
                  <td colSpan={6} className="px-5 py-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <KeyRound size={16} className="text-[var(--color-brand-orange)]" />
                      <span className="text-sm font-bold">
                        Återställ lösenord för <span className="text-[var(--color-brand-orange)]">{target.name}</span> ({target.username})
                      </span>
                      <input
                        type="text"
                        value={resetPw}
                        onChange={(e) => setResetPw(e.target.value)}
                        placeholder="Nytt lösenord (min 8 tecken)"
                        autoFocus
                        className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] text-sm font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)]"
                      />
                      <button
                        type="button"
                        onClick={genPassword}
                        className="px-3 py-2 rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                        title="Generera slumpmässigt lösenord"
                      >
                        🎲 Generera
                      </button>
                      <button
                        type="button"
                        onClick={() => resetPassword(target)}
                        disabled={loading === target.id || resetPw.length < 8}
                        className="px-3 py-2 rounded-lg bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white text-xs font-bold disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        <Check size={14} />
                        {loading === target.id ? "Sparar…" : "Spara"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setResetFor(null); setResetPw(""); setError(""); }}
                        className="p-2 rounded-lg hover:bg-[var(--color-dark-600)] text-[var(--color-text-muted)]"
                        title="Avbryt"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
          {error}
        </div>
      )}
      {resetOk && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm px-4 py-3 font-mono">
          ✓ {resetOk}
          <div className="text-xs text-emerald-400/80 mt-1 font-sans">
            Kopiera och skicka till användaren via säker kanal — meddelandet
            försvinner från skärmen om 8 sekunder.
          </div>
        </div>
      )}

      {/* Add user */}
      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-[var(--color-dark-400)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-colors"
        >
          <Plus size={16} /> Lägg till användare
        </button>
      ) : (
        <form onSubmit={addUser} className="glass rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg">Ny användare</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Namn *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <Field label="Användarnamn *" value={form.username} onChange={(v) => setForm((f) => ({ ...f, username: v }))} />
            <Field label="Lösenord *" type="password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} />
            <Field label="E-post" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
            <div>
              <label className="block text-xs text-[var(--color-text-muted)] mb-1">Roll *</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as typeof form.role }))}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)]"
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Superadmin</option>
                <option value="CUSTOMER">Kund</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowAdd(false); setError(""); }}
              className="btn-secondary px-5 py-2.5 text-sm"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading === "add"}
              className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60"
            >
              {loading === "add" ? "Sparar…" : "Skapa användare"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  label, value, onChange, type = "text",
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-[var(--color-text-muted)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
      />
    </div>
  );
}
