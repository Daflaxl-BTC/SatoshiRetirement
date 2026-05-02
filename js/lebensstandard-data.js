// ═══════════════════════════════════════════════════════════════════════
// Lebensstandard-Daten & Helper · geteilt zwischen Renten-Rechner und Finanzplan
// ═══════════════════════════════════════════════════════════════════════
// Globaler Namespace, damit beide Seiten dasselbe Modul nutzen können.

const LS_CITIES = [
    // [name, state, lat, lng, pop(Mio), rentColdEurPerSqm, costIdx(MUC=100), restMid(€), groceriesIdxRel]
    { n: 'München',       s: 'BY', lat: 48.135, lng: 11.582, pop: 1.51, rent: 22.5, ci: 100, rest: 70, gIdx: 1.10 },
    { n: 'Frankfurt',     s: 'HE', lat: 50.110, lng: 8.682,  pop: 0.79, rent: 17.5, ci: 92,  rest: 65, gIdx: 1.05 },
    { n: 'Hamburg',       s: 'HH', lat: 53.551, lng: 9.993,  pop: 1.90, rent: 16.0, ci: 88,  rest: 60, gIdx: 1.02 },
    { n: 'Stuttgart',     s: 'BW', lat: 48.775, lng: 9.180,  pop: 0.63, rent: 16.5, ci: 88,  rest: 60, gIdx: 1.03 },
    { n: 'Düsseldorf',    s: 'NW', lat: 51.227, lng: 6.773,  pop: 0.64, rent: 15.5, ci: 85,  rest: 60, gIdx: 1.02 },
    { n: 'Berlin',        s: 'BE', lat: 52.520, lng: 13.405, pop: 3.85, rent: 15.0, ci: 82,  rest: 50, gIdx: 0.98 },
    { n: 'Köln',          s: 'NW', lat: 50.937, lng: 6.960,  pop: 1.09, rent: 14.0, ci: 80,  rest: 55, gIdx: 1.00 },
    { n: 'Bonn',          s: 'NW', lat: 50.737, lng: 7.098,  pop: 0.34, rent: 13.5, ci: 78,  rest: 50, gIdx: 0.99 },
    { n: 'Heidelberg',    s: 'BW', lat: 49.398, lng: 8.673,  pop: 0.16, rent: 14.5, ci: 78,  rest: 55, gIdx: 1.00 },
    { n: 'Freiburg',      s: 'BW', lat: 47.999, lng: 7.842,  pop: 0.23, rent: 16.0, ci: 78,  rest: 55, gIdx: 1.00 },
    { n: 'Wiesbaden',     s: 'HE', lat: 50.082, lng: 8.241,  pop: 0.28, rent: 14.0, ci: 76,  rest: 55, gIdx: 1.00 },
    { n: 'Mainz',         s: 'RP', lat: 49.992, lng: 8.247,  pop: 0.22, rent: 13.5, ci: 76,  rest: 50, gIdx: 0.98 },
    { n: 'Karlsruhe',     s: 'BW', lat: 49.007, lng: 8.404,  pop: 0.31, rent: 13.0, ci: 75,  rest: 50, gIdx: 0.97 },
    { n: 'Nürnberg',      s: 'BY', lat: 49.452, lng: 11.077, pop: 0.52, rent: 12.5, ci: 75,  rest: 48, gIdx: 0.97 },
    { n: 'Mannheim',      s: 'BW', lat: 49.487, lng: 8.466,  pop: 0.32, rent: 12.5, ci: 73,  rest: 48, gIdx: 0.97 },
    { n: 'Hannover',      s: 'NI', lat: 52.374, lng: 9.738,  pop: 0.55, rent: 11.5, ci: 74,  rest: 48, gIdx: 0.96 },
    { n: 'Bremen',        s: 'HB', lat: 53.080, lng: 8.802,  pop: 0.57, rent: 11.0, ci: 72,  rest: 45, gIdx: 0.95 },
    { n: 'Münster',       s: 'NW', lat: 51.961, lng: 7.626,  pop: 0.32, rent: 12.5, ci: 73,  rest: 48, gIdx: 0.97 },
    { n: 'Augsburg',      s: 'BY', lat: 48.366, lng: 10.898, pop: 0.30, rent: 13.0, ci: 73,  rest: 48, gIdx: 0.97 },
    { n: 'Regensburg',    s: 'BY', lat: 49.013, lng: 12.101, pop: 0.16, rent: 13.0, ci: 72,  rest: 48, gIdx: 0.97 },
    { n: 'Dresden',       s: 'SN', lat: 51.050, lng: 13.738, pop: 0.56, rent: 10.0, ci: 70,  rest: 42, gIdx: 0.93 },
    { n: 'Leipzig',       s: 'SN', lat: 51.339, lng: 12.374, pop: 0.62, rent: 10.5, ci: 68,  rest: 40, gIdx: 0.93 },
    { n: 'Lübeck',        s: 'SH', lat: 53.866, lng: 10.687, pop: 0.22, rent: 10.0, ci: 68,  rest: 42, gIdx: 0.95 },
    { n: 'Kiel',          s: 'SH', lat: 54.323, lng: 10.122, pop: 0.25, rent: 10.5, ci: 70,  rest: 45, gIdx: 0.96 },
    { n: 'Rostock',       s: 'MV', lat: 54.092, lng: 12.099, pop: 0.21, rent: 10.5, ci: 67,  rest: 42, gIdx: 0.94 },
    { n: 'Erfurt',        s: 'TH', lat: 50.984, lng: 11.029, pop: 0.21, rent: 9.0,  ci: 65,  rest: 40, gIdx: 0.92 },
    { n: 'Magdeburg',     s: 'ST', lat: 52.120, lng: 11.628, pop: 0.24, rent: 8.5,  ci: 62,  rest: 38, gIdx: 0.91 },
    { n: 'Halle',         s: 'ST', lat: 51.483, lng: 11.969, pop: 0.24, rent: 8.0,  ci: 60,  rest: 38, gIdx: 0.91 },
    { n: 'Chemnitz',      s: 'SN', lat: 50.827, lng: 12.921, pop: 0.24, rent: 7.5,  ci: 58,  rest: 36, gIdx: 0.90 },
    { n: 'Dortmund',      s: 'NW', lat: 51.514, lng: 7.466,  pop: 0.59, rent: 9.5,  ci: 68,  rest: 42, gIdx: 0.95 },
    { n: 'Essen',         s: 'NW', lat: 51.451, lng: 7.013,  pop: 0.58, rent: 9.5,  ci: 68,  rest: 42, gIdx: 0.95 },
    { n: 'Duisburg',      s: 'NW', lat: 51.434, lng: 6.762,  pop: 0.50, rent: 8.5,  ci: 64,  rest: 38, gIdx: 0.93 },
    { n: 'Bielefeld',     s: 'NW', lat: 52.030, lng: 8.532,  pop: 0.34, rent: 9.5,  ci: 66,  rest: 40, gIdx: 0.94 },
    { n: 'Bochum',        s: 'NW', lat: 51.482, lng: 7.216,  pop: 0.37, rent: 9.0,  ci: 66,  rest: 40, gIdx: 0.94 },
    { n: 'Saarbrücken',   s: 'SL', lat: 49.234, lng: 6.997,  pop: 0.18, rent: 9.0,  ci: 64,  rest: 40, gIdx: 0.93 },
    { n: 'Potsdam',       s: 'BB', lat: 52.391, lng: 13.064, pop: 0.18, rent: 12.0, ci: 75,  rest: 48, gIdx: 0.97 },
    { n: 'Görlitz',       s: 'SN', lat: 51.156, lng: 14.989, pop: 0.06, rent: 6.0,  ci: 54,  rest: 32, gIdx: 0.88 },
    { n: 'Konstanz',      s: 'BW', lat: 47.660, lng: 9.175,  pop: 0.09, rent: 14.5, ci: 78,  rest: 55, gIdx: 1.00 }
];

