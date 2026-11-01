import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { products, findBundleForCartId, parseBundleCartIdFor, bundleVarietiesLabel } from "@/lib/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { items, customer } = await request.json();

    console.log("Full cart items received:", JSON.stringify(items, null, 2));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Brak produktów w zamówieniu" }, { status: 400 });
    }

    const orderRef = `JP-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const logoUrl = "https://jankesowapasieka.pl/logo.png";

    // Ceny i nazwy pobieramy z katalogu po stronie serwera (nie ufamy cenom z przeglądarki)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const item of items as any[]) {
      const quantity = Math.floor(Number(item?.quantity) || 1);
      // Zestawy: id koduje wybrane miody, cena zawsze z serwera
      const bundleCfg = findBundleForCartId(Number(item?.id));
      if (bundleCfg) {
        const bundleProduct = products.find((p) => p.id === bundleCfg.id);
        const chosen = parseBundleCartIdFor(bundleCfg, Number(item?.id));
        if (!chosen || !bundleProduct || bundleProduct.available === false) {
          return NextResponse.json(
            { error: bundleCfg.count === 2
                ? "Wybierz dwa dostępne miody 1,2 kg do zestawu"
                : `Wybierz ${bundleCfg.count} dostępne miody ${bundleCfg.jarLabel} do zestawu` },
            { status: 400 }
          );
        }
        if (quantity < 1 || quantity > 50) {
          return NextResponse.json({ error: "Nieprawidłowa ilość produktu" }, { status: 400 });
        }
        const label = bundleVarietiesLabel(chosen);
        lineItems.push({
          price_data: {
            currency: "pln",
            unit_amount: bundleCfg.price * 100,
            product_data: {
              name: `${bundleCfg.labelPrefix}: ${label}`,
              description: `Wybrane miody: ${label} (${bundleCfg.count} × ${bundleCfg.jarLabel})`,
              images: ["https://jankesowapasieka.pl/logo.png"],
            },
          },
          quantity,
        });
        continue;
      }
      const product = products.find((p) => p.id === Number(item?.id));
      if (!product || product.available === false) {
        return NextResponse.json(
          { error: `Produkt jest niedostępny: ${item?.name || item?.id}` },
          { status: 400 }
        );
      }
      if (quantity < 1 || quantity > 50) {
        return NextResponse.json({ error: "Nieprawidłowa ilość produktu" }, { status: 400 });
      }
      lineItems.push({
        price_data: {
          currency: "pln",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.name,
            description: product.unit || undefined,
            images: ["https://jankesowapasieka.pl/logo.png"],
          },
        },
        quantity,
      });
    }

    // Prepare shipping
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
        shippingCost = 16;
        shippingName = "Dostawa kurierem na adres";
      } else if (customer.deliveryMethod === "parcel") {
        const lockerStr = customer.parcelLocker || "";
        deliveryMeta.parcel_locker = lockerStr;
        shippingCost = 14;
        shippingName = "Dostawa do Paczkomatu InPost";
      } else if (customer.deliveryMethod === "pickup") {
        shippingCost = 0;
        shippingName = "Odbiór osobisty";
      }
    }

    // Add shipping as line item
    if (shippingCost > 0 && shippingName) {
      lineItems.push({
        price_data: {
          currency: "pln",
          unit_amount: shippingCost * 100,
          product_data: {
            name: shippingName,
            description: "Koszt dostawy",
            images: ["https://jankesowapasieka.pl/logo.png"],
          },
        },
        quantity: 1,
      });
    }

    console.log("Prepared lineItems for Stripe:", JSON.stringify(lineItems, null, 2));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      mode: "payment",
      ui_mode: "hosted",
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&order=${orderRef}`,
      cancel_url: `${origin}/cancel`,
      ...(customer?.email ? { customer_email: customer.email } : {}),
      metadata: {
        orderRef,
        business_name: "Jankesowa Pasieka",
        brand_color: "#D97706",
        logo: logoUrl,
        ...deliveryMeta,
      },
      payment_intent_data: {
        metadata: {
          business_name: "Jankesowa Pasieka",
          brand_color: "#D97706",
          logo: logoUrl,
          ...deliveryMeta,
        },
      },
      custom_text: {
        submit: {
          message: "Zapłać za zamówienie w Jankesowej Pasiece"
        }
      },
      locale: "pl",
      customer_creation: "always",
      submit_type: "pay",
      ...(customer?.deliveryMethod === "address" ? {
        billing_address_collection: "auto",
        shipping_address_collection: { allowed_countries: ["PL"] },
      } : {}),
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (err: any) {
    console.error("Stripe Checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Nie udało się utworzyć sesji płatności" },
      { status: 500 }
    );
  }
}