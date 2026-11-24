"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import {
  getCandleBundleConfig,
  getCandleVarieties,
  makeCandleBundleCartProduct,
  candleShortName,
  candleBundlePrice,
  candleBundleSinglesTotal,
} from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

const FEMININE_ORDINALS = ["Pierwsza", "Druga", "Trzecia", "Czwarta", "Piąta", "Szósta", "Siódma"];

export default function CandleBundleActions({ bundleId }: { bundleId: number }) {
  const cfg = getCandleBundleConfig(bundleId)!;
  const varieties = getCandleVarieties();
  const { addToCart } = useCart();
  const [choices, setChoices] = useState<number[]>(() =>
    cfg.defaultIds.length === cfg.count
      ? [...cfg.defaultIds]
      : Array.from({ length: cfg.count }, (_, i) => varieties[i % Math.max(varieties.length, 1)]?.id ?? 0)
  );

  const chosen = useMemo(
    () => choices.map((id) => varieties.find((p) => p.id === id)).filter(Boolean),
    [choices, varieties]
  );
  const ready = chosen.length === cfg.count;
  const singlesTotal = ready ? candleBundleSinglesTotal(chosen as typeof varieties) : cfg.price;
  const payPrice = ready ? candleBundlePrice(cfg, chosen as typeof varieties) : cfg.price;
  const cheaperThanSet = ready && singlesTotal < cfg.price;
  const savings = ready && singlesTotal > payPrice ? singlesTotal - payPrice : 0;

  if (varieties.length === 0) {
    return (
      <Button disabled size="lg" className="w-full">
        Chwilowo niedostępny
      </Button>
    );
  }

  const selectClass =
    "w-full rounded-xl border border-brand-creamDark bg-white px-4 py-3 text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/50";

  const handleAdd = () => {
    const item = makeCandleBundleCartProduct(cfg, choices);
    if (item) addToCart(item);
  };

  return (
    <div className="space-y-4">
      <div className={`grid gap-3 ${cfg.count === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {choices.map((value, i) => (
          <label key={i} className="block text-sm text-brand-brown">
            <span className="block mb-1.5 font-medium">{FEMININE_ORDINALS[i] || `Świeca ${i + 1}`} świeca</span>
            <select
              className={selectClass}
              value={value}
              onChange={(e) => {
                const v = Number(e.target.value);
                setChoices((prev) => prev.map((c, j) => (j === i ? v : c)));
              }}
            >
              {varieties.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} – {v.price} zł
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-brand-creamDark bg-white/70 px-4 py-3 text-sm text-brand-brown">
        {cheaperThanSet ? (
          <p>
            Do zapłaty <span className="font-semibold tabular-nums">{payPrice} zł</span>
            {" "}— mniej niż cena zestawu ({cfg.price} zł), bo te świece osobno kosztują {singlesTotal} zł.
          </p>
        ) : (
          <p>
            Do zapłaty <span className="font-semibold tabular-nums">{payPrice} zł</span>
            {savings > 0 ? ` zamiast ${singlesTotal} zł za świece osobno (oszczędzasz ${savings} zł).` : "."}
          </p>
        )}
      </div>

      <Button onClick={handleAdd} size="lg" className="w-full gap-2" disabled={!ready}>
        <ShoppingCart className="w-4 h-4" />
        Dodaj zestaw do koszyka – {payPrice} zł
      </Button>
      <p className="text-[11px] text-center text-brand-brown/60">
        Możesz wybrać kilka takich samych świec.
        {payPrice >= FREE_SHIPPING_THRESHOLD
          ? " W tym zestawie wysyłka jest już darmowa."
          : " Świece wliczają się do darmowej wysyłki od 95 zł."}
      </p>

      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-brand-brown/15 bg-[#F5EDE4]/95 backdrop-blur-md px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(60,40,20,0.10)]">
        <Button onClick={handleAdd} className="w-full max-w-lg mx-auto py-3 gap-2" disabled={!ready}>
          <ShoppingCart className="w-4 h-4" />
          Dodaj zestaw – {payPrice} zł
        </Button>
      </div>
    </div>
  );
}
