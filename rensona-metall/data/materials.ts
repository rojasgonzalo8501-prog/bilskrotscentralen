import type { Material } from "@/lib/types";

export const MATERIALS_SEED: Material[] = [
  // Koppar
  { id: "1",  slug: "koppar-blank",     name: "Koppar — Blank/Röd",        category: "Koppar",     description: "Ren koppar utan ytbeläggning. Högsta pris.",        price_per_kg: 78,   co2_savings_per_kg: 3.5, unit: "kg", sort_order: 10, active: true, created_at: "", updated_at: "" },
  { id: "2",  slug: "koppar-rodbruten", name: "Koppar — Rödbruten",         category: "Koppar",     description: "Koppar med viss oxidation.",                        price_per_kg: 64,   co2_savings_per_kg: 3.5, unit: "kg", sort_order: 11, active: true, created_at: "", updated_at: "" },
  { id: "3",  slug: "koppar-hushall",   name: "Koppar — Hushållsskrot",     category: "Koppar",     description: "Blandat koppar från hushåll.",                      price_per_kg: 52,   co2_savings_per_kg: 3.5, unit: "kg", sort_order: 12, active: true, created_at: "", updated_at: "" },
  { id: "4",  slug: "kabel-ren",        name: "Kopparkabel — Ren",          category: "Koppar",     description: "Avskalad kopparkabel.",                             price_per_kg: 55,   co2_savings_per_kg: 3.5, unit: "kg", sort_order: 13, active: true, created_at: "", updated_at: "" },
  { id: "5",  slug: "kabel-blandad",    name: "Kopparkabel — Blandad",      category: "Koppar",     description: "Kabel med isolering.",                              price_per_kg: 32,   co2_savings_per_kg: 2.8, unit: "kg", sort_order: 14, active: true, created_at: "", updated_at: "" },
  // Mässing
  { id: "6",  slug: "massing-gul",      name: "Mässing — Gul",              category: "Mässing",    description: "Standard gul mässing.",                             price_per_kg: 48,   co2_savings_per_kg: 3.0, unit: "kg", sort_order: 20, active: true, created_at: "", updated_at: "" },
  { id: "7",  slug: "massing-rod",      name: "Mässing — Röd",              category: "Mässing",    description: "Röd mässing med högre kopparhalt.",                 price_per_kg: 55,   co2_savings_per_kg: 3.2, unit: "kg", sort_order: 21, active: true, created_at: "", updated_at: "" },
  { id: "8",  slug: "massing-span",     name: "Mässing — Spån",             category: "Mässing",    description: "Maskinspån.",                                       price_per_kg: 38,   co2_savings_per_kg: 3.0, unit: "kg", sort_order: 22, active: true, created_at: "", updated_at: "" },
  // Aluminium
  { id: "9",  slug: "alu-profil",       name: "Aluminium — Profil",         category: "Aluminium",  description: "Byggprofiler, fönsterkarmar.",                      price_per_kg: 16,   co2_savings_per_kg: 9.0, unit: "kg", sort_order: 30, active: true, created_at: "", updated_at: "" },
  { id: "10", slug: "alu-gjuten",       name: "Aluminium — Gjuten",         category: "Aluminium",  description: "Motorblock och gjutgods.",                          price_per_kg: 12,   co2_savings_per_kg: 9.0, unit: "kg", sort_order: 31, active: true, created_at: "", updated_at: "" },
  { id: "11", slug: "alu-falgar",       name: "Aluminium — Fälgar",         category: "Aluminium",  description: "Bilfälgar.",                                        price_per_kg: 17,   co2_savings_per_kg: 9.0, unit: "kg", sort_order: 32, active: true, created_at: "", updated_at: "" },
  { id: "12", slug: "alu-plat",         name: "Aluminium — Plåt",           category: "Aluminium",  description: "Plåt och bleck.",                                   price_per_kg: 14,   co2_savings_per_kg: 9.0, unit: "kg", sort_order: 33, active: true, created_at: "", updated_at: "" },
  // Rostfritt
  { id: "13", slug: "rost-304",         name: "Rostfritt — 304",            category: "Rostfritt",  description: "Standard rostfritt stål.",                          price_per_kg: 9,    co2_savings_per_kg: 4.5, unit: "kg", sort_order: 40, active: true, created_at: "", updated_at: "" },
  { id: "14", slug: "rost-316",         name: "Rostfritt — 316",            category: "Rostfritt",  description: "Syrafast rostfritt.",                               price_per_kg: 14,   co2_savings_per_kg: 4.5, unit: "kg", sort_order: 41, active: true, created_at: "", updated_at: "" },
  // Järn & Stål
  { id: "15", slug: "jarn-hms1",        name: "Järn — Tungt skrot HMS1",    category: "Järn & Stål", description: "Heavy Melting Scrap 1.",                           price_per_kg: 2.80, co2_savings_per_kg: 1.5, unit: "kg", sort_order: 50, active: true, created_at: "", updated_at: "" },
  { id: "16", slug: "jarn-hms2",        name: "Järn — Lätt skrot HMS2",     category: "Järn & Stål", description: "Heavy Melting Scrap 2.",                           price_per_kg: 2.40, co2_savings_per_kg: 1.5, unit: "kg", sort_order: 51, active: true, created_at: "", updated_at: "" },
  // Bly
  { id: "17", slug: "bly-mjuk",         name: "Bly — Mjukbly",              category: "Bly",        description: "Rent bly från tak och vatten.",                     price_per_kg: 12,   co2_savings_per_kg: 2.0, unit: "kg", sort_order: 60, active: true, created_at: "", updated_at: "" },
  { id: "18", slug: "bly-batterier",    name: "Bly — Batterier",            category: "Bly",        description: "Bilbatterier.",                                     price_per_kg: 8,    co2_savings_per_kg: 2.0, unit: "kg", sort_order: 61, active: true, created_at: "", updated_at: "" },
  // Special
  { id: "19", slug: "zink",             name: "Zink",                       category: "Special",    description: "Zinkavfall.",                                       price_per_kg: 18,   co2_savings_per_kg: 3.5, unit: "kg", sort_order: 70, active: true, created_at: "", updated_at: "" },
  // Bil
  { id: "20", slug: "skrotbil",         name: "Skrotbil — Hel",             category: "Bil",        description: "Komplett skrotbil för avregistrering.",             price_per_kg: 0,    co2_savings_per_kg: 1500, unit: "st", sort_order: 80, active: true, created_at: "", updated_at: "" },
];

export const CATEGORIES: Material["category"][] = [
  "Koppar", "Mässing", "Aluminium", "Rostfritt", "Järn & Stål", "Bly", "Special", "Bil",
];
