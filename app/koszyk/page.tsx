"use client";

import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function KoszykPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const shipping = totalPrice > 150 ? 0 : 14;
  const total = totalPrice + shipping;

  const handleCheckout = () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);

    setTimeout(() => {
      toast.success("Zamówienie zostało złożone!", {
        description: `Numer zamówienia: #JP-${Date.now().toString().slice(-6)}. Dziękujemy!`,
      });
      clearCart();
      setIsCheckingOut(false);
    }, 1250);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5EDE4] px-6">
        <div className="text-center max-w-xs">
          <div className="mx-auto w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🪴</span>
          </div>
          <h1 className="font-serif text-3xl text-brand-brown mb-3">Koszyk jest pusty</h1>
          <p className="text-brand-brown/70 mb-8">Dodaj wybrane miody ze strony oferty.</p>
          <Link href="/produkty">
            <Button variant="secondary">Przejdź do oferty</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EDE4] py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/produkty" className="text-sm text-brand-brown/70 hover:text-brand-brown flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Powrót do oferty
          </Link>
        </div>

        <h1 className="font-serif text-5xl text-brand-brown tracking-tight mb-9">Koszyk</h1>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Items list */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-brand-creamDark rounded-2xl p-5 flex gap-5">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-brand-cream flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-medium text-lg leading-tight text-brand-brown">{item.name}</p>
                      <p className="text-xs text-brand-brown/60 mt-px">{item.unit}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500/70 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="inline-flex items-center rounded-lg border border-brand-brown/20 text-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        className="px-3 py-2 active:bg-brand-cream rounded-l-lg disabled:opacity-40"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={15} />
                      </button>
                      <span className="px-4 tabular-nums font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className="px-3 py-2 active:bg-brand-cream rounded-r-lg disabled:opacity-40"
                        disabled={item.quantity >= item.inStock}
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-semibold tabular-nums text-brand-brown">{item.price * item.quantity} zł</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white rounded-2xl border border-brand-creamDark p-7">
              <h3 className="font-medium text-xl text-brand-brown mb-6">Podsumowanie</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-brown/70">Wartość produktów</span>
                  <span className="tabular-nums">{totalPrice} zł</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-brown/70">Dostawa</span>
                  <span className="tabular-nums">{shipping === 0 ? "Darmowa" : `${shipping} zł`}</span>
                </div>
              </div>

              <div className="my-6 border-t border-brand-creamDark" />

              <div className="flex justify-between items-baseline mb-7">
                <span className="text-lg">Do zapłaty</span>
                <span className="text-4xl font-semibold tabular-nums text-brand-brown">{total} <span className="text-base font-normal">zł</span></span>
              </div>

              <Button 
                onClick={handleCheckout} 
                className="w-full py-4 text-base" 
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Przetwarzamy zamówienie..." : "Złóż zamówienie"}
              </Button>

              <div className="mt-4 text-center text-[10px] leading-snug text-brand-brown/60">
                Płatność przy odbiorze lub przelewem na konto.<br />Dostawa kurierem lub odbiór osobisty w Jankowie.
              </div>

              <button 
                onClick={clearCart} 
                className="text-xs text-red-600/80 hover:text-red-600 block mx-auto mt-6"
              >
                Wyczyść koszyk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
