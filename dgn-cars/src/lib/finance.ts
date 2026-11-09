/** Mensualité d'un prêt amortissable (taux annuel en %). */
export function monthlyPayment(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

// Exemple représentatif — à adapter à l'offre du partenaire financier.
export const DEFAULT_RATE = 6.99;
export const DURATIONS = [24, 36, 48, 60, 72];
