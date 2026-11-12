"use client";

import { useState } from "react";
import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { getBundleConfig, getBundleVarietiesFor, makeBundleCartProductFor, varietyShortName } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

const ORDINALS = ["Pierwszy", "Drugi", "Trzeci", "Czwarty", "Piąty"];
const COUNT_WORDS: Record<number, string> = { 2: "dwa", 3: "trzy" };

export default function BundleActions({ bundleId }: { bundleId: number }) {
  const cfg = getBundleConfig(bundleId)!;
  const varieties = getBundleVarietiesFor(cfg);
  const { addToCart } = useCart();
  const [choices, setChoices] = useState<number[]>(() =>
    Array.from({ length: cfg.count }, (_, i) => varieties[i % Math.max(varieties.length, 1)]?.id ?? 0)
  );

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
    const item = makeBundleCartProductFor(cfg, choices);
    if (item) addToCart(item);
  };

  return (
    <div className="space-y-4">
      <div className={`grid gap-3 ${cfg.count === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {choices.map((value, i) => (
          <label key={i} className="block text-sm text-brand-brown">
            <span className="block mb-1.5 font-medium">{ORDINALS[i]} słoik ({cfg.jarShort})</span>
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
                  Miód {varietyShortName(v)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <Button onClick={handleAdd} size="lg" className="w-full gap-2">
        <ShoppingCart className="w-4 h-4" />
        Dodaj zestaw do koszyka – {cfg.price} zł
      </Button>
      <p className="text-[11px] text-center text-brand-brown/60">
        Możesz wybrać {cfg.count === 2 ? "dwa takie same miody" : "kilka takich samych miodów"}.
        {cfg.price >= FREE_SHIPPING_THRESHOLD
          ? " W tym zestawie wysyłka jest już darmowa."
          : " Wysyłka kosztuje tyle samo co za jeden słoik."}
      </p>

      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-brand-brown/15 bg-[#F5EDE4]/95 backdrop-blur-md px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(60,40,20,0.10)]">
        <Button onClick={handleAdd} className="w-full max-w-lg mx-auto py-3 gap-2">
          <ShoppingCart className="w-4 h-4" />
          Dodaj zestaw – {cfg.price} zł
        </Button>
      </div>
    </div>
  );
}