// 5 Lifestyle-Tiers · Budget-Schwellen sind das gesamte verfügbare Monatsbudget netto
const LS_TIERS = [
    {
        id: 1, name: 'Sparflamme', em: '🍝', color: '#8b949e',
        min: 0, max: 1500,
        housing: { sqm: [18, 30], type: 'WG-Zimmer · Mikro-Apartment', share: 0.42 },
        car: { className: 'Kein Auto', share: 0.05, budget: 80, examples: ['Deutschlandticket', 'Gebrauchtes Fahrrad', 'Carsharing gelegentlich'] },
        food: { groceries: 'Discounter (Aldi/Lidl)', restaurant: '1× / Monat', share: 0.20 },
        leisure: { share: 0.08 },
        savings: { share: 0.05 },
        keypoints: ['WG oder Mikro-Apt', 'ÖPNV/Fahrrad', 'Kochen daheim', 'Bibliothek statt Streaming'],
        verdict: 'Minimalist — funktioniert in günstigen Städten, in München kaum machbar.'
    },
    {
        id: 2, name: 'Solide', em: '🏠', color: '#58a6ff',
        min: 1500, max: 2800,
        housing: { sqm: [40, 60], type: '1-2 Zi-Wohnung', share: 0.35 },
        car: { className: 'Kleinwagen', share: 0.12, budget: 320, examples: ['Dacia Sandero', 'VW Polo (gebraucht)', 'Hyundai i20'] },
        food: { groceries: 'Discounter + Wochenmarkt', restaurant: '1× / Woche', share: 0.18 },
        leisure: { share: 0.10 },
        savings: { share: 0.10 },
        keypoints: ['1-2 Zi-Wohnung', 'Kleinwagen oder ÖPNV', 'Restaurant 1×/Woche', '1× Urlaub/Jahr'],
        verdict: 'Solider Lebensstandard — komfortabel in B/C-Städten, knapp in Top-Metropolen.'
    },
    {
        id: 3, name: 'Komfortabel', em: '🛋️', color: '#3fb950',
        min: 2800, max: 4500,
        housing: { sqm: [60, 85], type: '2-3 Zi-Wohnung', share: 0.30 },
        car: { className: 'Mittelklasse', share: 0.13, budget: 550, examples: ['VW Golf 8', 'Skoda Octavia', 'Tesla Model 3 SR (gebraucht)'] },
        food: { groceries: 'Mix Discounter/Bio', restaurant: '2× / Woche', share: 0.15 },
        leisure: { share: 0.12 },
        savings: { share: 0.20 },
        keypoints: ['2-3 Zi-Wohnung', 'Mittelklasse-Auto', 'Restaurant 2×/Woche', '2× Urlaub/Jahr', 'Sparrate möglich'],
        verdict: 'Klassische Mittelschicht plus — komfortabel in den meisten Städten.'
    },
    {
        id: 4, name: 'Gehoben', em: '✨', color: '#f7931a',
        min: 4500, max: 8000,
        housing: { sqm: [85, 130], type: '3-4 Zi-Wohnung · Reihenhaus', share: 0.28 },
        car: { className: 'Premium', share: 0.13, budget: 950, examples: ['BMW 320i', 'Audi A4', 'Tesla Model Y LR', 'Mercedes C-Klasse'] },
        food: { groceries: 'Bio + Wochenmarkt', restaurant: 'frei wählbar', share: 0.13 },
        leisure: { share: 0.16 },
        savings: { share: 0.30 },
        keypoints: ['3-4 Zi oder Eigentum', 'Premium-Marke', 'Restaurants frei', 'Reisen mehrfach', 'Hohe Sparrate'],
        verdict: 'Gehobener Mittelstand — überall in Deutschland sehr gut leistbar.'
    },
    {
        id: 5, name: 'Luxus', em: '💎', color: '#bc8cff',
        min: 8000, max: 1e9,
        housing: { sqm: [130, 250], type: 'Penthouse · Haus mit Garten', share: 0.25 },
        car: { className: 'Oberklasse / Sportwagen', share: 0.15, budget: 2200, examples: ['Porsche 911', 'BMW 7er / iX', 'Mercedes S-Klasse', 'Tesla Model S Plaid', 'Range Rover'] },
        food: { groceries: 'Bio + Spezialisten', restaurant: 'gehoben, frei', share: 0.10 },
        leisure: { share: 0.20 },
        savings: { share: 0.40 },
        keypoints: ['Penthouse oder Haus', 'Oberklasse / Sportwagen', 'Gehobene Restaurants', 'Premium-Reisen', 'Vermögensaufbau weiter'],
        verdict: 'Wohlstand — Bitcoin als generationenübergreifender Asset.'
    }
];

