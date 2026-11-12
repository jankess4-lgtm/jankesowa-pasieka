export const SHIPPING_PARCEL = 14;
export const SHIPPING_COURIER = 16;
export const FREE_SHIPPING_THRESHOLD = 110;

export type DeliveryMethod = "address" | "parcel" | "pickup";

export function baseShippingCost(method: DeliveryMethod): number {
  if (method === "address") return SHIPPING_COURIER;
  if (method === "parcel") return SHIPPING_PARCEL;
  return 0;
}

export function qualifiesForFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}

/** Koszt jednej paczki po uwzględnieniu progu darmowej wysyłki. */
export function shippingUnitCost(method: DeliveryMethod, subtotal: number): number {
  if (method === "pickup") return 0;
  if (qualifiesForFreeShipping(subtotal)) return 0;
  return baseShippingCost(method);
}

export function shippingTotal(method: DeliveryMethod, subtotal: number, packages: number): number {
  return shippingUnitCost(method, subtotal) * Math.max(packages, 1);
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
