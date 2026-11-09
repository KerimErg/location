// Stock de démonstration. Photos : Unsplash (licence Unsplash, usage commercial libre).
// Chaque photo montre le modèle annoncé ; à remplacer par les photos réelles du stock.
const u = (id: string) => `https://unsplash.com/photos/${id}/download?w=1600`;

type Seed = {
  make: string; model: string; version: string; reg: string; mileage: number; price: number; previousPrice?: number;
  vatDeductible?: boolean; fuel: "ESSENCE" | "DIESEL" | "HYBRIDE" | "HYBRIDE_RECHARGEABLE" | "ELECTRIQUE";
  gearbox: "MANUELLE" | "AUTOMATIQUE"; body: "CITADINE" | "COMPACTE" | "BERLINE" | "BREAK" | "SUV" | "COUPE" | "CABRIOLET" | "MONOSPACE";
  powerKw: number; engineCc?: number; euroNorm: string; co2?: number; doors: number; seats: number; color: string; owners: number;
  options: string[]; description: string; photo: string; status?: "DISPONIBLE" | "RESERVE" | "VENDU"; featured?: boolean;
};

export const VEHICLES: Seed[] = [
  { make: "Volkswagen", model: "Golf", version: "8 GTI 2.0 TSI DSG", reg: "2021-05", mileage: 48200, price: 32900, fuel: "ESSENCE", gearbox: "AUTOMATIQUE", body: "COMPACTE", powerKw: 180, engineCc: 1984, euroNorm: "Euro 6d", co2: 168, doors: 5, seats: 5, color: "Gris Moonstone", owners: 1, featured: true,
    options: ["Digital Cockpit Pro", "Navigation Discover Pro", "Jantes 18\" Richmond", "Phares LED Matrix IQ.Light", "Sièges sport tissu Clark", "Régulateur adaptatif ACC", "Caméra de recul", "Apple CarPlay / Android Auto"],
    description: "Golf 8 GTI première main, carnet d'entretien complet chez VW. Distribution et vidange faites en 2024. Pneus avant neufs.", photo: u("88zEyRjSIxY") },
  { make: "Volkswagen", model: "Golf", version: "7 GTI Performance 2.0 TSI", reg: "2018-03", mileage: 86500, price: 22900, previousPrice: 23900, fuel: "ESSENCE", gearbox: "MANUELLE", body: "COMPACTE", powerKw: 180, engineCc: 1984, euroNorm: "Euro 6", co2: 148, doors: 5, seats: 5, color: "Blanc Oryx", owners: 2,
    options: ["Différentiel autobloquant VAQ", "Freins Performance", "Jantes 19\" Brescia", "Discover Media", "Climatisation bizone", "Park Distance Control AV/AR"],
    description: "Version Performance en boîte manuelle, de plus en plus rare. Entretien suivi, embrayage d'origine en bon état, aucun choc.", photo: u("tmhW9YUAFPw") },
  { make: "Volkswagen", model: "Golf", version: "7 1.6 TDI Highline", reg: "2017-09", mileage: 112000, price: 13450, fuel: "DIESEL", gearbox: "MANUELLE", body: "COMPACTE", powerKw: 85, engineCc: 1598, euroNorm: "Euro 6", co2: 104, doors: 5, seats: 5, color: "Gris Indium", owners: 2,
    options: ["Navigation", "Sièges chauffants", "Régulateur de vitesse", "Capteurs de stationnement", "Jantes alliage 16\""],
    description: "Golf diesel économique, idéale pour les longs trajets. Courroie de distribution remplacée à 105 000 km (facture).", photo: u("E5QW_maORfg") },
  { make: "BMW", model: "Série 3", version: "320d xDrive Berline (G20)", reg: "2020-11", mileage: 74300, price: 29500, vatDeductible: true, fuel: "DIESEL", gearbox: "AUTOMATIQUE", body: "BERLINE", powerKw: 140, engineCc: 1995, euroNorm: "Euro 6d", co2: 124, doors: 4, seats: 5, color: "Gris Mineral", owners: 1, featured: true,
    options: ["Pack M Sport", "Live Cockpit Professional", "Sièges chauffants", "Hayon électrique", "Assistant de stationnement", "Phares LED adaptatifs", "Boîte Steptronic 8 rapports"],
    description: "320d xDrive en Pack M, ex-véhicule de société belge, entretien BMW complet. TVA récupérable pour les professionnels.", photo: u("EqaAEsRUzBU") },
  { make: "BMW", model: "Série 3", version: "328i Coupé (E36)", reg: "1997-06", mileage: 168000, price: 11900, fuel: "ESSENCE", gearbox: "MANUELLE", body: "COUPE", powerKw: 142, engineCc: 2793, euroNorm: "—", doors: 2, seats: 4, color: "Bleu Avus", owners: 3,
    options: ["6 cylindres en ligne", "Intérieur cuir", "Toit ouvrant", "Jantes BBS"],
    description: "Youngtimer en très bel état, historique connu. Immatriculable en plaque ancêtre dans quelques années. Visible sur rendez-vous.", photo: u("JGvg8TS63aQ") },
  { make: "Audi", model: "A3 Sportback", version: "30 TFSI S line", reg: "2021-02", mileage: 39800, price: 24750, fuel: "ESSENCE", gearbox: "MANUELLE", body: "COMPACTE", powerKw: 81, engineCc: 999, euroNorm: "Euro 6d", co2: 122, doors: 5, seats: 5, color: "Gris Daytona", owners: 1,
    options: ["Virtual Cockpit", "MMI Navigation plus", "Phares LED", "Sièges sport S line", "Climatisation automatique", "Audi smartphone interface"],
    description: "A3 nouvelle génération, faible kilométrage, garantie constructeur restante transférée.", photo: u("Z5ZdJ1ACapQ") },
  { make: "Audi", model: "A4", version: "35 TDI S tronic Business", reg: "2019-07", mileage: 98000, price: 21900, vatDeductible: true, fuel: "DIESEL", gearbox: "AUTOMATIQUE", body: "BERLINE", powerKw: 110, engineCc: 1968, euroNorm: "Euro 6d-TEMP", co2: 118, doors: 4, seats: 5, color: "Noir Mythe", owners: 1,
    options: ["MMI Navigation", "Sièges chauffants", "Régulateur adaptatif", "Hayon électrique", "Jantes 17\""],
    description: "Berline routière, entretien Audi à jour, idéale pour un usage professionnel.", photo: u("ZQHAKbyc-p0") },
  { make: "Mercedes-Benz", model: "Classe C", version: "C 200 Avantgarde", reg: "2019-04", mileage: 81500, price: 25900, fuel: "ESSENCE", gearbox: "AUTOMATIQUE", body: "BERLINE", powerKw: 135, engineCc: 1497, euroNorm: "Euro 6d-TEMP", co2: 142, doors: 4, seats: 5, color: "Blanc Polaire", owners: 1, featured: true,
    options: ["Technologie EQ Boost 48 V", "Comand Online", "Pack Avantgarde", "Caméra de recul", "Sièges chauffants", "Éclairage d'ambiance"],
    description: "C 200 mild hybrid en finition Avantgarde, entretien Mercedes complet, état irréprochable.", photo: u("o2IjGdZ0hJ8") },
  { make: "Mercedes-Benz", model: "Classe C", version: "C 220 d Business Solution", reg: "2018-10", mileage: 128000, price: 19900, fuel: "DIESEL", gearbox: "AUTOMATIQUE", body: "BERLINE", powerKw: 143, engineCc: 1950, euroNorm: "Euro 6", co2: 117, doors: 4, seats: 5, color: "Argent Iridium", owners: 2, status: "RESERVE",
    options: ["Navigation Garmin", "Parktronic", "Sièges chauffants", "Boîte 9G-Tronic"],
    description: "Grande routière sobre et confortable. Révision complète effectuée avant la vente.", photo: u("tzgfcic-uks") },
  { make: "Tesla", model: "Model 3", version: "Long Range AWD", reg: "2021-09", mileage: 61000, price: 31500, fuel: "ELECTRIQUE", gearbox: "AUTOMATIQUE", body: "BERLINE", powerKw: 324, euroNorm: "Électrique", co2: 0, doors: 4, seats: 5, color: "Gris Nuit", owners: 1, featured: true,
    options: ["Autopilot", "Toit en verre", "Sièges chauffants AV/AR", "Pompe à chaleur", "Autonomie WLTP 580 km"],
    description: "Model 3 Long Range transmission intégrale, rapport de santé batterie fourni (SOH 93 %).", photo: u("YiloIDwB0RE") },
  { make: "Toyota", model: "RAV4", version: "2.5 Hybrid AWD-i Style", reg: "2020-06", mileage: 69500, price: 30900, fuel: "HYBRIDE", gearbox: "AUTOMATIQUE", body: "SUV", powerKw: 163, engineCc: 2487, euroNorm: "Euro 6d", co2: 128, doors: 5, seats: 5, color: "Bleu Fantôme", owners: 1,
    options: ["Transmission intégrale", "Toyota Safety Sense", "Hayon électrique", "Caméra 360°", "Sièges chauffants"],
    description: "SUV hybride fiable et polyvalent, entretien Toyota à jour, garantie hybride prolongeable.", photo: u("PNyyffLvWIs") },
  { make: "Toyota", model: "Yaris", version: "1.5 Hybrid Dynamic", reg: "2022-03", mileage: 28400, price: 19450, fuel: "HYBRIDE", gearbox: "AUTOMATIQUE", body: "CITADINE", powerKw: 85, engineCc: 1490, euroNorm: "Euro 6d", co2: 92, doors: 5, seats: 5, color: "Blanc", owners: 1,
    options: ["Caméra de recul", "Apple CarPlay / Android Auto", "Climatisation automatique", "Toyota Safety Sense"],
    description: "Citadine hybride quasi neuve, consommation réelle autour de 4 l/100 km.", photo: u("DjLraiQJ9js") },
  { make: "Fiat", model: "500", version: "1.0 Hybrid Dolcevita", reg: "2021-08", mileage: 31200, price: 12950, fuel: "HYBRIDE", gearbox: "MANUELLE", body: "CITADINE", powerKw: 51, engineCc: 999, euroNorm: "Euro 6d", co2: 104, doors: 3, seats: 4, color: "Blanc Gelato", owners: 1,
    options: ["Toit ouvrant panoramique", "Écran 7\" Uconnect", "Jantes 16\"", "Capteurs de recul"],
    description: "Idéale pour la ville et les jeunes conducteurs, très économique à l'usage.", photo: u("7ZJJ0-9Lc20"), status: "VENDU" },
  { make: "Mini", model: "Cooper", version: "1.5 136 ch 5 portes", reg: "2019-12", mileage: 57300, price: 17900, fuel: "ESSENCE", gearbox: "AUTOMATIQUE", body: "CITADINE", powerKw: 100, engineCc: 1499, euroNorm: "Euro 6d-TEMP", co2: 127, doors: 5, seats: 5, color: "Gris Moonwalk", owners: 1,
    options: ["Navigation", "Sièges chauffants", "Phares LED", "Boîte Steptronic 7 rapports", "Toit contrasté"],
    description: "Mini 5 portes bien équipée, entretien Mini à jour, deux clés.", photo: u("eExAPOrIacw") },
];
