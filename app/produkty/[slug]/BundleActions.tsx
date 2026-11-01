"use client";

import { useState } from "react";
import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { getBundleConfig, getBundleVarietiesFor, makeBundleCartProductFor, varietyShortName } from "@/lib/products";

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
        Możesz wybrać {cfg.count === 2 ? "dwa takie same miody" : "kilka takich samych miodów"}. Wysyłka kosztuje tyle samo co za jeden słoik.
      </p>
    </div>
  );
}
