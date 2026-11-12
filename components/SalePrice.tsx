import { getVisibleBundleSale } from "@/lib/products";

interface SalePriceProps {
  productId: number;
  price: number;
  unit?: string;
  size?: "card" | "page";
}

export default function SalePrice({ productId, price, unit, size = "card" }: SalePriceProps) {
  const sale = getVisibleBundleSale(productId);

  if (!sale) {
    if (size === "page") {
      return (
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-semibold text-brand-brown tabular-nums">
            {price} <span className="text-2xl align-super font-normal">zł</span>
          </div>
          {unit && <div className="text-brand-brown/70 text-lg ml-1">{unit}</div>}
        </div>
      );
    }
    return (
      <div className="text-2xl font-semibold tabular-nums text-brand-brown">
        {price} <span className="text-base align-super font-normal">zł</span>
      </div>
    );
  }

  if (size === "page") {
    return (
      <div className="space-y-1.5">
        <div className="text-lg text-brand-brown/55">
          <span className="mr-2">Osobno</span>
          <span className="line-through tabular-nums">{sale.regularPrice} zł</span>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <div className="text-sm font-medium text-brand-brown/70">W zestawie</div>
          <div className="text-4xl font-semibold text-brand-brown tabular-nums">
            {sale.price} <span className="text-2xl align-super font-normal">zł</span>
          </div>
          {unit && <div className="text-brand-brown/70 text-lg">{unit}</div>}
        </div>
        <div className="text-sm font-medium text-brand-gold">Oszczędzasz {sale.savings} zł</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm text-brand-brown/50">
        <span className="mr-1">Osobno</span>
        <span className="line-through tabular-nums">{sale.regularPrice} zł</span>
      </div>
      <div className="text-2xl font-semibold tabular-nums text-brand-brown leading-tight">
        {sale.price} <span className="text-base align-super font-normal">zł</span>
      </div>
      <div className="text-xs font-medium text-brand-gold mt-0.5">Oszczędzasz {sale.savings} zł</div>
    </div>
  );
}
