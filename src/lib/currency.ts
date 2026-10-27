/**
 * Utilitaires de conversion et de formatage de devise pour le marché marocain (MAD / DH).
 * Les montants en base de données sont TOUJOURS stockés en centimes d'entier (Int) pour éviter tout problème d'arrondi.
 * 1 MAD = 100 centimes.
 */

export function formatPrice(centimes: number, options?: { showCents?: boolean; symbol?: "DH" | "MAD" }): string {
  const { showCents = false, symbol = "DH" } = options ?? {};
  const dirhams = centimes / 100;

  if (showCents && centimes % 100 !== 0) {
    return (
      new Intl.NumberFormat("fr-MA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(dirhams) + ` ${symbol}`
    );
  }

  return (
    new Intl.NumberFormat("fr-MA", {
      maximumFractionDigits: 0,
    }).format(Math.round(dirhams)) + ` ${symbol}`
  );
}

export function centimesToMAD(centimes: number): number {
  return Number((centimes / 100).toFixed(2));
}

export function madToCentimes(mad: number): number {
  return Math.round(mad * 100);
}
