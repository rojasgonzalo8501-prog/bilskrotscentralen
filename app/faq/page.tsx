import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Vanliga frågor (FAQ) — Bilskrotscentralen i Sverige AB",
  description:
    "Svar på de vanligaste frågorna om begagnade bildelar, garanti, retur, leverans, betalning och bilskrotning hos Bilskrotscentralen i Sverige AB.",
  alternates: { canonical: "/faq" },
};

const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Beställning & betalning",
    items: [
      {
        q: "Hur beställer jag en del?",
        a: "Sök efter delen i sökrutan eller bläddra per märke/kategori. När du hittat rätt del klickar du på Lägg i varukorg och slutför köpet i kassan. Du kan betala med Klarna, Swish, Visa/Mastercard eller via bankgiro (5497-3441).",
      },
      {
        q: "Vilka betalningssätt accepterar ni?",
        a: "Vi erbjuder Klarna (faktura, delbetalning, direktbetalning), Swish (123 512 67 68), Visa/Mastercard via kortbetalning, samt bankgiro 5497-3441 för direktbetalning.",
      },
      {
        q: "Är priserna inklusive moms?",
        a: "Ja, alla priser på sajten är inklusive moms. Observera att vi tillämpar vinstmarginalbeskattning (VMB) på begagnade delar — det innebär att momsen beräknas på vår vinstmarginal snarare än hela försäljningspriset. Moms specificeras på fakturan enligt gällande regler.",
      },
      {
        q: "Vad innebär vinstmarginalbeskattning?",
        a: "Vinstmarginalbeskattning (VMB) är ett särskilt momsregelverk för begagnade varor. Det betyder att moms betalas enbart på vår vinstmarginal, inte på hela priset. Som privatperson märker du ingen skillnad — priset är detsamma. För företag som vill dra av ingående moms rekommenderar vi att kontakta oss, eftersom separat momsspecifikation inte kan utfärdas för VMB-varor.",
      },
      {
        q: "Kan jag handla som företag och få faktura?",
        a: "Ja. Vi ställer gärna ut faktura för B2B-kunder. Välj faktura i kassan eller kontakta oss på 0171-210 02 så ordnar vi det manuellt. Betalningsvillkor är 10 dagar netto som standard.",
      },
    ],
  },
  {
    title: "Leverans & frakt",
    items: [
      {
        q: "Hur lång är leveranstiden?",
        a: "Normalt 1–3 arbetsdagar inom Sverige. Vi packar och skickar samma dag om beställningen läggs och betalas före kl 12:00 på vardagar.",
      },
      {
        q: "Vad kostar frakten?",
        a: "Frakten är 99 kr för beställningar under 500 kr. Fritt frakt vid beställningar över 500 kr. Stora och tunga delar (motorer, växellådor, bakaxlar) skickas med DHL Företag till fast pris — kontakta oss för offert.",
      },
      {
        q: "Kan jag hämta delen själv?",
        a: "Absolut! Vi finns på Magasingatan 2, 749 35 Enköping. Ring oss på 0171-210 02 innan du kommer så ser vi till att delen är redo. Upphämtning är alltid gratis.",
      },
      {
        q: "Vad händer om jag inte hämtar ut ett paket?",
        a: "Outlösta paket returneras till oss. Vi debiterar en returavgift på 20 % av ordervärdet (minst 100 kr) för att täcka frakt- och hanteringskostnader i båda riktningar.",
      },
      {
        q: "Vad gör jag om paketet är skadat vid leveransen?",
        a: "Kontrollera alltid förpackningen innan du signerar mottagandet. Anmärk eventuell skada direkt till chauffören eller fraktfirman. Vid dold transportskada ska du reklamera direkt och senast inom 7 dagar — ring oss på 0171-210 02 så hjälper vi dig med processen.",
      },
    ],
  },
  {
    title: "Garanti",
    items: [
      {
        q: "Hur lång garanti gäller på begagnade delar?",
        a: "Motor, växellåda och bakaxel: 30 dagars funktionsgaranti från leveransdatum. Övriga begagnade delar: 8 dagars funktionsgaranti från leveransdatum. Nya bil-batterier: 2 års garanti. Ny kompressor/luftbälg: 1 år.",
      },
      {
        q: "Vad täcker garantin?",
        a: "Garantin täcker funktionsfel på komponenten och dolda fel som uppstår under garantiperioden. I första hand erbjuder vi utbyte mot likvärdig del. Om ingen likvärdig del finns sker återbetalning.",
      },
      {
        q: "Vad täcker garantin INTE?",
        a: "Garantin gäller inte vid: felaktig montering, olyckshändelse, vanvård eller onormal användning (t.ex. tävlingsverksamhet, trimning), normalt slitage (remmar, spännrullar, bromsbelägg m.m.), eller demonterings- och monteringskostnader. Begagnade elektronikkomponenter, förgasare och insprutningsdelar omfattas inte av garanti och återtas inte.",
      },
      {
        q: "Krävs ett garantibevis?",
        a: "Kvitto eller faktura gäller som garantibevis och ska sparas under hela garantitiden. För nya bil-batterier och luftbälgskompressorer gäller särskilt garantibevis uteslutande för dessa produkter.",
      },
    ],
  },
  {
    title: "Retur & reklamation",
    items: [
      {
        q: "Kan jag ångra ett köp?",
        a: "Ja, du har 14 dagars ångerrätt enligt distansavtalslagen (2005:59). Kontakta oss via telefon 0171-210 02 inom 14 dagar från att du mottagit varan. Observera: vi hanterar returer via telefon, inte via e-post.",
      },
      {
        q: "Kostar det något att returnera?",
        a: "Returfrakt betalas av dig som kund. Vi accepterar inte paket skickade mot postförskott (postuppkrav/efterkrav). Retur ska ske inom 14 dagar från att vi godkänt ärendet.",
      },
      {
        q: "Finns det varor som inte går att returnera?",
        a: "Ja. Elektronikkomponenter (begagnade och nya), förgasare, insprutningsdelar och hembeställda specialvaror återtas inte och kan inte returneras. Delar där ingrepp gjorts utan vårt medgivande återtas inte heller.",
      },
      {
        q: "Hur reklamerar jag en felaktig del?",
        a: "Ring oss på 0171-210 02 med ditt ordernummer och beskriv felet — skicka gärna bild eller video via SMS/WhatsApp. Vi bedömer ärendet och om garantin gäller skickar vi returinstruktion. Bifoga alltid kvitto. Återbetalning sker inom 30 dagar om ingen likvärdig del finns.",
      },
      {
        q: "Inom vilken tid måste jag reklamera?",
        a: "En felaktig vara ska reklameras inom 14 dagar från leveransdatum. Enligt konsumentköplagen anses en reklamation alltid vara gjord i rimlig tid om den sker inom en månad från att felet märktes.",
      },
    ],
  },
  {
    title: "Skrotning av bil",
    items: [
      {
        q: "Är bilskrotningen verkligen gratis?",
        a: "Ja, vi hämtar bilen kostnadsfritt i hela Mälardalen och sköter avregistreringen hos Transportstyrelsen. Du behöver bara ha fordonets registreringshandlingar redo.",
      },
      {
        q: "Vad får jag betalt för min bil?",
        a: "Det beror på märke, modell, årsmodell och skick. Mercedes, Volvo och BMW betingar oftast bäst pris. Ring Adam på 0171-210 02 så får du en konkret offert inom 24 h — helt utan förbindelser.",
      },
      {
        q: "Vad händer om bilen är obesiktad, avställd eller saknar motor?",
        a: "Spelar ingen roll — vi hämtar och skrotar oavsett besiktningsstatus, avställning eller om bilen är komplett eller ej.",
      },
      {
        q: "Hur snabbt kan ni hämta bilen?",
        a: "Normalt inom 1–3 arbetsdagar efter överenskommelse. Bråttom? Ring oss direkt på 0171-210 02 så ordnar vi snabbhämtning.",
      },
    ],
  },
  {
    title: "Eftersökning & speciella delar",
    items: [
      {
        q: "Jag hittar inte delen jag söker — vad gör jag?",
        a: "Använd formuläret på sidan Eftersökning eller ring 0171-210 02. Vi har tillgång till ett stort nätverk av bildemonteringar i Sverige och kan ofta hitta ovanliga delar inom några dagar.",
      },
      {
        q: "Säljer ni delar till alla bilmärken?",
        a: "Vi specialiserar oss på Mercedes-Benz, Volvo, BMW och Volkswagen-koncernen, men har delar till de flesta europeiska märken. Kontakta oss för specifika förfrågningar.",
      },
    ],
  },
  {
    title: "Kundservice & kontakt",
    items: [
      {
        q: "Hur når jag er bäst?",
        a: "Telefon är alltid snabbast: 0171-210 02 (måndag–torsdag 08:00–17:00, fredag 08:00–15:00). Du kan också maila info@bilskrotscentralen.se eller besöka oss på Magasingatan 2 i Enköping.",
      },
      {
        q: "Vad gör jag om jag är missnöjd och vi inte kan komma överens?",
        a: "Du kan vända dig till Allmänna reklamationsnämnden (ARN) på arn.se. ARN erbjuder kostnadsfri prövning av konsumenttvister. Vi förbinder oss att delta i ARN:s prövning. Du kan också använda EU:s plattform för tvistlösning online: ec.europa.eu/odr.",
      },
    ],
  },
];

