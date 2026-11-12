/** Rabat procentowy od wartości produktów (bez dostawy), w złotych, zaokrąglony do grosza. */
export function discountAmount(productsSubtotal: number, percentOff: number): number {
  return Math.round(productsSubtotal * percentOff) / 100;
}

/** 89 -> "89", 80,1 -> "80,10" */
export function formatZl(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(".", ",");
}
