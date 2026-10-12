/** Utilitaires pour combiner date (yyyy-MM-dd) + heure (HH:mm) en heure locale. */
export function combine(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m - 1, d, h, min);
}

export function toDateParam(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export const TIME_SLOTS = Array.from({ length: 31 }, (_, i) => {
  const h = 7 + Math.floor(i / 2);
  return `${String(h).padStart(2, "0")}:${i % 2 ? "30" : "00"}`;
}).filter((t) => t <= "22:00");

export function defaultSearch() {
  const pickup = new Date();
  pickup.setDate(pickup.getDate() + 1);
  const ret = new Date(pickup);
  ret.setDate(ret.getDate() + 3);
  return { pickupDate: toDateParam(pickup), pickupTime: "10:00", returnDate: toDateParam(ret), returnTime: "10:00" };
}

export type SearchParamsRecord = Record<string, string | string[] | undefined>;
export const sp = (p: SearchParamsRecord, k: string) => {
  const v = p[k];
  return Array.isArray(v) ? v[0] : v;
};

/** Lit une recherche (agences + dates) depuis les query params, avec valeurs par défaut cohérentes. */
export function readSearch(p: SearchParamsRecord) {
  const def = defaultSearch();
  const pickupDate = sp(p, "pickupDate") || def.pickupDate;
  const pickupTime = sp(p, "pickupTime") || def.pickupTime;
  const returnDate = sp(p, "returnDate") || def.returnDate;
  const returnTime = sp(p, "returnTime") || def.returnTime;
  let pickupAt = combine(pickupDate, pickupTime);
  let returnAt = combine(returnDate, returnTime);
  if (isNaN(pickupAt.getTime()) || isNaN(returnAt.getTime()) || returnAt <= pickupAt) {
    pickupAt = combine(def.pickupDate, def.pickupTime);
    returnAt = combine(def.returnDate, def.returnTime);
  }
  return {
    pickupAgency: sp(p, "pickupAgency") || "",
    returnAgency: sp(p, "returnAgency") || sp(p, "pickupAgency") || "",
    pickupDate: toDateParam(pickupAt),
    pickupTime,
    returnDate: toDateParam(returnAt),
    returnTime,
    pickupAt,
    returnAt,
  };
}

export function searchToQuery(s: { pickupAgency?: string; returnAgency?: string; pickupDate: string; pickupTime: string; returnDate: string; returnTime: string }) {
  const q = new URLSearchParams();
  if (s.pickupAgency) q.set("pickupAgency", s.pickupAgency);
  if (s.returnAgency) q.set("returnAgency", s.returnAgency);
  q.set("pickupDate", s.pickupDate);
  q.set("pickupTime", s.pickupTime);
  q.set("returnDate", s.returnDate);
  q.set("returnTime", s.returnTime);
  return q.toString();
}
