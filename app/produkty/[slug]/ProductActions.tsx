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

  const inCart = isInCart(product.id);

  const buttons = (
    <>
      <div className="flex gap-3">
        <Button
          onClick={() => addToCart(product)}
          size="lg"
          variant={inCart ? "outline" : "primary"}
          className="flex-1 gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {inCart ? "Dodano do koszyka" : "Dodaj do koszyka"}
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
    </>
  );

  return (
    <div className="space-y-3">
      {buttons}

      <p className="text-[10px] text-center text-brand-brown/50">
        Płatność kartą, BLIK lub Przelewy24 • Szybka dostawa
      </p>

      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-brand-brown/15 bg-[#F5EDE4]/95 backdrop-blur-md px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(60,40,20,0.10)]">
        <div className="flex gap-2 max-w-lg mx-auto">
          <Button
            onClick={() => addToCart(product)}
            variant={inCart ? "outline" : "primary"}
            className="flex-1 gap-2 py-3"
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? "Dodano" : "Dodaj do koszyka"}
          </Button>
          <Button
            onClick={() => addToCartAndCheckout(product)}
            variant="outline"
            className="flex-1 gap-2 py-3 border-brand-gold/70 text-brand-brown"
          >
            Zapłać
          </Button>
        </div>
      </div>
    </div>
  );
}
