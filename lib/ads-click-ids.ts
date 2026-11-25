export const ADS_CLICK_ID_KEYS = ["gclid", "wbraid", "gbraid"] as const;
export type AdsClickIdKey = (typeof ADS_CLICK_ID_KEYS)[number];
export type AdsClickIds = Partial<Record<AdsClickIdKey, string>>;

const SESSION_KEY = "jankesowa_ads_click_ids";
const LOCAL_KEY = "jankesowa_ads_click_ids";
const COOKIE_NAME = "jankesowa_ads_click_ids";
const COOKIE_MAX_AGE_SEC = 90 * 24 * 60 * 60;
const CLICK_ID_RE = /^[A-Za-z0-9._~-]{1,512}$/;

/** Accept only well-formed Google click IDs (no open-redirect / injection). */
export function sanitizeClickIds(input: unknown): AdsClickIds {
  if (!input || typeof input !== "object") return {};
  const out: AdsClickIds = {};
  for (const key of ADS_CLICK_ID_KEYS) {
    const raw = (input as Record<string, unknown>)[key];
    if (typeof raw !== "string") continue;
    const value = raw.trim();
    if (CLICK_ID_RE.test(value)) out[key] = value;
  }
  return out;
}

export function parseClickIdsFromSearch(search: string | URLSearchParams): AdsClickIds {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const raw: Record<string, string> = {};
  for (const key of ADS_CLICK_ID_KEYS) {
    const value = params.get(key);
    if (value) raw[key] = value;
  }
  return sanitizeClickIds(raw);
}

function readJsonStore(storage: Storage, key: string): AdsClickIds {
  try {
    const raw = storage.getItem(key);
    if (!raw) return {};
    return sanitizeClickIds(JSON.parse(raw));
  } catch {
    return {};
  }
}

function writeJsonStore(storage: Storage, key: string, ids: AdsClickIds): void {
  try {
    if (Object.keys(ids).length === 0) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify(ids));
  } catch {
    // private mode / quota
  }
}

function readCookie(): AdsClickIds {
  if (typeof document === "undefined") return {};
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const [name, ...rest] = part.trim().split("=");
    if (name !== COOKIE_NAME) continue;
    try {
      return sanitizeClickIds(JSON.parse(decodeURIComponent(rest.join("="))));
    } catch {
      return {};
    }
  }
  return {};
}

function writeCookie(ids: AdsClickIds): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  if (Object.keys(ids).length === 0) {
    document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    return;
  }
  const value = encodeURIComponent(JSON.stringify(ids));
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax${secure}`;
}

function mergeIds(...sources: AdsClickIds[]): AdsClickIds {
  const out: AdsClickIds = {};
  for (const src of sources) {
    for (const key of ADS_CLICK_ID_KEYS) {
      const value = src[key];
      if (value) out[key] = value;
    }
  }
  return out;
}

function hasIds(ids: AdsClickIds): boolean {
  return Object.keys(ids).length > 0;
}

/**
 * Capture gclid/wbraid/gbraid from the current URL.
 * Session storage is used as a same-tab URL passthrough so the IDs survive
 * navigation and can be appended to the Stripe success_url (cross-domain
 * checkout would otherwise drop them). Persistent localStorage + cookie are
 * written only when marketing consent is granted.
 */
export function captureAdsClickIdsFromLocation(consentGranted: boolean): void {
  if (typeof window === "undefined") return;
  const fromUrl = parseClickIdsFromSearch(window.location.search);
  const session = readJsonStore(sessionStorage, SESSION_KEY);
  const persistent = consentGranted
    ? mergeIds(readJsonStore(localStorage, LOCAL_KEY), readCookie())
    : {};
  const merged = mergeIds(persistent, session, fromUrl);
  if (!hasIds(merged)) return;
  writeJsonStore(sessionStorage, SESSION_KEY, merged);
  if (consentGranted) {
    writeJsonStore(localStorage, LOCAL_KEY, merged);
    writeCookie(merged);
  }
}

export function persistAdsClickIdsForConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  if (granted) {
    const ids = getAdsClickIds(true);
    if (!hasIds(ids)) return;
    writeJsonStore(sessionStorage, SESSION_KEY, ids);
    writeJsonStore(localStorage, LOCAL_KEY, ids);
    writeCookie(ids);
    return;
  }
  try {
    localStorage.removeItem(LOCAL_KEY);
  } catch {
    // ignore
  }
  writeCookie({});
}

export function getAdsClickIds(consentGranted: boolean): AdsClickIds {
  if (typeof window === "undefined") return {};
  const fromUrl = parseClickIdsFromSearch(window.location.search);
  const session = readJsonStore(sessionStorage, SESSION_KEY);
  const persistent = consentGranted
    ? mergeIds(readJsonStore(localStorage, LOCAL_KEY), readCookie())
    : {};
  return mergeIds(persistent, session, fromUrl);
}

export function clickIdsToQuery(ids: AdsClickIds): string {
  const params = new URLSearchParams();
  for (const key of ADS_CLICK_ID_KEYS) {
    const value = ids[key];
    if (value) params.set(key, value);
  }
  return params.toString();
}

export function appendClickIdsToUrl(url: string, ids: AdsClickIds): string {
  const query = clickIdsToQuery(ids);
  if (!query) return url;
  // Avoid URL() here: it would encode Stripe's {CHECKOUT_SESSION_ID} braces.
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}${query}`;
}
