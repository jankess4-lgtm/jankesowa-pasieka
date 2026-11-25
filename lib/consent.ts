export const CONSENT_STORAGE_KEY = "jankesowa_cookie_consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "jankesowa-open-cookie-settings";
export const CONSENT_UPDATED_EVENT = "jankesowa-consent-updated";

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
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    const state = choice === "granted" ? "granted" : "denied";
    window.gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }
  window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT, { detail: { choice } }));
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

const PURCHASE_RECORD_PREFIX = "gads_conv_";

export type PurchaseConsentRecord = "denied" | "granted";

function purchaseRecordKey(transactionId: string): string {
  return `${PURCHASE_RECORD_PREFIX}${transactionId}`;
}

export function getPurchaseConversionRecord(
  transactionId: string
): PurchaseConsentRecord | null {
  if (typeof window === "undefined" || !transactionId) return null;
  try {
    const value = sessionStorage.getItem(purchaseRecordKey(transactionId));
    if (value === "granted" || value === "denied") return value;
  } catch {
    // sessionStorage may be blocked
  }
  return null;
}

export function markPurchaseConversionRecord(
  transactionId: string,
  state: PurchaseConsentRecord
): void {
  if (typeof window === "undefined" || !transactionId) return;
  try {
    sessionStorage.setItem(purchaseRecordKey(transactionId), state);
  } catch {
    // ignore
  }
}

/** Fire again only after a denied first send, once consent is granted. */
export function shouldFirePurchaseConversion(
  transactionId: string,
  consent: ConsentChoice | null
): boolean {
  const record = getPurchaseConversionRecord(transactionId);
  if (record === "granted") return false;
  if (record === "denied") return consent === "granted";
  return true;
}

function normalizeEmail(email?: string | null): string | null {
  if (!email) return null;
  const value = email.trim().toLowerCase();
  if (!value || !value.includes("@") || value.length > 254) return null;
  return value;
}

/**
 * Enhanced conversions: pass the checkout email to the Google tag only after
 * marketing consent. The tag hashes it; Ads also needs the enhanced
 * conversions toggle in the Google Ads UI.
 */
export function setEnhancedConversionUserData(email?: string | null): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (getStoredConsent() !== "granted") return;
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  window.gtag("set", "user_data", { email: normalized });
}
