export const CONSENT_STORAGE_KEY = "jankesowa_cookie_consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "jankesowa-open-cookie-settings";

/** Public Google Ads / Google tag ID (safe to expose client-side). */
export const DEFAULT_GADS_ID = "AW-18561285258";

export type ConsentChoice = "granted" | "denied";

export type PurchaseItem = {
  item_id?: string;
  item_name?: string;
  quantity?: number;
  price?: number;
};

export function getGadsId(): string {
  return process.env.NEXT_PUBLIC_GADS_ID || DEFAULT_GADS_ID;
}

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

export function setStoredConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // ignore quota / private mode errors
  }
}

export function applyConsentUpdate(choice: ConsentChoice): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const state = choice === "granted" ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Fires the standard GA4/Ads `purchase` event (event-based conversion).
 * If NEXT_PUBLIC_GADS_PURCHASE_LABEL is set, also fires classic `conversion` with send_to.
 */
export function firePurchaseConversion(opts: {
  value?: number;
  transactionId?: string;
  items?: PurchaseItem[];
}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const id = getGadsId();
  const label = process.env.NEXT_PUBLIC_GADS_PURCHASE_LABEL;

  const purchasePayload: Record<string, unknown> = {
    currency: "PLN",
  };
  if (typeof opts.value === "number" && Number.isFinite(opts.value)) {
    purchasePayload.value = opts.value;
  }
  if (opts.transactionId) {
    purchasePayload.transaction_id = opts.transactionId;
  }
  if (opts.items && opts.items.length > 0) {
    purchasePayload.items = opts.items;
  }

  window.gtag("event", "purchase", purchasePayload);

  if (label) {
    const conversionPayload: Record<string, string | number> = {
      send_to: `${id}/${label}`,
      currency: "PLN",
    };
    if (typeof opts.value === "number" && Number.isFinite(opts.value)) {
      conversionPayload.value = opts.value;
    }
    if (opts.transactionId) {
      conversionPayload.transaction_id = opts.transactionId;
    }
    window.gtag("event", "conversion", conversionPayload);
  }
}
