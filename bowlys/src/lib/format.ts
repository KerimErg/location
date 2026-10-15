const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

/** 8.9 → "8,90 €" */
export const prix = (n: number) => fmt.format(n);
