/**
 * Common model list per brand — safe for client components (no `node:fs`).
 *
 * Kept in its own module so the brand/model/year selector in
 * app/bildelar/BrandSelector.tsx can import it without dragging the whole
 * codelist CSV loader into the client bundle.
 *
 * Keys match BRAND_REGISTRY.name in lib/codelist.ts.
 */
export const MODELS: Record<string, string[]> = {
  "Mercedes-Benz": ["A-klass", "B-klass", "C-klass", "CLA", "CLS", "E-klass", "GLA", "GLB", "GLC", "GLE", "GLS", "S-klass", "SL", "SLC", "Sprinter", "Vito", "V-klass"],
  "Volvo":         ["S40", "S60", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90"],
  "BMW":           ["1-serie", "2-serie", "3-serie", "4-serie", "5-serie", "6-serie", "7-serie", "8-serie", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "M3", "M5"],
  "Audi":          ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "e-tron", "RS3", "RS4", "S3", "S4"],
  "Volkswagen":    ["Golf", "Passat", "Polo", "Tiguan", "Touareg", "Touran", "Transporter", "Caddy", "Crafter", "Sharan", "ID.3", "ID.4"],
  "Toyota":        ["Auris", "Avensis", "C-HR", "Camry", "Corolla", "Hilux", "Land Cruiser", "Prius", "RAV4", "Yaris", "Yaris Cross", "bZ4X"],
  "Ford":          ["Fiesta", "Focus", "Mondeo", "Mustang", "Puma", "Kuga", "EcoSport", "Explorer", "Edge", "Galaxy", "S-Max", "C-Max", "Transit", "Ranger"],
  "Peugeot":       ["107", "206", "207", "208", "307", "308", "408", "508", "2008", "3008", "5008", "Rifter", "Expert", "Partner"],
  "Opel":          ["Astra", "Corsa", "Insignia", "Meriva", "Mokka", "Zafira", "Grandland", "Crossland", "Antara", "Vectra"],
  "Saab":          ["9-3", "9-5", "900", "9000"],
  "Renault":       ["Clio", "Megane", "Laguna", "Scenic", "Espace", "Kadjar", "Captur", "Koleos", "Talisman", "Zoe", "Arkana"],
  "Škoda":         ["Fabia", "Octavia", "Superb", "Yeti", "Karoq", "Kodiaq", "Scala", "Kamiq", "Enyaq"],
  "Kia":           ["Picanto", "Rio", "Ceed", "Pro Ceed", "Stinger", "Sportage", "Sorento", "Soul", "Niro", "EV6"],
  "Hyundai":       ["i10", "i20", "i30", "i40", "Tucson", "Santa Fe", "Kona", "Ioniq", "Ioniq 5"],
  "Nissan":        ["Micra", "Note", "Juke", "Qashqai", "X-Trail", "Leaf", "Navara", "Pathfinder", "Murano", "Ariya", "370Z"],
  "Mazda":         ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-60", "CX-9", "MX-5", "MX-30"],
  "Honda":         ["Jazz", "Civic", "Accord", "CR-V", "HR-V", "FR-V", "e", "ZR-V"],
  "Mitsubishi":    ["ASX", "Outlander", "Eclipse Cross", "L200", "Pajero", "Space Star"],
  "Subaru":        ["Forester", "Outback", "XV", "Impreza", "Legacy", "BRZ"],
  "Suzuki":        ["Swift", "Vitara", "SX4", "Jimny", "Ignis", "Baleno"],
  "Fiat":          ["500", "500X", "500L", "Panda", "Punto", "Tipo", "Doblo", "Ducato"],
  "Alfa Romeo":    ["Giulia", "Giulietta", "Stelvio", "MiTo", "159", "156"],
  "Citroën":       ["C1", "C3", "C3 Aircross", "C4", "C4 Cactus", "C5", "C5 Aircross", "Berlingo", "Jumper"],
  "DS":            ["DS 3", "DS 4", "DS 5", "DS 7"],
  "Dacia":         ["Sandero", "Duster", "Logan", "Lodgy", "Jogger", "Spring"],
  "SEAT":          ["Ibiza", "Leon", "Toledo", "Arona", "Ateca", "Tarraco", "Alhambra"],
  "Cupra":         ["Leon", "Formentor", "Ateca", "Born"],
  "Mini":          ["Cooper", "Countryman", "Clubman", "Paceman"],
  "Jaguar":        ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace", "F-Type"],
  "Land Rover":    ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar"],
  "Porsche":       ["911", "718 Cayman", "718 Boxster", "Cayenne", "Macan", "Panamera", "Taycan"],
  "Tesla":         ["Model 3", "Model S", "Model X", "Model Y"],
  "Polestar":      ["Polestar 1", "Polestar 2", "Polestar 3", "Polestar 4"],
  "Jeep":          ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Avenger"],
  "Chevrolet":     ["Aveo", "Captiva", "Cruze", "Orlando", "Spark", "Camaro", "Corvette"],
  "Chrysler":      ["300C", "Voyager", "PT Cruiser"],
  "Dodge":         ["Challenger", "Charger", "Durango", "RAM"],
  "Lexus":         ["CT", "IS", "ES", "GS", "LS", "NX", "RX", "UX"],
  "Infiniti":      ["Q30", "Q50", "Q60", "QX30", "QX50", "QX70"],
  "Smart":         ["ForTwo", "ForFour"],
  "MG":            ["ZS", "4", "5", "Marvel R", "HS"],
  "BYD":           ["Atto 3", "Dolphin", "Seal", "Han", "Tang"],
  "Lancia":        ["Ypsilon", "Delta", "Musa"],
};

/**
 * Client-safe shape of a brand — a subset of the full Brand type in
 * lib/codelist.ts that only includes fields the selector needs.
 */
export type BrandOption = {
  slug: string;
  name: string;
  logoUrl: string;
};
