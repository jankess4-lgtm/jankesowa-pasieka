"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type CategoryFilter = "all" | "miody" | "produkty";

export default function ProduktyPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

  const filteredProducts = activeFilter === "all" 
    ? products 
    : products.filter((p) => p.category === activeFilter);

  const filters: { label: string; value: CategoryFilter }[] = [
    { label: "Wszystkie", value: "all" },
    { label: "Miody", value: "miody" },
    { label: "Produkty pszczele", value: "produkty" },
  ];

  return (
    <div className="bg-[#F5EDE4] min-h-[80vh]">
      {/* Page Header */}
      <div className="bg-white border-b border-brand-brown/10 pt-14 pb-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="uppercase text-xs tracking-[3px] text-brand-gold mb-2">RĘCZNIE ZBIERANE</div>
          <h1 className="font-serif text-6xl text-brand-brown tracking-[-1.5px]">Nasza oferta</h1>
          <p className="mt-4 max-w-md mx-auto text-lg text-[#374151]">
            Najwyższej jakości miody i produkty pszczele. Bez pośpiechu. Bez kompromisów.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-9 justify-center">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={activeFilter === f.value ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(f.value)}
              className="rounded-full px-5"
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Info footer note */}
        <div className="text-center mt-14 text-sm text-brand-brown/60 max-w-md mx-auto">
          Wszystkie nasze miody są niepasteryzowane i pochodzą wyłącznie z własnych uli. 
          Dostępność może się zmieniać w zależności od sezonu.
        </div>
      </div>
    </div>
  );
}