// Auto-Katalog mit Tier-Zuordnung. Preise = Neuwagen-Listenpreis 2026 in €.
const LS_CARS = [
    { tier: 2, model: 'Dacia Sandero',     price: 13500, segDe: 'Kleinwagen',    fuel: 'Benzin',    consDe: '5,5 L/100km' },
    { tier: 2, model: 'VW Polo',           price: 22500, segDe: 'Kleinwagen',    fuel: 'Benzin',    consDe: '5,2 L/100km' },
    { tier: 2, model: 'Hyundai i20',       price: 18900, segDe: 'Kleinwagen',    fuel: 'Benzin',    consDe: '5,3 L/100km' },
    { tier: 2, model: 'Renault Clio',      price: 17500, segDe: 'Kleinwagen',    fuel: 'Hybrid',    consDe: '4,3 L/100km' },
    { tier: 3, model: 'VW Golf 8',         price: 32500, segDe: 'Kompaktklasse', fuel: 'Benzin',    consDe: '5,8 L/100km' },
    { tier: 3, model: 'Skoda Octavia',     price: 30900, segDe: 'Kompaktklasse', fuel: 'Diesel',    consDe: '4,8 L/100km' },
    { tier: 3, model: 'Tesla Model 3 SR',  price: 42000, segDe: 'Mittelklasse',  fuel: 'Elektro',   consDe: '14,5 kWh/100km' },
    { tier: 3, model: 'Hyundai Ioniq 5',   price: 45500, segDe: 'Mittelklasse',  fuel: 'Elektro',   consDe: '17,5 kWh/100km' },
    { tier: 3, model: 'Toyota Corolla',    price: 28900, segDe: 'Kompaktklasse', fuel: 'Hybrid',    consDe: '4,2 L/100km' },
    { tier: 4, model: 'BMW 320i',          price: 50500, segDe: 'Mittelklasse',  fuel: 'Benzin',    consDe: '6,4 L/100km' },
    { tier: 4, model: 'Audi A4',           price: 51900, segDe: 'Mittelklasse',  fuel: 'Diesel',    consDe: '5,1 L/100km' },
    { tier: 4, model: 'Mercedes C-Klasse', price: 53500, segDe: 'Mittelklasse',  fuel: 'Hybrid',    consDe: '5,8 L/100km' },
    { tier: 4, model: 'Tesla Model Y LR',  price: 55000, segDe: 'SUV',           fuel: 'Elektro',   consDe: '16,9 kWh/100km' },
    { tier: 4, model: 'BMW iX3',           price: 67000, segDe: 'SUV',           fuel: 'Elektro',   consDe: '18,5 kWh/100km' },
    { tier: 5, model: 'Porsche 911 Carrera', price: 130000, segDe: 'Sportwagen', fuel: 'Benzin',    consDe: '10,7 L/100km' },
    { tier: 5, model: 'BMW 7er / i7',      price: 135000, segDe: 'Oberklasse',   fuel: 'Elektro',   consDe: '19,5 kWh/100km' },
    { tier: 5, model: 'Mercedes S-Klasse', price: 142000, segDe: 'Oberklasse',   fuel: 'Hybrid',    consDe: '7,2 L/100km' },
    { tier: 5, model: 'Tesla Model S Plaid', price: 122000, segDe: 'Oberklasse', fuel: 'Elektro',   consDe: '18,9 kWh/100km' },
    { tier: 5, model: 'Porsche Taycan',    price: 118000, segDe: 'Sportwagen',   fuel: 'Elektro',   consDe: '21,4 kWh/100km' },
    { tier: 5, model: 'Range Rover',       price: 128000, segDe: 'SUV',          fuel: 'Hybrid',    consDe: '11,5 L/100km' }
];

