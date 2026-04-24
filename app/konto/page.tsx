import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "../logga-in/actions";

export const metadata: Metadata = {
  title: "Mitt konto",
};

export const dynamic = "force-dynamic";

export default async function KontoPage() {
  const session = await getSession();
  if (!session) redirect("/logga-in?portal=customer");

  return (
    <section className="max-w-5xl mx-auto px-4 pt-10 pb-20">
      <div className="flex items-start justify-between gap-6 mb-10 flex-wrap">
        <div>
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
            Kundportal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            Välkommen, <span className="gradient-text">{session.name}</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Här kan du se dina ordrar, spåra leveranser och hantera dina eftersökningar.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border border-[var(--color-dark-500)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-all"
          >
            Logga ut
          </button>
        </form>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PortalCard
          icon="📦"
          title="Mina ordrar"
          desc="Se pågående och tidigare beställningar, spåra leveranser och ladda ner kvitton."
          cta="Visa ordrar"
        />
        <PortalCard
          icon="🔍"
          title="Mina eftersökningar"
          desc="Delar du söker men som inte finns i lager. Vi hör av oss när något dyker upp."
          cta="Hantera"
        />
        <PortalCard
          icon="❤️"
          title="Sparade delar"
          desc="Favoriter och bevakade artiklar. Få notis när priset ändras eller lagret tar slut."
          cta="Visa"
        />
        <PortalCard
          icon="📍"
          title="Leveransadress"
          desc="Uppdatera adress, telefonnummer och betalningsuppgifter."
          cta="Redigera"
        />
        <PortalCard
          icon="🛡️"
          title="Garantiärenden"
          desc="Öppna garantiärende — vi byter eller återbetalar enligt våra villkor."
          cta="Starta ärende"
        />
        <PortalCard
          icon="💬"
          title="Kontakta oss"
          desc="Chatta med Adam eller någon i teamet. Svar inom en arbetsdag."
          cta="Skicka meddelande"
        />
      </div>
    </section>
  );
}

function PortalCard({
  icon,
  title,
  desc,
  cta,
}: {
  icon: string;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <div className="card-hover p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">{desc}</p>
      <button
        type="button"
        className="text-sm font-semibold text-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange-light)] transition-colors"
      >
        {cta} →
      </button>
    </div>
  );
}
