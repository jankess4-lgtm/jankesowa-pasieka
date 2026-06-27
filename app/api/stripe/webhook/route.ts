import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const resend = new Resend(process.env.RESEND_API_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Pobieramy pełne line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    const orderInfo = {
      orderId: session.metadata?.orderRef || session.id.slice(-8).toUpperCase(),
      customerName: session.customer_details?.name || 
                   session.shipping_details?.name || 
                   "Nie podano",
      customerEmail: session.customer_details?.email || 
                     session.customer_email || 
                     "Brak",
      customerPhone: session.metadata?.customer_phone || 
                     session.customer_details?.phone || 
                     "Brak",
      totalAmount: (session.amount_total || 0) / 100,
      deliveryMethod: session.metadata?.delivery_method || "Nie określono",
      parcelLocker: session.metadata?.parcel_locker,
      address: session.shipping_details?.address 
        ? `${session.shipping_details.address.line1 || ''}, ${session.shipping_details.address.postal_code || ''} ${session.shipping_details.address.city || ''}`
        : null,
      products: lineItems.data.map(item => ({
        name: item.description || "Produkt",
        quantity: item.quantity || 1,
        amount: (item.amount_total || 0) / 100
      }))
    };

    console.log("✅ NOWE ZAMÓWIENIE OTRZYMANE:", JSON.stringify(orderInfo, null, 2));

    await sendAdminEmail(orderInfo);
  }

  return NextResponse.json({ received: true });
}

// Ostateczna funkcja
async function sendAdminEmail(order: any) {
  try {
    let productsHtml = order.products.map((p: any) => 
      `<li>${p.quantity} × ${p.name} — ${p.amount} zł</li>`
    ).join('');

    const result = await resend.emails.send({
      from: "Jankesowa Pasieka <zamowienia@jankesowapasieka.pl>",
      to: "jankesowa.pasieka@gmail.com",
      replyTo: "jankesowa.pasieka@gmail.com",
      subject: `Nowe zamówienie #${order.orderId} — ${order.totalAmount} zł`,
      html: `
        <h2>Nowe zamówienie w Jankesowej Pasiece</h2>
        <p><strong>Numer zamówienia:</strong> ${order.orderId}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('pl-PL')}</p>
        
        <h3>Dane klienta</h3>
        <ul>
          <li><strong>Imię i nazwisko:</strong> ${order.customerName}</li>
          <li><strong>Email:</strong> ${order.customerEmail}</li>
          <li><strong>Telefon:</strong> ${order.customerPhone}</li>
        </ul>
        
        <h3>Zamówione produkty</h3>
        <ul>${productsHtml}</ul>
        
        <h3>Razem do zapłaty: <strong>${order.totalAmount} zł</strong></h3>
        
        <h3>Dostawa</h3>
        <p><strong>Metoda:</strong> ${order.deliveryMethod === "parcel" ? "Paczkomat InPost" : order.deliveryMethod}</p>
        ${order.parcelLocker ? `<p><strong>Paczkomat:</strong> ${order.parcelLocker}</p>` : ''}
        ${order.address ? `<p><strong>Adres:</strong> ${order.address}</p>` : ''}
        
        <hr>
        <p>Szczegóły zamówienia znajdziesz w <a href="https://dashboard.stripe.com">Stripe Dashboard</a>.</p>
      `,
    });

    console.log(`📧 Email wysłany pomyślnie! ID: ${result.data?.id || 'brak ID'}`);
  } catch (error: any) {
    console.error("❌ BŁĄD WYSYŁANIA EMAILA:", error.message);
    console.error("Pełny obiekt błędu:", JSON.stringify(error, null, 2));
  }
}