// Vereinfachte Deutschland-Outline (Bundes-Außengrenze, ~80 Punkte, in lat/lng).
const LS_DE_OUTLINE = [
    [55.05, 8.40], [54.95, 9.45], [54.85, 9.95], [54.50, 11.20], [54.42, 13.65],
    [54.10, 13.95], [53.92, 14.20], [53.50, 14.30], [53.05, 14.40], [52.70, 14.55],
    [52.35, 14.65], [52.05, 14.70], [51.55, 15.05], [51.05, 15.05], [50.75, 14.85],
    [50.55, 14.30], [50.40, 13.20], [50.25, 12.50], [50.05, 12.10], [49.65, 12.45],
    [49.30, 12.80], [49.00, 13.20], [48.75, 13.50], [48.55, 13.45], [48.25, 13.00],
    [47.95, 12.90], [47.70, 12.95], [47.55, 12.20], [47.55, 11.45], [47.40, 10.95],
    [47.45, 10.45], [47.55, 9.95], [47.65, 9.45], [47.80, 8.95], [47.95, 8.55],
    [47.95, 7.85], [48.20, 7.65], [48.55, 7.80], [48.95, 8.10], [49.15, 7.05],
    [49.40, 6.65], [49.45, 6.10], [49.80, 6.20], [50.10, 6.10], [50.35, 6.30],
    [50.55, 6.05], [50.75, 6.10], [50.85, 6.10], [51.05, 5.95], [51.55, 6.05],
    [51.75, 6.20], [51.95, 6.30], [52.20, 6.85], [52.45, 7.05], [52.65, 7.05],
    [52.95, 7.15], [53.15, 7.20], [53.35, 7.30], [53.55, 8.35], [53.85, 8.55],
    [53.85, 8.95], [54.05, 8.85], [54.45, 8.65], [54.70, 8.95], [54.85, 9.10],
    [55.05, 8.40]
];

