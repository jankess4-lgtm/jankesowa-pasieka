import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const resend = new Resend(process.env.RESEND_API_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderInfo = {
      orderId: session.metadata?.orderRef || session.id.slice(-8).toUpperCase(),
      customerName: session.customer_details?.name || "Brak imienia",
      customerEmail: session.customer_details?.email || session.customer_email,
      customerPhone: session.metadata?.customer_phone || "Brak",
      totalAmount: (session.amount_total || 0) / 100,
      deliveryMethod: session.metadata?.delivery_method || "Nie określono",
      parcelLocker: session.metadata?.parcel_locker,
      address: session.metadata?.shipping_street ? 
        `${session.metadata.shipping_street}, ${session.metadata.shipping_postal_code} ${session.metadata.shipping_city}` : null,
    };

    console.log("✅ NOWE ZAMÓWIENIE:", orderInfo);

    // Wysyłanie profesjonalnego emaila do Ciebie
    await sendAdminEmail(orderInfo);
  }

  return NextResponse.json({ received: true });
}

async function sendAdminEmail(order: any) {
  try {
    await resend.emails.send({
      from: "Jankesowa Pasieka <zamowienia@jankesowapasieka.pl>",
      to: "jankesowa.pasieka@gmail.com",
      subject: `Nowe zamówienie #${order.orderId} - ${order.totalAmount} zł`,
      html: `
        <h2>Nowe zamówienie w Jankesowej Pasiece</h2>
        <p><strong>Numer zamówienia:</strong> ${order.orderId}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('pl-PL')}</p>
        
        <h3>Dane klienta</h3>
        <p><strong>Imię i nazwisko:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Telefon:</strong> ${order.customerPhone}</p>
        
        <h3>Zamówienie</h3>
        <p><strong>Kwota:</strong> ${order.totalAmount} zł</p>
        
        <h3>Dostawa</h3>
        <p><strong>Metoda:</strong> ${order.deliveryMethod}</p>
        ${order.parcelLocker ? `<p><strong>Paczkomat:</strong> ${order.parcelLocker}</p>` : ''}
        ${order.address ? `<p><strong>Adres:</strong> ${order.address}</p>` : ''}
        
        <hr>
        <p>Pełne szczegóły zamówienia znajdziesz w Stripe Dashboard.</p>
      `,
    });

    console.log("📧 Email do sprzedawcy wysłany pomyślnie!");
  } catch (error) {
    console.error("Błąd wysyłania emaila:", error);
  }
}