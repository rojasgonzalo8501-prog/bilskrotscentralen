import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Profil — Mitt konto" };
export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
}

type AddressKey = string;
type SavedAddress = {
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string | null;
  usedCount: number;
  lastUsed: Date;
};

export default async function ProfilPage() {
  const session = await getSession();
  if (!session) redirect("/logga-in?portal=customer");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      username: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // Build a saved-address book from past orders, deduping on
  // (address + postalCode + city) and counting usage.
  const orders = user?.email
    ? await db.order.findMany({
        where: { email: user.email },
        select: {
          firstName: true,
          lastName: true,
          address: true,
          postalCode: true,
          city: true,
          phone: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const addressMap = new Map<AddressKey, SavedAddress>();
  for (const o of orders) {
    const key = `${o.address.toLowerCase()}|${o.postalCode}|${o.city.toLowerCase()}`;
    const existing = addressMap.get(key);
    if (existing) {
      existing.usedCount += 1;
      // keep most-recent firstName/lastName/phone (first iteration wins since orders are desc)
    } else {
      addressMap.set(key, {
        firstName: o.firstName,
        lastName: o.lastName,
        address: o.address,
        postalCode: o.postalCode,
        city: o.city,
        phone: o.phone,
        usedCount: 1,
        lastUsed: o.createdAt,
      });
    }
  }
  const addresses = Array.from(addressMap.values()).sort((a, b) => b.usedCount - a.usedCount);

  const orderCount = orders.length;

  return (
    <section className="max-w-4xl mx-auto px-4 pt-10 pb-20">
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/konto" className="hover:text-[var(--color-brand-orange)] transition-colors">Mitt konto</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Profil</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
          <span className="gradient-text">Min profil</span>
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Översikt över ditt konto och sparade leveransuppgifter.
        </p>
      </div>

      {/* Account info */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Kontouppgifter</h2>
        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <dt className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">Namn</dt>
            <dd className="font-medium">{user?.name ?? session.name}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">Användarnamn</dt>
            <dd className="font-medium">{user?.username ?? session.username}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">E-post</dt>
            <dd className="font-medium">
              {user?.email ?? <span className="text-[var(--color-text-muted)] italic">ej angiven</span>}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">Medlem sedan</dt>
            <dd className="font-medium">{user ? fmtDate(user.createdAt) : "—"}</dd>
          </div>
        </dl>
        <div className="mt-6 pt-4 border-t border-[var(--color-dark-500)] text-xs text-[var(--color-text-muted)]">
          Behöver du ändra något? Maila <a href="mailto:info@bilskrotscentralen.com" className="text-[var(--color-brand-orange)] hover:underline">info@bilskrotscentralen.com</a> så hjälper vi dig.
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Link
          href="/konto/ordrar"
          className="glass rounded-xl p-5 hover:border-[var(--color-brand-orange)]/50 transition-all border border-transparent"
        >
          <div className="text-3xl font-black gradient-text">{orderCount}</div>
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Ordrar totalt</div>
        </Link>
        <div className="glass rounded-xl p-5">
          <div className="text-3xl font-black gradient-text">{addresses.length}</div>
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Sparade adresser</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-3xl font-black gradient-text capitalize">{user?.role.toLowerCase() ?? "kund"}</div>
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Kontotyp</div>
        </div>
      </div>

      {/* Saved addresses */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
          Sparade leveransadresser
        </h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Du har inga sparade adresser än. När du gör din första beställning sparas adressen automatiskt här.
          </p>
        ) : (
          <ul className="space-y-3">
            {addresses.map((a, i) => (
              <li
                key={i}
                className="rounded-lg border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]/40 p-4 flex justify-between items-start gap-4"
              >
                <div className="text-sm flex-1 min-w-0">
                  <div className="font-medium">{a.firstName} {a.lastName}</div>
                  <div className="text-[var(--color-text-secondary)]">{a.address}</div>
                  <div className="text-[var(--color-text-secondary)]">{a.postalCode} {a.city}</div>
                  {a.phone && <div className="text-[var(--color-text-muted)] text-xs mt-1">📞 {a.phone}</div>}
                </div>
                <div className="text-right text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                  <div className="font-semibold text-[var(--color-text-secondary)]">
                    Använd {a.usedCount}×
                  </div>
                  <div className="mt-1">Senast {fmtDate(a.lastUsed)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ─── GDPR — exportera mina uppgifter ─── */}
      <div className="glass rounded-xl p-6 mt-6">
        <h2 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Mina uppgifter (GDPR)
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          Du har rätt att få ut all information vi har om dig — kontodata,
          ordrar, förfrågningar — i ett maskinläsbart format (JSON).
        </p>
        <a
          href="/api/konto/export"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] text-sm font-bold transition-colors"
        >
          ⬇ Ladda ner mina uppgifter
        </a>
        <p className="text-xs text-[var(--color-text-muted)] mt-3">
          Vill du att vi raderar ditt konto? Mejla{" "}
          <a href="mailto:info@bilskrotscentralen.com" className="text-[var(--color-brand-orange)] hover:underline">
            info@bilskrotscentralen.com
          </a>
          {" "}— observera att orderhistorik bevaras enligt Bokföringslagen
          (7 år) men kan anonymiseras på begäran.
        </p>
      </div>
    </section>
  );
}