const LS_BOUNDS = { latMin: 47.30, latMax: 55.10, lngMin: 5.85, lngMax: 15.05 };
const LS_MAP_W = 600, LS_MAP_H = 700, LS_MAP_PAD = 30;

function lsProject(lat, lng) {
    const x = ((lng - LS_BOUNDS.lngMin) / (LS_BOUNDS.lngMax - LS_BOUNDS.lngMin)) * (LS_MAP_W - 2*LS_MAP_PAD) + LS_MAP_PAD;
    const yRel = (LS_BOUNDS.latMax - lat) / (LS_BOUNDS.latMax - LS_BOUNDS.latMin);
    const y = yRel * (LS_MAP_H - 2*LS_MAP_PAD) + LS_MAP_PAD;
    return [x, y];
}

// Lifestyle-Tier aus Budget bestimmen
function lsTierForBudget(eurMonth) {
    return LS_TIERS.find(t => eurMonth >= t.min && eurMonth < t.max) || LS_TIERS[LS_TIERS.length - 1];
}

// Haushalts-Faktor: Wieviel mehr Budget braucht ein 4-Personen-HH für gleichen Lebensstandard?
const LS_HH_FACTOR = { single: 1.0, couple: 1.55, family3: 1.95, family4: 2.30 };

// Bewertet Stadt für gegebenes Budget+Haushalt
function lsEvaluateCity(city, budget, hhKey) {
    const hh = LS_HH_FACTOR[hhKey] || 1;
    const tier = lsTierForBudget(budget);
    const sqmTarget = ((tier.housing.sqm[0] + tier.housing.sqm[1]) / 2) * (0.7 + 0.3 * hh);
    const rentCold = sqmTarget * city.rent;
    const rentWarm = rentCold * 1.30;
    const rentBudget = budget * tier.housing.share;
    const ratio = rentWarm / rentBudget;
    const baseCost = budget * (1 - tier.housing.share - tier.car.share - tier.savings.share);
    const cityCost = baseCost * (city.ci / 75) * (0.6 + 0.4 * hh);
    const totalNeeded = rentWarm + cityCost + tier.car.budget;
    let verdict, color;
    if (totalNeeded < budget * 0.92) { verdict = 'komfortabel'; color = '#3fb950'; }
    else if (totalNeeded < budget * 1.05) { verdict = 'knapp'; color = '#e3b341'; }
    else { verdict = 'nicht machbar'; color = '#f85149'; }
    return { verdict, color, rentCold, rentWarm, sqmTarget, rentBudget, ratio, totalNeeded, cityCost, tier };
}
