import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Brak produktów w zamówieniu" }, { status: 400 });
    }

    // Generate a professional order reference
    const orderRef = `JP-${Date.now().toString(36).toUpperCase().slice(-8)}`;

    // Prepare line items for Stripe Checkout (prices in grosze / cents)
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "pln",
        unit_amount: Math.round(item.price * 100), // 60 zł → 6000
        product_data: {
          name: item.name,
          description: item.unit || undefined,
          // images: [] // can add absolute image urls if desired
        },
      },
      quantity: item.quantity || 1,
    }));

    // Get origin for redirect URLs (works in dev and production)
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Full absolute URL for logo (Stripe requires absolute HTTPS URLs for any hosted assets)
    const logoUrl = `${origin}/logo.png`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"], // Polish friendly methods
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&order=${orderRef}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        orderRef,
        source: "jankesowa-pasieka",
        business_name: "Jankesowa Pasieka",
        brand_color: "#D97706",
        logo: logoUrl,
      },
      custom_text: {
        submit: {
          message: "Płatność dla Jankesowa Pasieka",
        },
        after_submit: {
          message: "Dziękujemy! Zamówienie w Jankesowej Pasiece zostało opłacone.",
        },
      },
      // Branding note:
      // - locale: "pl" sets Polish language in the hosted Checkout
      // - brand_color (#D97706) and business_name are passed in metadata (visible in Stripe dashboard)
      // - logo is provided as full URL
      // - custom_text makes "Jankesowa Pasieka" visible on the payment page
      // - For the visual honey-gold accent (#D97706) to appear on the Checkout page header/buttons,
      //   also set the brand color and upload logo in Stripe Dashboard → Settings → Branding (recommended)
      billing_address_collection: "auto",
      locale: "pl", // Polish language in Checkout
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe Checkout error:", err);
    return NextResponse.json(
      { error: "Nie udało się utworzyć sesji płatności" },
      { status: 500 }
    );
  }
}
