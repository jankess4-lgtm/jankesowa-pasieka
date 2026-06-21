import { loadStripe } from "@stripe/stripe-js";
import { CartItem } from "./types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function startStripeCheckout(items: CartItem[] | any[]) {
  if (!items || items.length === 0) {
    throw new Error("Koszyk jest pusty");
  }

  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        unit: item.unit,
      })),
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.sessionId) {
    throw new Error(data.error || "Nie udało się utworzyć sesji płatności");
  }

  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error("Nie udało się załadować Stripe");
  }

  const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
  if (error) {
    throw error;
  }
}
