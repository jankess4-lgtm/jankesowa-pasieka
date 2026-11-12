import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { resolveDiscountCode, INVALID_CODE_MESSAGE } from "@/lib/discounts";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const discount = await resolveDiscountCode(stripe, code);
    if (!discount) {
      return NextResponse.json({ valid: false, error: INVALID_CODE_MESSAGE }, { status: 404 });
    }
    return NextResponse.json({
      valid: true,
      code: discount.code,
      percentOff: discount.percentOff,
      label: discount.label,
    });
  } catch (err: any) {
    console.error("Discount code error:", err?.message);
    return NextResponse.json(
      { valid: false, error: "Nie udało się sprawdzić kodu. Spróbuj ponownie za chwilę." },
      { status: 500 }
    );
  }
}
