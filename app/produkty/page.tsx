"use client";

import { useState } from "react";
import { products, sortProductsForCatalog, getCandleProducts } from "@/lib/products";
import ShippingNote from "@/components/ShippingNote";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import Link from "next/link";

type CategoryFilter = "all" | "miody" | "zestawy" | "produkty";

export default function ProduktyPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const candleProducts = getCandleProducts();

  const filteredProducts = sortProductsForCatalog(
    activeFilter === "all"
      ? products
      : activeFilter === "miody"
        ? products.filter((p) => p.category === "miody" || p.category === "zestawy")
        : products.filter((p) => p.category === activeFilter)
  );

  const filters: { label: string; value: CategoryFilter }[] = [
    { label: "Wszystkie", value: "all" },
    { label: "Miody", value: "miody" },
    { label: "Zestawy", value: "zestawy" },
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
        <ShippingNote className="mb-8 max-w-3xl mx-auto" />
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

        {(activeFilter === "all" || activeFilter === "produkty") && (
          <section id="swiece" className="mb-12 scroll-mt-24">
            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 items-center bg-white border border-brand-brown/10 rounded-3xl overflow-hidden shadow-sm">
              <Link href="/produkty/zestaw-swiec-z-wosku-pszczelego" className="relative aspect-[5/4] bg-[#F5EDE4]">
                <Image
                  src="/images/swiece/swiece-wszystkie-5x4-foto.webp"
                  alt="Ręcznie odlewane świece z wosku pszczelego z Jankesowej Pasieki na białej tacy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </Link>
              <div className="px-6 pb-8 lg:py-8 lg:pr-10">
                <div className="uppercase text-xs tracking-[2px] text-brand-gold mb-2">Z NASZEJ PASIEKI</div>
                <h2 className="font-serif text-3xl sm:text-4xl text-brand-brown tracking-tight mb-3">
                  Świece z wosku pszczelego
                </h2>
                <p className="text-[#374151] leading-relaxed mb-3">
                  Ręcznie odlewane z naszego wosku, z pasieki w Topolnie na Kujawach: walec z motywem roślinnym,
                  aniołki, stare ule i walce z sercem. Bez parafiny i sztucznych zapachów.
                </p>
                <p className="text-sm text-brand-brown/70 mb-5">
                  Świece wliczają się do darmowej wysyłki od 95 zł, tak jak miód. W zestawach sam wybierasz, które świece mają w nich być.
                </p>
                <Link href="/produkty/zestaw-swiec-z-wosku-pszczelego" className="text-sm font-medium text-brand-gold hover:underline">
                  Zobacz zestaw i poszczególne świece →
                </Link>
              </div>
            </div>
            <div className="products-grid mt-8">
              {candleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.filter((product) => !candleProducts.some((c) => c.id === product.id)).map((product) => (
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
