import type Stripe from "stripe";
import { formatZl } from "@/lib/discount-math";

/**
 * Kody rabatowe sklepu. Kod jest promocją w Stripe (promotion code), a ta lista
 * pozwala aplikacji założyć brakujący kupon i kod oraz dopasować ograniczenia
 * kodu w Stripe (minimalna kwota, data ważności) do tej konfiguracji.
 * Jeśli kod w Stripe został ręcznie wyłączony, aplikacja go NIE odtwarza.
 *
 * Ograniczenia są też zawsze sprawdzane po stronie sklepu (serwer), więc
 * działają niezależnie od Stripe.
 */
interface CodeConfig {
  couponId: string;
  name: string;
  percentOff: number;
  /** Minimalna wartość produktów przed rabatem (bez dostawy), zł */
  minProducts?: number;
  /** Koniec ważności, sekundy unix */
  expiresAt?: number;
}

const KNOWN_CODES: Record<string, CodeConfig> = {
  FIRMA10: {
    couponId: "rabat-dla-firm-10",
    name: "Rabat dla firm 10%",
    percentOff: 10,
    minProducts: 200,
    expiresAt: 1798757999, // 2026-12-31 23:59:59 czasu polskiego (UTC+1)
  },
};

export const INVALID_CODE_MESSAGE =
  "Ten kod rabatowy jest nieprawidłowy lub wygasł. Sprawdź pisownię i spróbuj ponownie.";
export const EXPIRED_CODE_MESSAGE = "Ten kod rabatowy wygasł.";

