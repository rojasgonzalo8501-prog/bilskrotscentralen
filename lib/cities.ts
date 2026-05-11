/**
 * Cities Bilskrotscentralen serves with free vehicle pickup.
 * Used to generate /skrota-bilen/[ort] SEO landing pages.
 */

export type City = {
  slug: string;
  name: string;
  /** Distance from Enköping in km — affects pickup priority. */
  distanceKm: number;
  /** Population, used to estimate demand and tone of copy. */
  population: number;
  /** Short SEO blurb for the page hero. */
  blurb: string;
};

export const CITIES: City[] = [
  {
    slug: "enkoping",
    name: "Enköping",
    distanceKm: 0,
    population: 25000,
    blurb:
      "Vi finns mitt i Enköping. Skrota din bil hos oss direkt eller boka gratis hämtning samma vecka.",
  },
  {
    slug: "vasteras",
    name: "Västerås",
    distanceKm: 35,
    population: 130000,
    blurb:
      "Vi hämtar gratis i hela Västerås och kringliggande kommuner. Bokning vardagar inom 1–3 dagar.",
  },
  {
    slug: "uppsala",
    name: "Uppsala",
    distanceKm: 50,
    population: 165000,
    blurb:
      "Gratis bilhämtning i hela Uppsala och Knivsta. Vi kommer med bärgare och betalar marknadens bästa pris.",
  },
  {
    slug: "stockholm",
    name: "Stockholm",
    distanceKm: 80,
    population: 980000,
    blurb:
      "Vi hämtar gratis i Stockholm och hela Storstockholm. Boka via formuläret eller ring så ordnar Adam resten.",
  },
  {
    slug: "eskilstuna",
    name: "Eskilstuna",
    distanceKm: 60,
    population: 70000,
    blurb:
      "Skrota bilen i Eskilstuna — vi kommer med bärgare, hanterar avregistreringen och betalar dig samma dag.",
  },
  {
    slug: "malardalen",
    name: "Mälardalen",
    distanceKm: 0,
    population: 1500000,
    blurb:
      "Hela Mälardalen — Enköping, Västerås, Uppsala, Stockholm, Eskilstuna. Gratis hämtning vart du än bor.",
  },
  // Smaller surrounding towns — low Google competition, easy organic wins.
  {
    slug: "balsta",
    name: "Bålsta",
    distanceKm: 25,
    population: 17000,
    blurb:
      "Bara 20 minuter från oss. Vi hämtar bilen i hela Bålsta och Håbo kommun — ofta samma dag som du ringer.",
  },
  {
    slug: "sala",
    name: "Sala",
    distanceKm: 50,
    population: 12000,
    blurb:
      "Gratis bilhämtning i Sala och kringliggande Salbohed, Ransta och Möklinta. Boka via formulär eller telefon.",
  },
  {
    slug: "knivsta",
    name: "Knivsta",
    distanceKm: 40,
    population: 19000,
    blurb:
      "Skrota bilen i Knivsta — vi kommer med bärgare, hanterar avregistreringen och betalar dig samma dag.",
  },
  {
    slug: "heby",
    name: "Heby",
    distanceKm: 45,
    population: 14000,
    blurb:
      "Gratis hämtning av skrotbil i Heby kommun — Tärnsjö, Östervåla, Morgongåva. Boka direkt online.",
  },
  {
    slug: "tierp",
    name: "Tierp",
    distanceKm: 80,
    population: 21000,
    blurb:
      "Vi hämtar gratis i hela Tierps kommun. Ring eller boka online, vi sköter resten.",
  },
  {
    slug: "sigtuna",
    name: "Sigtuna",
    distanceKm: 35,
    population: 50000,
    blurb:
      "Skrota bilen i Sigtuna kommun — Märsta, Rosersberg, Sigtuna stad. Gratis hämtning inom Mälardalen.",
  },
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}
