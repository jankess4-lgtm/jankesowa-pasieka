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

  return (
    <div className={`product-card group flex flex-col h-full shadow-md hover:shadow-lg ${!isAvailable ? 'grayscale-[0.85] opacity-90' : 'hover:-translate-y-0.5'}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream rounded-xl shadow-md group-hover:shadow-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 rounded-xl ${!isAvailable ? '' : 'group-hover:scale-105'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Image 
              src="/images/logo.png" 
              alt="Logo Jankesowa Pasieka" 
              width={70} 
              height={70} 
              className="opacity-35 grayscale" 
            />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="gold">{product.category === "miody" ? "Miód" : "Produkt"}</Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="mb-auto">
          <h3 className="font-serif text-xl leading-tight text-brand-brown mb-1.5">{product.name}</h3>
          {!isAvailable && (
            <p className="text-xs text-gray-500 mb-1">Produkt sezonowy - już wkrótce</p>
          )}
          <div className="text-sm text-brand-brown/60 mb-1">{product.unit}</div>
          <p className="text-sm text-[#374151] line-clamp-3 mb-4">{product.description}</p>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-brand-creamDark mt-auto">
          <div>
            <div className="text-2xl font-semibold tabular-nums text-brand-brown">{product.price} <span className="text-base align-super font-normal">zł</span></div>
          </div>

          <Button
            onClick={() => isAvailable && addToCart(product)}
            size="sm"
            variant={isAvailable ? (isInCart(product.id) ? "outline" : "primary") : "ghost"}
            disabled={!isAvailable}
            className={`gap-2 ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAvailable && <ShoppingCart className="w-3.5 h-3.5" />}
            {isAvailable ? (isInCart(product.id) ? "Dodano" : "Dodaj") : "Niedostępny"}
          </Button>
        </div>
      </div>
    </div>
  );
}