export default function FAQPage() {
  const allFaqs = FAQ_GROUPS.flatMap((g) => g.items.map((i) => ({ question: i.q, answer: i.a })));
  return (
    <>
      <FaqJsonLd items={allFaqs} />
      <section className="relative overflow-hidden pt-10 pb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/diagnos.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Vanliga frågor</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Vanliga <span className="gradient-text">frågor</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-xl">
            Hittar du inte svaret du söker? Ring Adam direkt på{" "}
            <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold hover:underline">
              0171-210 02
            </a>
            .
          </p>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap gap-2">
            {FAQ_GROUPS.map((g) => (
              <a
                key={g.title}
                href={`#${slugify(g.title)}`}
                className="text-xs px-3 py-1.5 rounded-full bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-brand-orange)] hover:border-[var(--color-brand-orange)]/40 transition-colors"
              >
                {g.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-20">
        {FAQ_GROUPS.map((group) => (
          <div key={group.title} id={slugify(group.title)} className="mb-12 scroll-mt-24">
            <h2 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="w-1 h-5 rounded-full bg-[var(--color-brand-orange)] shrink-0" />
              {group.title}
            </h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <details
                  key={item.q}
                  className="p-5 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] group open:border-[var(--color-brand-orange)]/30"
                >
                  <summary className="font-semibold cursor-pointer list-none flex justify-between items-center gap-4">
                    <span>{item.q}</span>
                    <span className="text-[var(--color-brand-orange)] group-open:rotate-45 transition-transform text-xl shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-4 p-6 rounded-xl bg-[var(--color-brand-orange)]/5 border border-[var(--color-brand-orange)]/20 text-center">
          <h3 className="font-bold mb-1">Hittade du inte svaret?</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Vi löser de flesta frågor direkt per telefon.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:017121002" className="btn-primary">📞 0171-210 02</a>
            <a href="mailto:info@bilskrotscentralen.se" className="btn-secondary">✉ info@bilskrotscentralen.se</a>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-3">
            Mån–Tors 08:00–17:00 &nbsp;·&nbsp; Fredagar 08:00–15:00
          </p>
        </div>
      </section>
    </>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
