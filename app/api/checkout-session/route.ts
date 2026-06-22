import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Brak session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });

    // Return safe public information + parsed delivery info for nice success page
    const meta = session.metadata || {};
    const shippingCost = meta.shipping_cost ? parseInt(meta.shipping_cost, 10) : 0;
    const deliveryMethod = meta.delivery_method || "address";

    let deliverySummary = "";
    if (deliveryMethod === "parcel") {
      deliverySummary = meta.parcel_locker || "Paczkomat InPost";
    } else if (deliveryMethod === "pickup") {
      deliverySummary = meta.pickup_location || "Odbiór osobisty w pasiece";
    } else {
      deliverySummary = [meta.shipping_street, meta.shipping_postal_code, meta.shipping_city]
        .filter(Boolean)
        .join(", ");
    }

    return NextResponse.json({
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email,
      metadata: meta,
      line_items: session.line_items?.data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        amount_total: item.amount_total,
      })),
      // Enriched for success page
      orderRef: meta.orderRef || null,
      shippingCost,
      deliveryMethod,
      deliverySummary,
      customerName: meta.customer_name || null,
      customerPhone: meta.customer_phone || null,
    });
  } catch (err: any) {
    console.error("Error retrieving Stripe session:", err);
    return NextResponse.json({ error: "Nie znaleziono sesji" }, { status: 404 });
  }
}
