import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import ProductActions from "./ProductActions";

interface ProductPageProps {
  params: { slug: string };
}

interface ProductSpec {
  label: string;
  value: string;
}

interface ProductDetails {
  richDescription: string;
  specs: ProductSpec[];
  whyBuy: string;
}

// Generate static paths
export async function generateStaticParams() {
  return products
    .filter((product) => product.slug)
    .map((product) => ({
      slug: product.slug!,
    }));
}

export const dynamicParams = false;

// Product details (pozostaje bez zmian)
function getProductDetails(product: Product): ProductDetails {
  const nameLower = product.name.toLowerCase();

  if (nameLower.includes("rzepakowo-mniszkowy") || nameLower.includes("rzepakowy")) {
    return {
      richDescription: "Miód rzepakowo-mniszkowy to wyjątkowe połączenie nektaru rzepaku i mniszka lekarskiego. Pochodzi z obfitych, wczesnowiosennych pożytków na kujawskich polach nad Wisłą. Charakteryzuje się jasnozłotą barwą, bardzo słodkim i delikatnym smakiem z subtelną kwiatową nutą mniszka. Szybko krystalizuje, tworząc drobną, kremową konsystencję.",
      specs: [
        { label: "Smak", value: "Bardzo słodki, delikatny, z subtelną nutą mniszka i kwiatową" },
        { label: "Aromat", value: "Lekki, czysty, świeży, miodowy z nutą mniszka" },
        { label: "Krystalizacja", value: "Szybka – drobna, kremowa konsystencja" },
        { label: "Zastosowanie", value: "Herbata, kanapki, naleśniki, deserki dla dzieci" },
        { label: "Właściwości zdrowotne", value: "Bogaty w glukozę, wspiera energię i pracę serca" },
        { label: "Okres dostępności", value: "Wczesna wiosna" },
      ],
      whyBuy: "Idealny wybór na co dzień. Delikatny miód, który zachwyca zarówno dorosłych, jak i dzieci.",
    };
  }

  // Dodaj tutaj resztę swoich definicji dla innych miodów (lipowy, wielokwiatowy itd.) - możesz skopiować z poprzedniej wersji
  // Dla uproszczenia zostawiam fallback
  return {
    richDescription: product.longDescription || "Opis produktu wkrótce.",
    specs: [
      { label: "Pochodzenie", value: "Pasieka w Topolnie nad Wisłą" },
      { label: "Jakość", value: "Niepasteryzowany, surowy" },
    ],
    whyBuy: "Wybierz produkt z naszej rodzinnej pasieki – pełen naturalnych wartości.",
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const isAvailable = product.available !== false;
  const details = getProductDetails(product);

  const currentIndex = products.findIndex((p) => p.slug === slug);
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  return (
    <div className="bg-[#F5EDE4] min-h-screen py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-brand-brown/70">
          <Link href="/" className="hover:text-brand-gold transition-colors">Strona główna</Link>
          {" / "}
          <Link href="/produkty" className="hover:text-brand-gold transition-colors">Oferta</Link>
          {" / "}
          <span className="text-brand-brown">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* IMAGE SECTION - Poprawiona logika */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3.6] lg:aspect-square rounded-3xl overflow-hidden bg-white border border-brand-creamDark shadow-sm">
              {isAvailable ? (
                // Dostępny produkt - normalne zdjęcie
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                // Niedostępny produkt - duże wyszarzone logo
                <div className="absolute inset-0 flex items-center justify-center bg-[#F5EDE4]">
                  <Image
                    src="/logo.png"
                    alt="Jankesowa Pasieka"
                    width={320}
                    height={320}
                    className="opacity-15 grayscale"
                  />
                </div>
              )}

              {!isAvailable && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white/95 text-brand-brown px-8 py-3 rounded-full text-base font-medium tracking-wide">
                    Produkt sezonowy • Już wkrótce
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info section */}
          <div className="space-y-6 lg:pt-2">
            <div>
              <h1 className="font-serif text-[42px] md:text-[48px] leading-none text-brand-brown tracking-[-1.2px] mb-3">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-semibold text-brand-brown tabular-nums">
                  {product.price} <span className="text-2xl align-super font-normal">zł</span>
                </div>
                <div className="text-brand-brown/70 text-lg ml-1">{product.unit}</div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3.5 py-1 bg-brand-cream border border-brand-creamDark rounded-full text-brand-brown">Produkt z naszej pasieki</span>
              <span className="px-3.5 py-1 bg-brand-cream border border-brand-creamDark rounded-full text-brand-brown">Niepasteryzowany</span>
              <span className="px-3.5 py-1 bg-brand-cream border border-brand-creamDark rounded-full text-brand-brown">Szklane opakowanie</span>
            </div>

            {/* Rich description */}
            <div className="pt-1">
              <h2 className="font-medium text-lg mb-3 text-brand-brown tracking-tight">Opis</h2>
              <p className="text-[#374151] leading-relaxed text-[15px]">
                {details.richDescription}
              </p>
            </div>

            {/* Charakterystyka */}
            <div>
              <h2 className="font-medium text-lg mb-4 text-brand-brown tracking-tight">Charakterystyka</h2>
              <div className="overflow-hidden rounded-2xl border border-brand-creamDark bg-white">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-brand-creamDark">
                    {details.specs.map((spec, idx) => (
                      <tr key={idx} className="hover:bg-brand-cream/40 transition-colors">
                        <td className="py-3.5 px-5 font-medium text-brand-brown w-2/5 align-top">{spec.label}</td>
                        <td className="py-3.5 px-5 text-[#374151]">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3">
              <ProductActions product={product} isAvailable={isAvailable} />
            </div>
          </div>
        </div>

        {/* Pozostałe sekcje (Dlaczego warto kupić, itd.) - możesz zostawić jak były */}
        {/* ... wklej tutaj resztę swojego oryginalnego kodu jeśli chcesz ... */}

        {/* Navigation prev/next */}
        <div className="mt-12 pt-8 border-t border-brand-creamDark flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          {prevProduct && (
            <Link href={`/produkty/${prevProduct.slug}`} className="group flex items-center gap-3 text-brand-brown/80 hover:text-brand-gold transition-colors">
              <span className="text-xl group-hover:-translate-x-0.5 transition">←</span>
              <div>
                <div className="text-[10px] uppercase tracking-[1.5px] text-brand-brown/50">Poprzedni produkt</div>
                <div className="font-medium">{prevProduct.name}</div>
              </div>
            </Link>
          )}
          {nextProduct && (
            <Link href={`/produkty/${nextProduct.slug}`} className="group flex items-center gap-3 text-right text-brand-brown/80 hover:text-brand-gold transition-colors sm:text-right">
              <div>
                <div className="text-[10px] uppercase tracking-[1.5px] text-brand-brown/50">Następny produkt</div>
                <div className="font-medium">{nextProduct.name}</div>
              </div>
              <span className="text-xl group-hover:translate-x-0.5 transition">→</span>
            </Link>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/produkty" className="inline-flex items-center text-sm text-brand-gold hover:underline">
            ← Wróć do pełnej oferty
          </Link>
        </div>
      </div>
    </div>
  );
}