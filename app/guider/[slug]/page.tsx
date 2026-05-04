import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "@/lib/guider";

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return { title: "Guide saknas" };
  return {
    title: g.title,
    description: g.excerpt,
    keywords: g.keywords,
    alternates: { canonical: `/guider/${g.slug}` },
    openGraph: {
      title: g.title,
      description: g.excerpt,
      type: "article",
      publishedTime: g.publishedAt,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  return (
    <main className="bg-white">
      {/* Breadcrumb + meta */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
          <span>›</span>
          <Link href="/guider" className="hover:text-[var(--color-brand-orange)]">Guider</Link>
          <span>›</span>
          <span className="text-slate-700 truncate">{g.title}</span>
        </nav>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 pb-16">
        <header className="mb-8 pb-6 border-b border-slate-200">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-widest mb-4">
            {g.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-3">
            {g.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">{g.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-5">
            <span>{g.readTimeMin} min läsning</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <time>Publicerad {g.publishedAt}</time>
          </div>
        </header>

        <div className="prose-guide">
          {g.slug === "hitta-ratt-oe-nummer" && <OeNumberGuide />}
          {g.slug === "felsokning-luftfjadring-mercedes" && <LuftfjadringGuide />}
          {g.slug === "skrota-bilen-sa-gar-det-till" && <SkrotaBilenGuide />}
        </div>

        {/* Related actions */}
        <aside className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-3">Hjälp med just din bil?</h3>
          <p className="text-sm text-slate-600 mb-4">
            Ring oss eller kika i lagret — vi har 30 000+ delar redo att skickas.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:017121002"
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
            >
              Ring 0171-210 02
            </a>
            <Link
              href="/bildelar"
              className="px-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-sm transition-colors"
            >
              Sök bildelar
            </Link>
          </div>
        </aside>
      </article>

      <style>{`
        .prose-guide h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-top: 2.25rem; margin-bottom: 0.75rem; line-height: 1.2; }
        .prose-guide h3 { font-size: 1.125rem; font-weight: 700; color: #0f172a; margin-top: 1.75rem; margin-bottom: 0.5rem; }
        .prose-guide p { color: #334155; line-height: 1.75; margin-bottom: 1rem; }
        .prose-guide ul { color: #334155; line-height: 1.75; margin-bottom: 1rem; padding-left: 1.5rem; list-style: disc; }
        .prose-guide li { margin-bottom: 0.35rem; }
        .prose-guide ol { color: #334155; line-height: 1.75; margin-bottom: 1rem; padding-left: 1.5rem; list-style: decimal; }
        .prose-guide strong { color: #0f172a; font-weight: 700; }
        .prose-guide .callout {
          background: #fef3c7; border-left: 4px solid #f59e0b;
          padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1.5rem 0;
        }
        .prose-guide .callout strong { color: #78350f; }
      `}</style>
    </main>
  );
}

/* ─── Article bodies ───────────────────────────────────────────── */

function OeNumberGuide() {
  return (
    <>
      <p>
        OE-numret (<em>Original Equipment</em>) är tillverkarens unika kod för
        en specifik del. Anger du rätt OE-nummer slipper du skicka tillbaka fel
        del — och vi kan plocka ihop ditt order direkt från lagret.
      </p>

      <h2>Var hittar du OE-numret?</h2>
      <p>
        Det enklaste stället är på själva delen. Mercedes, BMW, Audi och Volvo
        präglar OE-numret antingen direkt i metallen, på en klisteretikett, eller
        på en gjuten typskylt.
      </p>
      <ul>
        <li>
          <strong>Motorkomponenter:</strong> oftast en präglad text längs sidan av
          komponenten (t.ex. <code>A2780300405</code>).
        </li>
        <li>
          <strong>Elektronikboxar:</strong> klistermärke med streckkod och
          OE-nummer ovanpå.
        </li>
        <li>
          <strong>Karossdelar:</strong> stämplad text på baksidan eller kanten.
        </li>
        <li>
          <strong>Slang/luftfjäder:</strong> tryckt på själva ytan, inte alltid
          läsbart efter några år — använd då bilens chassinummer.
        </li>
      </ul>

      <h2>Mercedes-format</h2>
      <p>
        Mercedes använder en tio-siffrig kod som börjar med <strong>A</strong>{" "}
        (för Daimler/Mercedes). Exempel: <code>A2123203138</code> — det är en
        framaxellyft till W212.
      </p>

      <div className="callout">
        <strong>Tips:</strong> har du bara registreringsnumret? Skriv in det på
        startsidan — vår koppling till Bilprovningen plockar upp märke, modell
        och årsmodell automatiskt och filtrerar lagret åt dig.
      </div>

      <h2>Dubbelkolla att numret stämmer</h2>
      <ol>
        <li>Notera OE-numret från delen.</li>
        <li>
          Sök på <Link href="/bildelar">bildelar</Link> — fungerar med och utan
          mellanslag.
        </li>
        <li>
          Jämför att karossbeteckning (W210/W211/W212/W213) matchar din bil.
        </li>
        <li>Vid tveksamhet: ring oss med chassinumret så kollar vi i CarVin.</li>
      </ol>

      <h2>Fortfarande osäker?</h2>
      <p>
        Skicka en bild på delen via WhatsApp så identifierar vi den åt dig. Vi
        har 40 års erfarenhet av just Mercedes — vi känner igen det mesta på
        2 sekunder.
      </p>
    </>
  );
}

function LuftfjadringGuide() {
  return (
    <>
      <p>
        Mercedes <strong>Airmatic</strong> är en avancerad luftfjädring som
        finns på de flesta E- och S-klassmodeller från 2002 och framåt. När den
        fungerar är komforten fenomenal — när den slutar fungera står bilen på
        fälgarna nästa morgon.
      </p>

      <h2>De fyra vanligaste felen</h2>

      <h3>1. Luftfjäder läcker</h3>
      <p>
        Gummibälgen torkar med åren och spricker — typiskt vid 150 000–200 000 km.
        Diagnos: bilen sjunker på en sida över natten. Åtgärd: byt fjäderbälg
        (begagnad original kostar 2–3 000 kr per hörn vs nya 9 000 kr).
      </p>

      <h3>2. Kompressor sliten</h3>
      <p>
        Kompressorn jobbar för att kompensera för läckande fjädrar — och tar
        slut själv. Ljudet blir högre och längre, varningslampan tänds. Original
        WABCO-kompressor begagnad: 3–4 000 kr.
      </p>

      <h3>3. Höjdsensor felkalibrerad</h3>
      <p>
        Vid byten eller efter en lättare smäll förlorar systemet sin nollnivå.
        Bilen kan lutas eller stå snett. Detta är inte en del — det är en
        kalibrering. Vi gör det på 30 minuter med STAR-diagnos.
      </p>

      <h3>4. Ventilblock läcker internt</h3>
      <p>
        Mindre vanligt men händer. Bilen sjunker likformigt på alla fyra hörn
        över natten. Ventilblocket (Mercedes-del{" "}
        <code>A2113200158</code> för W211) byts som en enhet.
      </p>

      <div className="callout">
        <strong>Snabbtest:</strong> mät avstånd från hjulhus till mark vid kvällen
        och igen på morgonen. Diff &gt; 3 cm = systemet förlorar luft. Diff på
        bara ett hörn = en specifik fjäder. Diff på hela bilen = kompressor
        eller ventilblock.
      </div>

      <h2>Vad kostar det att laga?</h2>
      <ul>
        <li><strong>Fjäderbyte (per hörn):</strong> 4–5 000 kr inkl. arbete</li>
        <li><strong>Kompressorbyte:</strong> 6–8 000 kr inkl. arbete</li>
        <li><strong>Höjdsensor + kalibrering:</strong> 1 500–2 500 kr</li>
        <li><strong>Helt system (alla fyra fjädrar + kompressor):</strong> 18–22 000 kr</li>
      </ul>
      <p>
        För jämförelse: Mercedes-verkstad tar 35 000–55 000 kr för samma jobb
        med nya delar.
      </p>

      <h2>När ska man konvertera till spiralfjädring?</h2>
      <p>
        Ärligt talat: nästan aldrig. Konverteringssatserna förstör Mercedes-kärnan
        i bilen och åker-kvaliteten faller stenhårt. Använd hellre begagnade
        originaldelar — vår luftfjäderhylla är full av testade delar med
        6 månaders garanti.
      </p>

      <p>
        <Link href="/mercedes/luftfjadring">Se vårt Mercedes luftfjäder-lager →</Link>
      </p>
    </>
  );
}

function SkrotaBilenGuide() {
  return (
    <>
      <p>
        Att skrota en bil i Sverige är gratis — men ska göras hos en{" "}
        <strong>auktoriserad bildemontering</strong> så att Transportstyrelsen
        kan avregistrera bilen. Hos oss tar det fem steg, oftast under en
        arbetsdag.
      </p>

      <h2>Steg 1 — Förbered bilen</h2>
      <ul>
        <li>Plocka ur personliga saker (handskfack, bagagelucka, dörrfickor).</li>
        <li>Behåll registreringsbevis del 2 (gula).</li>
        <li>
          Du behöver inte boka av försäkring själv — det sker automatiskt vid
          avregistrering.
        </li>
      </ul>

      <h2>Steg 2 — Boka hämtning eller kör in</h2>
      <p>
        Vi hämtar gratis i hela Mälardalen — Enköping, Uppsala, Västerås,
        Stockholm, Eskilstuna. Eller kör in på Magasingatan 2 i Enköping. Boka
        på <Link href="/skrota-bilen">/skrota-bilen</Link> eller ring
        0171-210 02.
      </p>

      <h2>Steg 3 — Skrotpremie</h2>
      <p>
        Premien beror på bilens skick, vikt och vad vi kan plocka för
        reservdelar. Tumregel:
      </p>
      <ul>
        <li><strong>Körbar bil med körkortsmöjlig kaross:</strong> 2 500–4 000 kr</li>
        <li><strong>Defekt men komplett:</strong> 1 500–2 500 kr</li>
        <li><strong>Kraschad eller utan motor:</strong> 800–1 500 kr</li>
      </ul>

      <div className="callout">
        <strong>Viktigt:</strong> bilen måste vara komplett. Saknade delar
        (motor, kaross, däck) drar ned premien rejält. Försök att inte plocka
        delar själv innan skrotning — du tjänar mer på att lämna in den hel.
      </div>

      <h2>Steg 4 — Mottagningsbevis &amp; avregistrering</h2>
      <p>
        Vi skriver ett mottagningsbevis och rapporterar till Transportstyrelsen
        samma dag. Du får en bekräftelse via mejl eller post inom några
        arbetsdagar. Försäkring och fordonsskatt slutar gälla från
        avregistreringsdatumet.
      </p>

      <h2>Steg 5 — Pengarna in på Swish</h2>
      <p>
        Skrotpremien betalas direkt via Swish så fort vi inspekterat bilen —
        oftast samma dag som hämtning. Vill du ha kontant går det också bra om
        du kör in.
      </p>

      <h2>Vanliga frågor</h2>
      <h3>Måste jag ha registreringsbevis del 2?</h3>
      <p>
        Ja — utan den kan vi inte avregistrera bilen. Saknas den beställer du
        en ny på Transportstyrelsen.se (kostar några tior, levereras på 1–2
        dagar).
      </p>

      <h3>Kan jag skrota en bil som är obesiktigad?</h3>
      <p>
        Absolut. Inget besiktningskrav för skrotning.
      </p>

      <h3>Vad händer med bilen sen?</h3>
      <p>
        Vi plockar bra delar till lagret (det här är vår viktigaste verksamhet),
        avtappar oljor och vätskor enligt naturvårdsverkets föreskrifter, och
        skickar resten till metallåtervinning. 92 % av varje bil återanvänds
        eller återvinns.
      </p>

      <p>
        <Link href="/skrota-bilen">Boka hämtning av din bil →</Link>
      </p>
    </>
  );
}
