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
    setIsLoaded(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setItems((current) => {
      const existing = current.findIndex((item) => item.id === product.id);
      
      if (existing !== -1) {
        // Increase quantity
        const updated = [...current];
        const newQty = Math.min(updated[existing].quantity + quantity, product.inStock);
        updated[existing] = { ...updated[existing], quantity: newQty };
        return updated;
      } else {
        return [...current, { ...product, quantity: Math.min(quantity, product.inStock) }];
      }
    });

    toast.success(`Dodano ${product.name} do koszyka`, {
      description: `${quantity} × ${product.price} zł`,
      action: {
        label: "Zobacz koszyk",
        onClick: () => {
          // This will be handled by opening cart drawer via context or custom event if needed
          window.dispatchEvent(new CustomEvent("open-cart"));
        },
      },
    });
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
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isInCart,
    isLoaded,
  };
}
