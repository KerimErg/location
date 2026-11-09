export const eur = (n: number) =>
  new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
export const km = (n: number) => `${new Intl.NumberFormat("fr-BE").format(n)} km`;
export const num = (n: number) => new Intl.NumberFormat("fr-BE").format(n);
/** Mois/année de première immatriculation : « 05/2021 ». */
export const regDate = (d: Date) => `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
export const year = (d: Date) => d.getUTCFullYear();
