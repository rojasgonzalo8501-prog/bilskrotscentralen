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
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}
