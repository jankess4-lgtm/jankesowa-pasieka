export const SHIPPING_PARCEL = 14;
export const SHIPPING_COURIER = 16;
export const SHIPPING_GERMANY = 80;
export const FREE_SHIPPING_THRESHOLD = 110;

export type DeliveryMethod = "address" | "parcel" | "pickup" | "germany";

export function isGermanyShipping(method: DeliveryMethod): boolean {
  return method === "germany";
}

export function baseShippingCost(method: DeliveryMethod): number {
  if (method === "address") return SHIPPING_COURIER;
  if (method === "parcel") return SHIPPING_PARCEL;
  if (method === "germany") return SHIPPING_GERMANY;
  return 0;
}

export function qualifiesForFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}

/** Koszt jednej paczki po uwzględnieniu progu darmowej wysyłki. Wysyłka do Niemiec jest zawsze 80 zł i nie podlega darmowej wysyłce. */
export function shippingUnitCost(method: DeliveryMethod, subtotal: number): number {
  if (method === "pickup") return 0;
  if (method === "germany") return SHIPPING_GERMANY;
  if (qualifiesForFreeShipping(subtotal)) return 0;
  return baseShippingCost(method);
}

/** Całkowity koszt dostawy. Dla Niemiec stawka jest stała za całe zamówienie (nie mnożymy przez liczbę paczek). */
export function shippingTotal(method: DeliveryMethod, subtotal: number, packages: number): number {
  if (method === "germany") return SHIPPING_GERMANY;
  return shippingUnitCost(method, subtotal) * Math.max(packages, 1);
}

/** Ile paczek wliczyć w pozycję dostawy (Niemcy = zawsze 1, bo 80 zł za zamówienie). */
export function shippingLineQuantity(method: DeliveryMethod, packages: number): number {
  if (method === "germany") return 1;
  return Math.max(packages, 1);
}

export function amountToFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

export function freeShippingMessage(subtotal: number): string {
  if (qualifiesForFreeShipping(subtotal)) {
    return "Darmowa wysyłka – wartość produktów wynosi co najmniej 110 zł.";
  }
  const left = amountToFreeShipping(subtotal);
  return `Brakuje ${left} zł do darmowej wysyłki.`;
}

export function deliveryMethodLabel(method: string): string {
  if (method === "parcel") return "Paczkomat InPost";
  if (method === "pickup") return "Odbiór osobisty";
  if (method === "germany") return "Wysyłka do Niemiec (DHL)";
  if (method === "address") return "Kurier na adres";
  return method;
}
