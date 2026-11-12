import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStock, TRACKED_IDS } from "@/lib/inventory";
import { products, findBundleForCartId, parseBundleCartIdFor, bundleVarietiesLabel, jarSize, packagesNeeded } from "@/lib/products";
import { shippingTotal, shippingLineQuantity, qualifiesForFreeShipping, type DeliveryMethod } from "@/lib/shipping";
import { checkDiscountCode, type ResolvedDiscount } from "@/lib/discounts";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { items, customer, discountCode } = await request.json();

    console.log("Full cart items received:", JSON.stringify(items, null, 2));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Brak produktów w zamówieniu" }, { status: 400 });
    }

    const orderRef = `JP-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const logoUrl = "https://jankesowapasieka.pl/logo.png";

    // Ceny i nazwy pobieramy z katalogu po stronie serwera (nie ufamy cenom z przeglądarki)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    // Zużycie stanów magazynowych i liczenie paczek
    const used = new Map<number, number>();
    let largeJars = 0, smallJars = 0, otherUnits = 0;
    const countJar = (p: { id: number } & any, q: number) => {
      used.set(p.id, (used.get(p.id) || 0) + q);
      const size = jarSize(p);
      if (size === "large") largeJars += q;
      else if (size === "small") smallJars += q;
      else if (p.id === 12) otherUnits += q; // plaster miodu zajmuje 1 miejsce
    };
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
        for (const c of chosen) countJar(c, quantity);
        used.set(bundleCfg.id, (used.get(bundleCfg.id) || 0) + quantity);
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
      countJar(product, quantity);
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

    // Sprawdzenie stanów magazynowych (zestawy zużywają słoiki z miodów)
    const liveStock = await getStock();
    const stockUsed: Record<string, number> = {};
    for (const [id, qty] of Array.from(used.entries())) {
      const p = products.find((x) => x.id === id);
      const available = TRACKED_IDS.includes(id) ? liveStock[id] : p?.inStock ?? 0;
      if (TRACKED_IDS.includes(id)) stockUsed[String(id)] = qty;
      if (p && qty > available) {
        return NextResponse.json(
          { error: available > 0
              ? `Za mało na stanie: ${p.name} (dostępne: ${available} szt.)`
              : `Produkt chwilowo niedostępny: ${p.name}` },
          { status: 400 }
        );
      }
    }
    const packages = Math.max(packagesNeeded(largeJars, smallJars, otherUnits), 1);

    const productsSubtotal = lineItems.reduce((sum, item) => {
      const unit = item.price_data?.unit_amount ?? 0;
      const qty = item.quantity ?? 1;
      return sum + (unit * qty) / 100;
    }, 0);

    // Prepare shipping – prices from the catalog, free from 110 zł products subtotal
    const deliveryMeta: Record<string, string> = {};
    let shippingName = "";
    const method = (customer?.deliveryMethod || "") as DeliveryMethod | "";

    if (customer) {
      deliveryMeta.customer_name = customer.fullName || "";
      deliveryMeta.customer_phone = customer.phone || "";
      deliveryMeta.customer_email = customer.email || "";
      deliveryMeta.delivery_method = customer.deliveryMethod || "";

      if (method === "address") {
        deliveryMeta.shipping_street = customer.street || "";
        deliveryMeta.shipping_postal_code = customer.postalCode || "";
        deliveryMeta.shipping_city = customer.city || "";
        shippingName = qualifiesForFreeShipping(productsSubtotal)
          ? "Dostawa kurierem na adres (darmowa wysyłka)"
          : "Dostawa kurierem na adres";
      } else if (method === "parcel") {
        const lockerStr = customer.parcelLocker || "";
        deliveryMeta.parcel_locker = lockerStr;
        shippingName = qualifiesForFreeShipping(productsSubtotal)
          ? "Dostawa do Paczkomatu InPost (darmowa wysyłka)"
          : "Dostawa do Paczkomatu InPost";
      } else if (method === "pickup") {
        shippingName = "Odbiór osobisty";
      } else if (method === "germany") {
        shippingName = "Dostawa do Niemiec (DHL)";
      }

    }

    // Kod rabatowy (np. FIRMA10) – sprawdzany w Stripe; rabat obejmuje tylko produkty.
    // Próg darmowej wysyłki liczymy od wartości produktów PRZED rabatem.
    let discount: ResolvedDiscount | null = null;
    if (discountCode && String(discountCode).trim()) {
      // productsSubtotal liczony z cen katalogu po stronie serwera
      const check = await checkDiscountCode(stripe, discountCode, productsSubtotal);
      if (!check.ok) {
        return NextResponse.json(
          { error: check.message, invalidCode: true, reason: check.reason },
          { status: 400 }
        );
      }
      discount = check.discount;
    }

    // Z rabatem dostawa idzie jako opcja wysyłki Stripe (rabat jej nie obejmuje),
    // bez rabatu – jak dotąd, jako osobna pozycja.
    const shippingQty = method ? shippingLineQuantity(method as DeliveryMethod, packages) : packages;
    const shippingAmount = method ? shippingTotal(method as DeliveryMethod, productsSubtotal, packages) : 0;
    const multiPackageLabel = method !== "germany" && packages > 1;
    let shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] | undefined;
    if (discount && shippingAmount > 0 && shippingName) {
      shippingOptions = [{
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: multiPackageLabel ? `${shippingName} – ${packages} paczki` : shippingName,
          fixed_amount: { amount: Math.round(shippingAmount * 100), currency: "pln" },
        },
      }];
    } else if (shippingAmount > 0 && shippingName) {
      lineItems.push({
        price_data: {
          currency: "pln",
          unit_amount: Math.round((shippingAmount / shippingQty) * 100),
          product_data: {
            name: shippingName,
            description: method === "germany"
              ? "Koszt dostawy do Niemiec (stała stawka za zamówienie)"
              : (multiPackageLabel ? `Koszt dostawy – ${packages} paczki (bezpieczne pakowanie słoików)` : "Koszt dostawy"),
            images: ["https://jankesowapasieka.pl/logo.png"],
          },
        },
        quantity: shippingQty,
      });
    }
    deliveryMeta.packages = String(packages);
    deliveryMeta.stock = JSON.stringify(stockUsed);
    deliveryMeta.products_subtotal = String(productsSubtotal);
    deliveryMeta.shipping_cost = String(shippingAmount);
    deliveryMeta.free_shipping = (method !== "germany" && qualifiesForFreeShipping(productsSubtotal)) ? "1" : "0";
    if (discount) {
      deliveryMeta.discount_code = discount.code;
      deliveryMeta.discount_percent = String(discount.percentOff);
    }

    console.log("Prepared lineItems for Stripe:", JSON.stringify(lineItems, null, 2));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      mode: "payment",
      ui_mode: "hosted",
      line_items: lineItems,
      ...(discount ? { discounts: [{ promotion_code: discount.promotionCodeId }] } : {}),
      ...(shippingOptions ? { shipping_options: shippingOptions } : {}),
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
      } : customer?.deliveryMethod === "germany" ? {
        billing_address_collection: "auto",
        shipping_address_collection: { allowed_countries: ["DE"] },
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