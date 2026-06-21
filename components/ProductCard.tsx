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

  return (
    <div className="product-card group flex flex-col h-full shadow-md hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream rounded-xl shadow-md group-hover:shadow-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="gold">{product.category === "miody" ? "Miód" : "Produkt"}</Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="mb-auto">
          <h3 className="font-serif text-xl leading-tight text-brand-brown mb-1.5">{product.name}</h3>
          <p className="text-sm text-[#374151] line-clamp-3 mb-4">{product.description}</p>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-brand-creamDark mt-auto">
          <div>
            <div className="text-xs text-brand-brown/60">{product.unit}</div>
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
