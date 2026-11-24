"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, CartItem } from "./types";
import { toast } from "sonner";

const CART_STORAGE_KEY = "jankesowa-pasieka-cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          let loaded = JSON.parse(saved);
          // Remove Pyłek pszczeli if present (product removed from offer)
          loaded = loaded.filter((item: any) => !item.name?.toLowerCase().includes("pyłek"));
          setItems(loaded);
        }
      } catch (error) {
        console.error("Błąd wczytywania koszyka:", error);
      }
    };

    loadCart();
    setIsLoaded(true);

    // Listen for external updates (other hook instances, other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        loadCart();
      }
    };

    const handleCartUpdated = (e: CustomEvent<CartItem[]>) => {
      if (e.detail) {
        setItems(e.detail);
      } else {
        loadCart();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cart-updated", handleCartUpdated as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cart-updated", handleCartUpdated as EventListener);
    };
  }, []);

  // Persist to localStorage + broadcast to other instances in same tab
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      // Notify other useCart hooks in the same tab so they update live
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: items }));
    }
  }, [items, isLoaded]);

  const nextCartItems = (current: CartItem[], product: Product, quantity: number = 1): CartItem[] => {
    const existing = current.findIndex((item) => item.id === product.id);

    if (existing !== -1) {
      const updated = [...current];
      const newQty = Math.min(updated[existing].quantity + quantity, product.inStock);
      updated[existing] = { ...updated[existing], quantity: newQty };
      return updated;
    }

    return [...current, { ...product, quantity: Math.min(quantity, product.inStock) }];
  };

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setItems((current) => nextCartItems(current, product, quantity));

    toast.success(`Dodano ${product.name} do koszyka`, {
      description: `${quantity} × ${product.price} zł`,
      action: {
        label: "Zobacz koszyk",
        onClick: () => {
          window.dispatchEvent(new CustomEvent("open-cart"));
        },
      },
    });
  }, []);

  /** Dodaje produkt, zapisuje koszyk i otwiera stronę dostawy — żeby wysyłka nie została pominięta. */
  const addToCartAndCheckout = useCallback((product: Product, quantity: number = 1) => {
    setItems((current) => {
      const next = nextCartItems(current, product, quantity);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error("Błąd zapisu koszyka:", error);
      }
      return next;
    });

    toast.success(`Dodano ${product.name} do koszyka`);
    window.location.href = "/koszyk";
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
    toast.error("Produkt usunięty z koszyka");
  }, []);

  const updateQuantity = useCallback((id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          const limitedQty = Math.min(newQuantity, item.inStock);
          return { ...item, quantity: limitedQty };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isInCart = useCallback(
    (id: number) => items.some((item) => item.id === id),
    [items]
  );

  return {
    items,
    addToCart,
    addToCartAndCheckout,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isInCart,
    isLoaded,
  };
}
