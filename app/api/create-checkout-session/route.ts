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

    // Get origin for redirect URLs (works in dev and production)
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Full production URL for logo - strongly forced to override any default account branding (e.g. FoodFarmer)
    const logoUrl = "https://jankesowapasieka.pl/logo.png";

    // Prepare line items for Stripe Checkout - prices MUST be in grosze (cents)
    // Force Jankesowa Pasieka logo images on every product for strong visual branding
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "pln",
        unit_amount: Math.round(item.price * 100), // Ensure integer grosze
        product_data: {
          name: item.name,
          description: item.unit || undefined,
          images: [logoUrl], // Force logo image on product cards in Checkout
        },
      },
      quantity: item.quantity || 1,
    }));

    // Create Checkout Session - MAXIMALLY force Jankesowa Pasieka branding (złoto-miodowy #D97706)
    // Using every possible field to override default white / previous account branding
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"], // Polish friendly methods
      mode: "payment",
      ui_mode: "hosted",
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&order=${orderRef}`,
      cancel_url: `${origin}/cancel`,

      // 1. Top level metadata with ALL branding keys - duplicated many times to maximally override
      metadata: {
        orderRef,
        source: "jankesowa-pasieka",
        business_name: "Jankesowa Pasieka",
        brand_color: "#D97706",
        logo: logoUrl,
        images: [logoUrl],
        // Extra copies to maximize override of default white look
        "Jankesowa Pasieka": "true",
        accent_color: "#D97706",
        company_name: "Jankesowa Pasieka",
        primary_color: "#D97706",
        company_logo: logoUrl,
      },

      // 2. payment_intent_data.metadata - duplicate branding here too
      payment_intent_data: {
        metadata: {
          business_name: "Jankesowa Pasieka",
          brand_color: "#D97706",
          logo: logoUrl,
          images: [logoUrl],
          accent: "#D97706",
          company: "Jankesowa Pasieka",
          primary_color: "#D97706",
        },
      },

      // 3. Rich custom_text - heavily branded text appears directly on the Checkout page
      // to force Jankesowa Pasieka + złoto-miodowy #D97706 look instead of default
      custom_text: {
        submit: {
          message: "Płatność dla Jankesowa Pasieka • Złoto-miodowy #D97706",
        },
        after_submit: {
          message: "Dziękujemy! Zamówienie w Jankesowej Pasiece opłacone. Złoto-miodowy #D97706",
        },
        shipping_address: {
          message: "Dostawa dla Jankesowa Pasieka (złoto-miodowy #D97706)",
        },
        billing_address: {
          message: "Faktura - Jankesowa Pasieka • Złoto-miodowy #D97706",
        },
        terms_of_service: {
          message: "Akceptuję regulamin Jankesowa Pasieka",
        },
      },

      // 4. Force address collection + other UI fields for consistent branded experience
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["PL"],
      },

      // 5. Locale + force customer + other settings
      locale: "pl",
      customer_creation: "always",
      submit_type: "pay",
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
