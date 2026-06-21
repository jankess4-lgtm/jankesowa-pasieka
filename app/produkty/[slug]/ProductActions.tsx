"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, CreditCard } from "lucide-react";
import { startStripeCheckout } from "@/lib/stripeCheckout";

interface ProductActionsProps {
  product: Product;
  isAvailable: boolean;
}

export default function ProductActions({ product, isAvailable }: ProductActionsProps) {
  const { addToCart, isInCart } = useCart();
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const handleStripeCheckout = async () => {
    if (!isAvailable) return;

    setIsStripeLoading(true);

    try {
      await startStripeCheckout([{
        ...product,
        quantity: 1,
      } as any]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Nie udało się rozpocząć płatności Stripe. Spróbuj ponownie.");
    } finally {
      setIsStripeLoading(false);
    }
  };

  if (!isAvailable) {
    return (
      <div className="space-y-3">
        <Button disabled size="lg" className="w-full">
          Produkt sezonowy – już wkrótce
        </Button>
        <p className="text-xs text-center text-brand-brown/50">
          Ten miód jest dostępny tylko sezonowo. Zapraszamy w odpowiednim terminie!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Button
          onClick={() => addToCart(product)}
          size="lg"
          variant={isInCart(product.id) ? "outline" : "primary"}
          className="flex-1 gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {isInCart(product.id) ? "Dodano do koszyka" : "Dodaj do koszyka"}
        </Button>
      </div>

      <Button
        onClick={handleStripeCheckout}
        size="lg"
        variant="outline"
        disabled={isStripeLoading}
        className="w-full gap-2 border-brand-gold/70 text-brand-brown hover:bg-brand-gold/5"
      >
        <CreditCard className="w-4 h-4" />
        {isStripeLoading ? "Przekierowanie do Stripe..." : "Zapłać przez Stripe"}
      </Button>

      <p className="text-[10px] text-center text-brand-brown/50">
        Płatność kartą, BLIK lub Przelewy24 • Szybka dostawa
      </p>
    </div>
  );
}
