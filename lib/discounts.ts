import type Stripe from "stripe";

/**
 * Kody rabatowe sklepu. Kod jest promocją w Stripe (promotion code), a ta lista
 * pozwala aplikacji raz założyć brakujący kupon i kod. Jeśli kod w Stripe
 * istnieje, ale został wyłączony, aplikacja go NIE odtwarza (kod jest wtedy
 * nieważny).
 */
const KNOWN_CODES: Record<string, { couponId: string; name: string; percentOff: number }> = {
  FIRMA10: { couponId: "rabat-dla-firm-10", name: "Rabat dla firm 10%", percentOff: 10 },
};

export const INVALID_CODE_MESSAGE =
  "Ten kod rabatowy jest nieprawidłowy lub wygasł. Sprawdź pisownię i spróbuj ponownie.";

export function normalizeCode(raw: unknown): string {
  return String(raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

export interface ResolvedDiscount {
  promotionCodeId: string;
  code: string;
  percentOff: number;
  label: string;
}

function toResolved(pc: Stripe.PromotionCode): ResolvedDiscount | null {
  const coupon = pc.coupon;
  if (!pc.active || !coupon?.valid || !coupon.percent_off) return null;
  if (pc.expires_at && pc.expires_at * 1000 < Date.now()) return null;
  if (pc.max_redemptions && pc.times_redeemed >= pc.max_redemptions) return null;
  return {
    promotionCodeId: pc.id,
    code: pc.code,
    percentOff: coupon.percent_off,
    label: coupon.name || `Rabat ${coupon.percent_off}%`,
  };
}

async function ensureKnownCode(stripe: Stripe, code: string): Promise<Stripe.PromotionCode | null> {
  const cfg = KNOWN_CODES[code];
  if (!cfg) return null;
  let coupon: Stripe.Coupon;
  try {
    coupon = await stripe.coupons.retrieve(cfg.couponId);
  } catch {
    coupon = await stripe.coupons.create({
      id: cfg.couponId,
      name: cfg.name,
      percent_off: cfg.percentOff,
      duration: "once",
      metadata: { source: "jankesowapasieka.pl" },
    });
  }
  try {
    return await stripe.promotionCodes.create({ coupon: coupon.id, code, active: true });
  } catch {
    // równoległe założenie – pobierz to, co już jest
    const again = await stripe.promotionCodes.list({ code, limit: 1 });
    return again.data[0] ?? null;
  }
}

/** Zwraca aktywny kod rabatowy ze Stripe albo null, gdy kod jest nieważny. */
export async function resolveDiscountCode(stripe: Stripe, raw: unknown): Promise<ResolvedDiscount | null> {
  const code = normalizeCode(raw);
  if (!code || code.length > 40 || !/^[A-Z0-9_-]+$/.test(code)) return null;

  const active = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
  if (active.data[0]) return toResolved(active.data[0]);

  // Kod wyłączony w Stripe – nie odtwarzamy go
  const any = await stripe.promotionCodes.list({ code, limit: 1 });
  if (any.data.length > 0) return null;

  const created = await ensureKnownCode(stripe, code);
  return created ? toResolved(created) : null;
}
