"use client";

import { useState } from "react";
import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { getBundleVarieties, makeBundleCartProduct, varietyShortName } from "@/lib/products";

export default function BundleActions() {
  const varieties = getBundleVarieties();
  const { addToCart } = useCart();
  const [first, setFirst] = useState<number>(varieties[0]?.id ?? 0);
  const [second, setSecond] = useState<number>(varieties[1]?.id ?? varieties[0]?.id ?? 0);

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
    const item = makeBundleCartProduct(first, second);
    if (item) addToCart(item);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "Pierwszy słoik (1,2 kg)", value: first, set: setFirst },
          { label: "Drugi słoik (1,2 kg)", value: second, set: setSecond },
        ].map((f) => (
          <label key={f.label} className="block text-sm text-brand-brown">
            <span className="block mb-1.5 font-medium">{f.label}</span>
            <select className={selectClass} value={f.value} onChange={(e) => f.set(Number(e.target.value))}>
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
        Dodaj zestaw do koszyka – 110 zł
      </Button>
      <p className="text-[11px] text-center text-brand-brown/60">
        Możesz wybrać dwa takie same miody. Wysyłka kosztuje tyle samo co za jeden słoik.
      </p>
    </div>
  );
}