export function normalizeCode(raw: unknown): string {
  return String(raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

export function minAmountMessage(code: string, minProducts: number, productsSubtotal: number): string {
  const left = Math.max(0, minProducts - productsSubtotal);
  return `Kod ${code} działa od ${formatZl(minProducts)} zł wartości produktów. Brakuje jeszcze ${formatZl(left)} zł.`;
}

export interface ResolvedDiscount {
  promotionCodeId: string;
  code: string;
  percentOff: number;
  label: string;
  /** zł, wartość produktów przed rabatem */
  minProducts: number;
  /** sekundy unix albo null */
  expiresAt: number | null;
}

export type DiscountResult =
  | { ok: true; discount: ResolvedDiscount }
  | { ok: false; reason: "invalid" | "expired" | "min_amount"; message: string; minProducts?: number; code?: string };

function restrictionsOf(pc: Stripe.PromotionCode) {
  const minStripe =
    pc.restrictions?.minimum_amount && (pc.restrictions.minimum_amount_currency || "pln") === "pln"
      ? pc.restrictions.minimum_amount / 100
      : 0;
  return { minStripe, expiresStripe: pc.expires_at ?? null };
}

function toResolved(pc: Stripe.PromotionCode): ResolvedDiscount | null {
  const coupon = pc.coupon;
  if (!pc.active || !coupon?.valid || !coupon.percent_off) return null;
  if (pc.max_redemptions && pc.times_redeemed >= pc.max_redemptions) return null;
  const cfg = KNOWN_CODES[pc.code.toUpperCase()];
  const { minStripe, expiresStripe } = restrictionsOf(pc);
  // obowiązuje ostrzejsze z: konfiguracja sklepu / ograniczenia w Stripe
  const minProducts = Math.max(cfg?.minProducts ?? 0, minStripe);
  const expiries = [cfg?.expiresAt, expiresStripe].filter((x): x is number => typeof x === "number");
  return {
    promotionCodeId: pc.id,
    code: pc.code,
    percentOff: coupon.percent_off,
    label: coupon.name || `Rabat ${coupon.percent_off}%`,
    minProducts,
    expiresAt: expiries.length ? Math.min(...expiries) : null,
  };
}

async function ensureCoupon(stripe: Stripe, cfg: CodeConfig): Promise<Stripe.Coupon> {
  try {
    return await stripe.coupons.retrieve(cfg.couponId);
  } catch {
    return await stripe.coupons.create({
      id: cfg.couponId,
      name: cfg.name,
      percent_off: cfg.percentOff,
      duration: "once",
      metadata: { source: "jankesowapasieka.pl" },
    });
  }
}

function promoCreateParams(code: string, couponId: string, cfg: CodeConfig): Stripe.PromotionCodeCreateParams {
  return {
    coupon: couponId,
    code,
    active: true,
    ...(cfg.expiresAt ? { expires_at: cfg.expiresAt } : {}),
    ...(cfg.minProducts
      ? { restrictions: { minimum_amount: Math.round(cfg.minProducts * 100), minimum_amount_currency: "pln" } }
      : {}),
    metadata: { source: "jankesowapasieka.pl" },
  };
}

async function ensureKnownCode(stripe: Stripe, code: string): Promise<Stripe.PromotionCode | null> {
  const cfg = KNOWN_CODES[code];
  if (!cfg) return null;
  const coupon = await ensureCoupon(stripe, cfg);
  try {
    return await stripe.promotionCodes.create(promoCreateParams(code, coupon.id, cfg));
  } catch {
    const again = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
    return again.data[0] ?? null;
  }
}

/**
 * Ograniczenia kodu w Stripe nie dają się edytować. Jeśli aktywny kod w Stripe
 * ma inne ograniczenia niż konfiguracja sklepu, wyłączamy go i zakładamy nowy
 * (ten sam kupon, ten sam kod) z właściwymi ograniczeniami.
 */
async function syncRestrictions(stripe: Stripe, pc: Stripe.PromotionCode): Promise<Stripe.PromotionCode> {
  const cfg = KNOWN_CODES[pc.code.toUpperCase()];
  if (!cfg) return pc;
  const { minStripe, expiresStripe } = restrictionsOf(pc);
  const wantMin = cfg.minProducts ?? 0;
  const wantExp = cfg.expiresAt ?? null;
  if (minStripe === wantMin && expiresStripe === wantExp) return pc;
  if (wantExp && wantExp * 1000 < Date.now()) return pc; // po terminie nic nie zakładamy

  const couponId = typeof pc.coupon === "string" ? pc.coupon : pc.coupon.id;
  try {
    await stripe.promotionCodes.update(pc.id, {
      active: false,
      metadata: { replaced_reason: "zmiana ograniczeń (min. kwota / ważność)" },
    });
  } catch (e: any) {
    console.error("Nie udało się wyłączyć starego kodu:", e?.message);
    return pc;
  }
  try {
    const fresh = await stripe.promotionCodes.create(promoCreateParams(pc.code, couponId, cfg));
    console.log(`Kod ${pc.code}: ${pc.id} wyłączony, nowy ${fresh.id} z ograniczeniami`);
    return fresh;
  } catch (e: any) {
    // może już istnieć nowy (równoległe żądanie)
    const again = await stripe.promotionCodes.list({ code: pc.code, active: true, limit: 1 });
    if (again.data[0]) return again.data[0];
    console.error("Nie udało się założyć nowego kodu, przywracam stary:", e?.message);
    await stripe.promotionCodes.update(pc.id, { active: true }).catch(() => {});
    return pc;
  }
}

async function findPromotionCode(stripe: Stripe, code: string): Promise<Stripe.PromotionCode | null> {
  const active = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
  if (active.data[0]) return syncRestrictions(stripe, active.data[0]);

  // Kod wyłączony w Stripe (albo wygasły) – nie odtwarzamy go
  const any = await stripe.promotionCodes.list({ code, limit: 1 });
  if (any.data.length > 0) return any.data[0];

  return ensureKnownCode(stripe, code);
}

/**
 * Sprawdza kod. productsSubtotal = wartość produktów przed rabatem, bez dostawy (zł).
 * Jeśli productsSubtotal nie jest podany, sprawdzenie minimalnej kwoty jest pomijane.
 */
export async function checkDiscountCode(
  stripe: Stripe,
  raw: unknown,
  productsSubtotal?: number
): Promise<DiscountResult> {
  const code = normalizeCode(raw);
  if (!code || code.length > 40 || !/^[A-Z0-9_-]+$/.test(code)) {
    return { ok: false, reason: "invalid", message: INVALID_CODE_MESSAGE };
  }

  const cfg = KNOWN_CODES[code];
  if (cfg?.expiresAt && cfg.expiresAt * 1000 <= Date.now()) {
    return { ok: false, reason: "expired", message: EXPIRED_CODE_MESSAGE };
  }

  const pc = await findPromotionCode(stripe, code);
  if (!pc) return { ok: false, reason: "invalid", message: INVALID_CODE_MESSAGE };
  if (pc.expires_at && pc.expires_at * 1000 <= Date.now()) {
    return { ok: false, reason: "expired", message: EXPIRED_CODE_MESSAGE };
  }
  const discount = toResolved(pc);
  if (!discount) return { ok: false, reason: "invalid", message: INVALID_CODE_MESSAGE };

  if (
    typeof productsSubtotal === "number" &&
    discount.minProducts > 0 &&
    productsSubtotal < discount.minProducts
  ) {
    return {
      ok: false,
      reason: "min_amount",
      code: discount.code,
      minProducts: discount.minProducts,
      message: minAmountMessage(discount.code, discount.minProducts, productsSubtotal),
    };
  }
  return { ok: true, discount };
}
