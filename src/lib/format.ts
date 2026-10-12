import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const fmtDate = (d: Date | string, pattern = "EEE d MMM yyyy") => cap(format(new Date(d), pattern, { locale: fr }));
export const fmtDateTime = (d: Date | string) => cap(format(new Date(d), "EEE d MMM · HH:mm", { locale: fr }));

export function parseImages(images: string): string[] {
  try {
    const v = JSON.parse(images);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
