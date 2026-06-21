"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/lib/useCart";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const isAvailable = product.available !== false;

  // UNAVAILABLE PRODUCT — full card faded logo, no product photo, desaturated, elegant message
  if (!isAvailable) {
    return (
      <div className="product-card flex flex-col h-full shadow-md bg-[#F8F4EF] border-[#EDE4D6] relative overflow-hidden">
        {/* Large faded / desaturated logo covering the majority of the entire card */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
          <Image
            src="/logo.png"
            alt=""
            width={300}
            height={112}
            className="w-[85%] max-w-[265px] h-auto grayscale opacity-[0.20] -translate-y-[2%]"
          />
        </div>

        <div className="relative z-10 flex flex-col flex-1 px-5 pt-3 pb-5">
          <div className="mb-auto">
            <h3 className="font-serif text-xl leading-tight text-brand-brown/70 mb-2 pr-2">{product.name}</h3>

            {/* Elegant seasonal message */}
            <div className="mb-2.5">
              <span className="inline-block text-[11.5px] tracking-[2.2px] text-[#8A714D]/65 font-medium">
                Produkt sezonowy • Już wkrótce
              </span>
            </div>

            <div className="text-sm text-brand-brown/40 mb-0.5">{product.unit}</div>
            <p className="text-sm text-[#685B4C] line-clamp-3 mb-3 pr-1">{product.description}</p>
          </div>

          <div className="flex items-end justify-between pt-3.5 border-t border-[#EDE4D6] mt-auto">
            <div>
              <div className="text-2xl font-semibold tabular-nums text-brand-brown/55">
                {product.price} <span className="text-base align-super font-normal">zł</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              disabled
              className="gap-2 opacity-40 cursor-not-allowed bg-[#EDE4D6] text-[#8F7657] hover:bg-[#EDE4D6] active:bg-[#EDE4D6]"
            >
              Dodaj do koszyka
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // AVAILABLE PRODUCTS — unchanged, full color photos and active button
  return (
    <div className="product-card group flex flex-col h-full shadow-md hover:shadow-lg hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream rounded-xl shadow-md group-hover:shadow-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 rounded-xl group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="gold">{product.category === "miody" ? "Miód" : "Produkt"}</Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="mb-auto">
          <h3 className="font-serif text-xl leading-tight text-brand-brown mb-1.5">{product.name}</h3>
          <div className="text-sm text-brand-brown/60 mb-1">{product.unit}</div>
          <p className="text-sm text-[#374151] line-clamp-3 mb-4">{product.description}</p>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-brand-creamDark mt-auto">
          <div>
            <div className="text-2xl font-semibold tabular-nums text-brand-brown">{product.price} <span className="text-base align-super font-normal">zł</span></div>
          </div>

          <Button
            onClick={() => addToCart(product)}
            size="sm"
            variant={isInCart(product.id) ? "outline" : "primary"}
            className="gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isInCart(product.id) ? "Dodano" : "Dodaj"}
          </Button>
        </div>
      </div>
    </div>
  );
}
