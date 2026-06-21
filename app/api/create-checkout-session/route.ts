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

    // Hardcoded full URL for logo to force Jankesowa Pasieka branding
    // (overrides any default FoodFarmer account branding where possible)
    const logoUrl = "https://jankesowapasieka.pl/logo.png";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"], // Polish friendly methods
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&order=${orderRef}`,
      cancel_url: `${origin}/cancel`,
      // Branding forced as strongly as possible:
      // - top-level metadata + nested branding object
      // - duplicated into payment_intent_data.metadata
      // - full hardcoded logo URL
      metadata: {
        orderRef,
        source: "jankesowa-pasieka",
        business_name: "Jankesowa Pasieka",
        brand_color: "#D97706",
        logo: logoUrl,
        branding: {
          business_name: "Jankesowa Pasieka",
          brand_color: "#D97706",
          logo: logoUrl,
        },
      },
      // Also attach branding to the underlying PaymentIntent for maximum visibility in Stripe
      payment_intent_data: {
        metadata: {
          business_name: "Jankesowa Pasieka",
          brand_color: "#D97706",
          logo: logoUrl,
        },
      },
      // Custom text – used aggressively to force "Jankesowa Pasieka" name visibility
      // on the hosted Checkout page (helps override default FoodFarmer account branding in UI text)
      custom_text: {
        submit: {
          message: "Płatność dla Jankesowa Pasieka • Złoto-miodowy akcent #D97706",
        },
        after_submit: {
          message: "Dziękujemy! Zamówienie w Jankesowej Pasiece zostało opłacone pomyślnie.",
        },
        shipping_address: {
          message: "Dostawa dla Jankesowa Pasieka",
        },
        billing_address: {
          message: "Faktura dla Jankesowa Pasieka",
        },
      },
      // Force Polish + branding intent as strongly as the API allows
      billing_address_collection: "auto",
      locale: "pl",
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
