import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    // Validate items from cart
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Brak produktów w zamówieniu" }, { status: 400 });
    }

    // Validate each item has required fields and price is positive number
    for (const item of items) {
      if (!item.name || typeof item.price !== "number" || item.price <= 0) {
        return NextResponse.json(
          { error: "Nieprawidłowe dane produktu w koszyku (brak nazwy lub ceny)" },
          { status: 400 }
        );
      }
    }

    // Generate a professional order reference
    const orderRef = `JP-${Date.now().toString(36).toUpperCase().slice(-8)}`;

    // Prepare line items for Stripe Checkout - prices MUST be in grosze (cents)
    // e.g. 60 zł = 6000 groszy
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "pln",
        unit_amount: Math.round(item.price * 100), // Ensure integer grosze
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

    // Full production URL for logo - strongly forced to override any default account branding (e.g. FoodFarmer)
    const logoUrl = "https://jankesowapasieka.pl/logo.png";

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"], // Polish friendly methods
      mode: "payment",
      ui_mode: "hosted",
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&order=${orderRef}`,
      cancel_url: `${origin}/cancel`,
      // Branding info (flat primitives only - Stripe metadata does not support nested objects)
      metadata: {
        orderRef,
        source: "jankesowa-pasieka",
        business_name: "Jankesowa Pasieka",
        brand_color: "#D97706",
        logo: logoUrl,
      },
      // Attach branding also to the underlying PaymentIntent
      payment_intent_data: {
        metadata: {
          business_name: "Jankesowa Pasieka",
          brand_color: "#D97706",
          logo: logoUrl,
        },
      },
      // Custom text to show brand name on Checkout page
      custom_text: {
        submit: {
          message: "Płatność dla Jankesowa Pasieka • Złoto-miodowy akcent #D97706",
        },
        after_submit: {
          message: "Dziękujemy! Zamówienie w Jankesowej Pasiece zostało opłacone pomyślnie.",
        },
      },
      billing_address_collection: "auto",
      locale: "pl",
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    // Full detailed error handling
    console.error("Stripe Checkout session creation failed:", err);
    console.error("Error details:", {
      message: err?.message,
      type: err?.type,
      code: err?.code,
      param: err?.param,
      statusCode: err?.statusCode,
      raw: err?.raw,
    });

    return Response.json(
      {
        error: "Nie udało się utworzyć sesji płatności",
      },
      { status: 500 }
    );
  }
}
