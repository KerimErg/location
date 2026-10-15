import { JOURS, type Jour, type Plage } from "@/config/site";

const minutes = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};

/** Jour et minute actuels à Paris, quel que soit le fuseau du visiteur. */
export function maintenantParis(d = new Date()) {
  const parts = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { jour: get("weekday").toLowerCase() as Jour, minute: Number(get("hour")) * 60 + Number(get("minute")) };
}

/** « Ouvert · ferme à 23:00 » ou « Fermé · ouvre à 11:30 » (gère la fermeture après minuit). */
export function statut(horaires: Record<Jour, Plage[]>, d = new Date()): { ouvert: boolean; texte: string } {
  const { jour, minute } = maintenantParis(d);
  const i = JOURS.indexOf(jour);
  const veille = JOURS[(i + 6) % 7];
  // plage de la veille qui déborde après minuit
  for (const p of horaires[veille]) {
    const o = minutes(p.ouverture), f = minutes(p.fermeture);
    if (f <= o && minute < f) return { ouvert: true, texte: `Ouvert · ferme à ${p.fermeture}` };
  }
  for (const p of horaires[jour]) {
    const o = minutes(p.ouverture), f = minutes(p.fermeture);
    const fin = f <= o ? f + 1440 : f;
    if (minute >= o && minute < fin) return { ouvert: true, texte: `Ouvert · ferme à ${p.fermeture}` };
  }
  for (const p of horaires[jour]) if (minutes(p.ouverture) > minute) return { ouvert: false, texte: `Fermé · ouvre à ${p.ouverture}` };
  for (let k = 1; k <= 7; k++) {
    const j = JOURS[(i + k) % 7];
    if (horaires[j].length) return { ouvert: false, texte: `Fermé · ouvre ${k === 1 ? "demain" : j} à ${horaires[j][0].ouverture}` };
  }
  return { ouvert: false, texte: "Fermé" };
}
