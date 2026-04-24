"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ChevronDown } from "lucide-react";

type Product = {
  sku: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  priceCurrency: string;
  image: string;
  url: string;
  condition: string;
  mpn: string;
  inStock: boolean;
};

type AccordionState = "description" | "specs" | "shipping" | null;

export default function ProductDetail({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [openAccordion, setOpenAccordion] = useState<AccordionState>("description");
  const [isFavorite, setIsFavorite] = useState(false);

  const deposit = Math.round(product.price * 0.14);
  const shipping = 3600;
  const total = product.price + deposit + shipping;

  const toggleAccordion = (section: AccordionState) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <nav className="max-w-7xl mx-auto px-4 text-xs text-[var(--color-text-muted)] mb-8 flex items-center gap-2 pt-8">
        <Link href="/" className="hover:text-[var(--color-brand-orange)] transition-colors">
          Hem
        </Link>
        <span>›</span>
        <Link href="/nya-bildelar" className="hover:text-[var(--color-brand-orange)] transition-colors">
          Nya bildelar
        </Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">{product.brand}</span>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">{product.name.slice(0, 50)}</span>
      </nav>

      {/* ─── Main Content ─── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {/* ─── Left: Image ─── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="rounded-xl overflow-hidden bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] aspect-square flex items-center justify-center mb-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[var(--color-text-muted)] p-8">
                    <span className="text-6xl">🔧</span>
                    <span className="text-sm text-center">{product.category}</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-[var(--color-text-muted)] text-center">
                Från {product.brand} • {product.condition === "New" ? "Fabriksny" : "Renoverad"}
              </div>
            </div>
          </div>

          {/* ─── Middle: Description & Accordions ─── */}
          <div className="lg:col-span-1">
            <h1 className="text-2xl sm:text-3xl font-black mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <a href={`/nya-bildelar?brand=${product.brand}`} className="text-sm text-[var(--color-brand-orange)] hover:underline">
                {product.brand}
              </a>
              <span className="text-[var(--color-text-muted)]">•</span>
              <span className="text-sm text-[var(--color-text-secondary)]">{product.category}</span>
            </div>

            {/* ─── Stock Status ─── */}
            <div className="mb-6">
              <span
                className={`text-sm px-3 py-1 rounded-full font-semibold ${
                  product.inStock
                    ? "bg-[var(--color-success)]/10 text-[var(--color-success-bright)]"
                    : "bg-[var(--color-error)]/10 text-[var(--color-error)]"
                }`}
              >
                {product.inStock ? "✓ I lager — Leveranstid 1-3 arbetsdagar" : "✗ Slutsåld"}
              </span>
            </div>

            {/* ─── Quick Specs ─── */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-lg bg-[var(--color-dark-800)] border border-[var(--color-dark-500)]">
              <div>
                <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">OE-nummer</div>
                <div className="font-mono text-sm font-semibold">{product.mpn}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Artikelnr</div>
                <div className="font-mono text-sm font-semibold">{product.sku}</div>
              </div>
            </div>

            {/* ─── Accordions ─── */}
            <div className="space-y-2">
              {/* Description Accordion */}
              <button
                onClick={() => toggleAccordion("description")}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
              >
                <span className="font-semibold">Produktbeskrivning</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${openAccordion === "description" ? "rotate-180" : ""}`}
                />
              </button>
              {openAccordion === "description" && (
                <div className="p-4 bg-[var(--color-dark-800)] rounded-lg border border-[var(--color-dark-500)] mb-2">
                  <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              {/* Specs Accordion */}
              <button
                onClick={() => toggleAccordion("specs")}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
              >
                <span className="font-semibold">Specifikationer</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${openAccordion === "specs" ? "rotate-180" : ""}`}
                />
              </button>
              {openAccordion === "specs" && (
                <div className="p-4 bg-[var(--color-dark-800)] rounded-lg border border-[var(--color-dark-500)] mb-2 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Märke</div>
                      <div className="font-semibold">{product.brand}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Kategori</div>
                      <div className="font-semibold">{product.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Skick</div>
                      <div className="font-semibold">{product.condition === "New" ? "Fabriksny" : "Renoverad"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Valuta</div>
                      <div className="font-semibold">{product.priceCurrency}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Accordion */}
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
              >
                <span className="font-semibold">Frakt & Retur</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${openAccordion === "shipping" ? "rotate-180" : ""}`}
                />
              </button>
              {openAccordion === "shipping" && (
                <div className="p-4 bg-[var(--color-dark-800)] rounded-lg border border-[var(--color-dark-500)] space-y-3 text-sm">
                  <div>
                    <div className="font-semibold text-[var(--color-brand-orange)] mb-1">Leveranstid</div>
                    <p className="text-[var(--color-text-secondary)]">1-3 arbetsdagar</p>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-brand-orange)] mb-1">Fraktkostnad</div>
                    <p className="text-[var(--color-text-secondary)]">Visas i varukorgen. Fri frakt över 500 kr.</p>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-brand-orange)] mb-1">Returrätt</div>
                    <p className="text-[var(--color-text-secondary)]">14 dagars ångrerrätt. Returnera produkten i originalskick för full återbetalning.</p>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-brand-orange)] mb-1">Garanti</div>
                    <p className="text-[var(--color-text-secondary)]">Garanti på fabriksnytt material. Funktionsgaranti på renoverat.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Right: Pricing & CTA ─── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {/* ─── Pricing Card ─── */}
              <div className="glass rounded-xl p-6 mb-6">
                <div className="mb-6">
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                    Pris (exkl. pant & frakt)
                  </div>
                  <div className="text-4xl font-black text-[var(--color-brand-orange)]">
                    {product.price.toLocaleString("sv-SE")} kr
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-2">
                    inkl. 25% moms
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-[var(--color-dark-500)]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Pantsumma</span>
                    <span className="font-semibold">+ {deposit.toLocaleString("sv-SE")} kr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Ungefärlig frakt</span>
                    <span className="font-semibold">+ {shipping.toLocaleString("sv-SE")} kr</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Totalt (ungefär)</span>
                    <span className="text-2xl font-black text-[var(--color-brand-orange)]">
                      {total.toLocaleString("sv-SE")} kr
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2">
                    Exakt fraktkostnad visas i varukorgen
                  </p>
                </div>
              </div>

              {/* ─── CTA Buttons ─── */}
              <div className="flex flex-col gap-3 mb-6">
                <button
                  className="btn-primary w-full text-lg py-4 rounded-xl font-semibold"
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Lägg i varukorg" : "Slutsåld"}
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center justify-center gap-2 w-full btn-secondary text-lg py-4 rounded-xl font-semibold"
                >
                  <Heart
                    size={20}
                    className={isFavorite ? "fill-current" : ""}
                  />
                  {isFavorite ? "Sparad" : "Spara"}
                </button>
              </div>

              {/* ─── Trust Badges ─── */}
              <div className="space-y-3 p-4 rounded-xl bg-[var(--color-dark-800)] border border-[var(--color-dark-500)]">
                <div className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <div className="text-sm">
                    <div className="font-semibold mb-0.5">Säker handel</div>
                    <p className="text-[var(--color-text-muted)] text-xs">
                      Krypterad betalning
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🚚</span>
                  <div className="text-sm">
                    <div className="font-semibold mb-0.5">Snabb frakt</div>
                    <p className="text-[var(--color-text-muted)] text-xs">
                      1-3 arbetsdagar
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">💳</span>
                  <div className="text-sm">
                    <div className="font-semibold mb-0.5">Flera betalmetoder</div>
                    <p className="text-[var(--color-text-muted)] text-xs">
                      Klarna, Swish, kort
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Related Products ─── */}
        {relatedProducts.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-6">Liknande produkter från {product.brand}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <a
                  key={related.sku}
                  href={`/nya-bildelar/${related.sku}`}
                  className="card-hover rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden group"
                >
                  <div className="h-40 overflow-hidden relative bg-[var(--color-dark-800)] flex items-center justify-center">
                    {related.image ? (
                      <img
                        src={related.image}
                        alt={related.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[var(--color-text-muted)]">
                        <span className="text-3xl">🔧</span>
                        <span className="text-xs">{related.category}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">
                      {related.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-[var(--color-brand-orange)]">
                        {related.price.toLocaleString("sv-SE")} kr
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">→</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </section>
    </>
  );
}
