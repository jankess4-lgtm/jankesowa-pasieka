import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { items, customer } = await request.json();

    // Detailed logging for debugging session creation issues
    console.log("Full cart items received:", JSON.stringify(items, null, 2));
    console.log("Prices from cart:", items.map((item: any) => ({
      name: item.name,
      price: item.price,
      unit_amount_grosze: Math.round(item.price * 100)
    })));

    // Validate items from cart
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("Validation failed: empty or invalid items");
      return NextResponse.json({ error: "Brak produktów w zamówieniu" }, { status: 400 });
    }

    // Validate each item has required fields and price is positive number
    for (const item of items) {
      if (!item.name || typeof item.price !== "number" || item.price <= 0) {
        console.log("Validation failed for item:", item);
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
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => ({
      price_data: {
        currency: "pln",
        unit_amount: Math.round(item.price * 100), // Ensure integer grosze
        product_data: {
          name: item.name,
          description: item.unit || undefined,
          images: ["https://jankesowapasieka.pl/logo.png"], // Must be array of strings
        },
      },
      quantity: item.quantity || 1,
    }));

    // Prepare customer / delivery metadata
    const deliveryMeta: Record<string, string> = {};
    let shippingCost = 0;
    let shippingName = "";

    if (customer) {
      deliveryMeta.customer_name = customer.fullName || "";
      deliveryMeta.customer_phone = customer.phone || "";
      deliveryMeta.customer_email = customer.email || "";
      deliveryMeta.delivery_method = customer.deliveryMethod || "";

      if (customer.deliveryMethod === "address") {
        deliveryMeta.shipping_street = customer.street || "";
        deliveryMeta.shipping_postal_code = customer.postalCode || "";
        deliveryMeta.shipping_city = customer.city || "";
        deliveryMeta.shipping_cost = "16";
        shippingCost = 16;
        shippingName = "Dostawa kurierem na adres";
      } else if (customer.deliveryMethod === "parcel") {
        const lockerStr = customer.parcelLocker || "";
        deliveryMeta.parcel_locker = lockerStr;
        deliveryMeta.shipping_cost = "14";
        shippingCost = 14;
        shippingName = "Dostawa do Paczkomatu InPost";

        // Extract code and full address for shipping_details / metadata (no real address fields)
        const parts = lockerStr.split(/[–-]/).map((s: string) => s.trim());
        deliveryMeta.locker_code = parts[0] || "";
        deliveryMeta.locker_full_address = parts.length > 1 ? parts.slice(1).join(" - ") : lockerStr;
      } else if (customer.deliveryMethod === "pickup") {
        deliveryMeta.shipping_cost = "0";
        deliveryMeta.pickup_location = "Topolno nad Wisłą";
        shippingCost = 0;
      }
    }

        // Add fixed shipping cost as a line item so Stripe charges the correct total (products + shipping)
    if (shippingCost > 0 && shippingName) {
      const shippingProductData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
        name: shippingName,
        description: "Koszt dostawy",
        images: ["https://jankesowapasieka.pl/logo.png"],
      };
      lineItems.push({
        price_data: {
          currency: "pln",
          unit_amount: shippingCost * 100,
          product_data: shippingProductData,
        },
        quantity: 1,
      });
    }

    // Create Checkout Session - MAXIMALLY force Jankesowa Pasieka branding (złoto-miodowy #D97706)
    // Using every possible field to override default white / previous account branding
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"], // Polish friendly methods
      mode: "payment",
      ui_mode: "hosted",
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&order=${orderRef}`,
      cancel_url: `${origin}/cancel`,

      // Customer email if provided
      ...(customer?.email ? { customer_email: customer.email } : {}),

      // 1. Top level metadata with ALL branding keys - duplicated many times to maximally override
      metadata: {
        orderRef,
        source: "jankesowa-pasieka",
        business_name: "Jankesowa Pasieka",
        brand_color: "#D97706",
        logo: logoUrl,
        // images removed from here - must be array of strings only inside product_data, not in metadata
        // Extra copies (valid keys only - all values must be strings)
        accent_color: "#D97706",
        company_name: "Jankesowa_Pasieka",
        primary_color: "#D97706",
        company_logo: logoUrl,
        // Order & customer data
        ...deliveryMeta,
      },

      // 2. payment_intent_data.metadata - duplicate branding here too + customer info
      payment_intent_data: {
        metadata: {
          business_name: "Jankesowa Pasieka",
          brand_color: "#D97706",
          logo: logoUrl,
          // images removed - only allowed as array of strings in product_data
          accent: "#D97706",
          company: "Jankesowa Pasieka",
          primary_color: "#D97706",
          ...deliveryMeta,
        },
      },

      // 3. Custom text - only using supported fields to avoid Stripe errors
      custom_text: {
        submit: {
          message: "Zapłać za zamówienie w Jankesowej Pasiece"
        }
      },

      // 4. Locale + force customer + other settings
      locale: "pl",
      customer_creation: "always",
      submit_type: "pay",

      // 5. Conditionally collect shipping/billing address ONLY for courier ("Dostawa kurierem na adres").
      // For "Paczkomat InPost" or pickup: do NOT include shipping_address_collection so Stripe
      // checkout page does NOT show address fields (line1, postal_code, city etc.).
      // Delivery info (locker code + full_address from DB) is passed via metadata only.
      ...(customer?.deliveryMethod === "address" ? {
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: ["PL"],
        },
      } : {}),
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    // Full detailed error handling as requested
    console.error("Stripe Checkout session creation failed - full error:", err);
    console.error("Error stack:", err?.stack);

    return Response.json(
      {
        error: err.message || "Nie udało się utworzyć sesji płatności",
        details: err.stack || "No stack trace available"
      },
      { status: 500 }
    );
  }
}
