import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { checkDiscountCode } from "@/lib/discounts";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Podgląd kodu w koszyku. Ostateczne sprawdzenie (z cenami z serwera)
// i tak odbywa się przy tworzeniu sesji płatności.
export async function POST(request: NextRequest) {
  try {
    const { code, productsSubtotal } = await request.json();
    const subtotal = Number(productsSubtotal);
    const result = await checkDiscountCode(
      stripe,
      code,
      Number.isFinite(subtotal) && subtotal >= 0 ? subtotal : 0
    );
    if (!result.ok) {
      return NextResponse.json(
        {
          valid: false,
          reason: result.reason,
          error: result.message,
          ...(result.minProducts ? { minProducts: result.minProducts, code: result.code } : {}),
        },
        { status: result.reason === "min_amount" ? 422 : 404 }
      );
    }
    const d = result.discount;
    return NextResponse.json({
      valid: true,
      code: d.code,
      percentOff: d.percentOff,
      label: d.label,
      minProducts: d.minProducts,
      expiresAt: d.expiresAt,
    });
  } catch (err: any) {
    console.error("Discount code error:", err?.message);
    return NextResponse.json(
      { valid: false, error: "Nie udało się sprawdzić kodu. Spróbuj ponownie za chwilę." },
      { status: 500 }
    );
  }
}
