export const CONSENT_STORAGE_KEY = "jankesowa_cookie_consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "jankesowa-open-cookie-settings";

export type ConsentChoice = "granted" | "denied";

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

export function firePurchaseConversion(opts: {
  value?: number;
  transactionId?: string;
}): void {
  const id = process.env.NEXT_PUBLIC_GADS_ID;
  const label = process.env.NEXT_PUBLIC_GADS_PURCHASE_LABEL;
  if (!id || !label) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const payload: Record<string, string | number> = {
    send_to: `${id}/${label}`,
    currency: "PLN",
  };
  if (typeof opts.value === "number" && Number.isFinite(opts.value)) {
    payload.value = opts.value;
  }
  if (opts.transactionId) {
    payload.transaction_id = opts.transactionId;
  }

  window.gtag("event", "conversion", payload);
}
