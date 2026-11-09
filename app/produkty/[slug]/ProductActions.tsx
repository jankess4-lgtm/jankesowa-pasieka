"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/lib/useCart";
import { useLiveStock } from "@/lib/useLiveStock";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";

interface ProductActionsProps {
  product: Product;
  isAvailable: boolean;
}

export default function ProductActions({ product: baseProduct, isAvailable: baseAvailable }: ProductActionsProps) {
  const live = useLiveStock(baseProduct.id);
  const product = live === undefined ? baseProduct : { ...baseProduct, inStock: live };
  const soldOut = baseAvailable && live === 0;
  const isAvailable = baseAvailable && !soldOut;
  const { addToCart, addToCartAndCheckout, isInCart } = useCart();

  if (!isAvailable) {
    return (
      <div className="space-y-3">
        <Button disabled size="lg" className="w-full">
          {soldOut ? "Chwilowo niedostępny" : "Wkrótce dostępny"}
        </Button>
        <p className="text-xs text-center text-brand-brown/50">
          {soldOut ? "Ten miód właśnie się wyprzedał – wkrótce uzupełnimy zapas. Zadzwoń: +48 514 070 298." : "Ten miód jest dostępny tylko sezonowo. Zapraszamy w odpowiednim terminie!"}
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
        onClick={() => addToCartAndCheckout(product)}
        size="lg"
        variant="outline"
        className="w-full gap-2 border-brand-gold/70 text-brand-brown hover:bg-brand-gold/5"
      >
        <ShoppingCart className="w-4 h-4" />
        Zapłać
      </Button>

      <p className="text-[10px] text-center text-brand-brown/50">
        Płatność kartą, BLIK lub Przelewy24 • Szybka dostawa
      </p>
    </div>
  );
}
