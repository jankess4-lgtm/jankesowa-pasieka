"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/lib/useCart";
import { Button } from "./ui/Button";
import { toast } from "sonner";
import Image from "next/image";
import { startStripeCheckout } from "@/lib/stripeCheckout";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    // Direct users to full checkout form for complete delivery details
    // Use full navigation to ensure /koszyk page loads with fresh cart state from localStorage
    setIsCheckingOut(true);
    window.location.href = "/koszyk";
  };

  const shippingCost = totalPrice > 150 ? 0 : 14;
  const finalTotal = totalPrice + shippingCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="cart-drawer fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#F5EDE4] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-brown/15 bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brand-brown" />
                <div>
                  <h2 className="font-serif text-xl text-brand-brown">Twój koszyk</h2>
                  <p className="text-xs text-brand-brown/60">{items.length} pozycji</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-brand-cream transition"
                aria-label="Zamknij koszyk"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center mb-6">
                  <ShoppingBag className="w-9 h-9 text-brand-brown/40" />
                </div>
                <p className="text-lg text-brand-brown/80 mb-1">Twój koszyk jest pusty</p>
                <p className="text-sm text-brand-brown/60 mb-8">Nie masz jeszcze produktów w koszyku. Dodaj wybrane miody i produkty pszczele</p>
                <Button variant="secondary" onClick={onClose}>
                  Przeglądaj ofertę
                </Button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-white p-4 rounded-xl border border-brand-creamDark"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-cream flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-brand-brown leading-tight pr-2">{item.name}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-brand-brown/50 hover:text-red-600 transition p-1"
                            aria-label="Usuń"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-brand-brown/20 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-brand-brown hover:bg-brand-cream rounded-l-md active:bg-brand-creamDark transition"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-sm font-medium tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-brand-brown hover:bg-brand-cream rounded-r-md active:bg-brand-creamDark transition"
                              disabled={item.quantity >= item.inStock}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="font-semibold text-brand-brown tabular-nums">
                            {item.price * item.quantity} zł
                          </p>
                        </div>
                        {item.quantity >= item.inStock && (
                          <p className="text-[10px] text-amber-600 mt-1">Maksymalna dostępna ilość</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t border-brand-brown/15 bg-white p-6 space-y-4">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-brand-brown/70">
                      <span>Wartość produktów</span>
                      <span className="tabular-nums">{totalPrice} zł</span>
                    </div>
                    <div className="flex justify-between text-brand-brown/70">
                      <span className="flex items-center gap-1.5">
                        Dostawa
                        {shippingCost === 0 && <span className="text-emerald-600 text-xs">(darmowa)</span>}
                      </span>
                      <span className="tabular-nums">{shippingCost} zł</span>
                    </div>
                    <div className="h-px bg-brand-creamDark my-1" />
                    <div className="flex justify-between text-lg font-semibold text-brand-brown pt-1">
                      <span>Do zapłaty</span>
                      <span className="tabular-nums">{finalTotal} zł</span>
                    </div>
                  </div>

                  <div className="text-xs bg-brand-cream p-3 rounded-lg text-brand-brown/80">
                    Koszt dostawy: 14–16 zł (zależnie od metody). Szczegóły przy finalizacji.
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full py-3 text-base gap-2"
                    disabled={isCheckingOut}
                  >
                    <CreditCard className="w-4 h-4" />
                    {isCheckingOut ? "Przekierowanie do płatności..." : "Zapłać"}
                  </Button>

                  <p className="text-[10px] text-center text-brand-brown/50 leading-snug">
                    Bezpieczna płatność online kartą, BLIK lub Przelewy24.<br />
                    Po opłaceniu skontaktujemy się w sprawie dostawy.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
