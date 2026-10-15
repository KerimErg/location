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

/** « 2 h 15 », « 45 min ». */
export const duree = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${String(m % 60).padStart(2, "0")}` : ""}` : `${m} min`);

export type Statut = {
  ouvert: boolean;
  /** « Ouvert · ferme à 23:00 » */
  texte: string;
  /** « jusqu'à 23:00 » / « ouvre à 11:30 » */
  court: string;
  /** minutes avant fermeture (si ouvert) ou avant ouverture (si fermé), null si inconnu */
  dans: number | null;
};

/** Statut d'ouverture à l'heure de Paris (gère la fermeture après minuit). */
export function statut(horaires: Record<Jour, Plage[]>, d = new Date()): Statut {
  const { jour, minute } = maintenantParis(d);
  const i = JOURS.indexOf(jour);
  const veille = JOURS[(i + 6) % 7];
  const ouvert = (fermeture: string, dans: number): Statut => ({ ouvert: true, texte: `Ouvert · ferme à ${fermeture}`, court: `jusqu'à ${fermeture}`, dans });

  for (const p of horaires[veille]) {
    const o = minutes(p.ouverture), f = minutes(p.fermeture);
    if (f <= o && minute < f) return ouvert(p.fermeture, f - minute);
  }
  for (const p of horaires[jour]) {
    const o = minutes(p.ouverture), f = minutes(p.fermeture);
    const fin = f <= o ? f + 1440 : f;
    if (minute >= o && minute < fin) return ouvert(p.fermeture, fin - minute);
  }
  for (const p of horaires[jour]) {
    const o = minutes(p.ouverture);
    if (o > minute) return { ouvert: false, texte: `Fermé · ouvre à ${p.ouverture}`, court: `ouvre à ${p.ouverture}`, dans: o - minute };
  }
  for (let k = 1; k <= 7; k++) {
    const j = JOURS[(i + k) % 7];
    if (horaires[j].length) {
      const quand = k === 1 ? "demain" : j;
      const dans = k * 1440 - minute + minutes(horaires[j][0].ouverture);
      return { ouvert: false, texte: `Fermé · ouvre ${quand} à ${horaires[j][0].ouverture}`, court: `ouvre ${quand} à ${horaires[j][0].ouverture}`, dans };
    }
  }
  return { ouvert: false, texte: "Fermé", court: "", dans: null };
}
