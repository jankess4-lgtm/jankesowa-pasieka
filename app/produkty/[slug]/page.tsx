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

// Product details - pełne tabele dla wszystkich miodów
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
        { label: "Właściwości zdrowotne", value: "Bogaty w glukozę, wspiera energię i pracę serca, łagodny dla żołądka" },
        { label: "Okres dostępności", value: "Wczesna wiosna (maj-czerwiec)" },
      ],
      whyBuy: "Idealny wybór na co dzień. Delikatny miód, który zachwyca zarówno dorosłych, jak i dzieci.",
    };
  }

  if (nameLower.includes("lipowy")) {
    return {
      richDescription: "Miód lipowy to klasyka polskiej apiterapii. Pozyskiwany z nektaru pięknych, starych lip rosnących wzdłuż Wisły. Posiada intensywny, mentolowy i korzenny smak oraz wyraźny aromat kwitnącej lipy.",
      specs: [
        { label: "Smak", value: "Intensywny, mentolowy, z wyraźną korzenną nutą" },
        { label: "Aromat", value: "Wyraźny, świeży, kwitnącej lipy" },
        { label: "Krystalizacja", value: "Średnia – drobna lub grudkowata" },
        { label: "Zastosowanie", value: "Herbata z cytryną, przeziębienia, wieczorny relaks" },
        { label: "Właściwości zdrowotne", value: "Działa rozgrzewająco, wspiera odporność i uspokaja" },
        { label: "Okres dostępności", value: "Czerwiec–lipiec" },
      ],
      whyBuy: "Prawdziwy eliksir zdrowia z nadwiślańskich lip. Tradycyjny wybór na przeziębienia i wieczorne chwile relaksu.",
    };
  }

  if (nameLower.includes("wielokwiatowy")) {
    return {
      richDescription: "Miód wielokwiatowy to najbardziej uniwersalny miód w naszej ofercie. Zbierany z bogatej, zróżnicowanej bazy pożytkowej terenów nadwiślańskich Kujaw.",
      specs: [
        { label: "Smak", value: "Delikatny, kwiatowy, złożony i zrównoważony" },
        { label: "Aromat", value: "Przyjemny, wielo-kwiatowy, świeży" },
        { label: "Krystalizacja", value: "Średnia – drobna lub średnioziarnista" },
        { label: "Zastosowanie", value: "Uniwersalny – herbata, kanapki, deser, gotowanie" },
        { label: "Właściwości zdrowotne", value: "Bogaty w enzymy, mikroelementy i naturalne substancje aktywne" },
        { label: "Okres dostępności", value: "Lato" },
      ],
      whyBuy: "Najlepszy wybór „na co dzień”. Delikatny, wszechstronny i pełen naturalnych dobrodziejstw.",
    };
  }

  if (nameLower.includes("gryczany")) {
    return {
      richDescription: "Miód gryczany to jeden z najcenniejszych i najbardziej intensywnych miodów. Charakteryzuje się głęboką, ciemną barwą i wyrazistym, lekko pikantnym smakiem.",
      specs: [
        { label: "Smak", value: "Ciemny, intensywny, lekko pikantny z przyjemną goryczką" },
        { label: "Aromat", value: "Głęboki, charakterystyczny, ziemisty" },
        { label: "Krystalizacja", value: "Szybka – drobnoziarnista, twarda" },
        { label: "Zastosowanie", value: "Do mięs, sosów, pierników, diety wzmacniającej" },
        { label: "Właściwości zdrowotne", value: "Bogaty w rutynę, żelazo i silne antyoksydanty" },
        { label: "Okres dostępności", value: "Lato (lipiec-sierpień)" },
      ],
      whyBuy: "Miód dla wymagających. Wyjątkowa siła i charakter.",
    };
  }

  if (nameLower.includes("akacjowy") && !nameLower.includes("spadziowy")) {
    return {
      richDescription: "Miód akacjowy z robinii akacjowej to jeden z najdelikatniejszych i najjaśniejszych miodów na świecie. Subtelny kwiatowy aromat i bardzo łagodny smak.",
      specs: [
        { label: "Smak", value: "Bardzo delikatny, łagodny, kwiatowy" },
        { label: "Aromat", value: "Subtelny, słodki, kwiatowy" },
        { label: "Krystalizacja", value: "Bardzo wolna – pozostaje płynny nawet rok" },
        { label: "Zastosowanie", value: "Herbata, deser, naleśniki, dla dzieci i alergików" },
        { label: "Właściwości zdrowotne", value: "Delikatny dla żołądka, polecany dla dzieci i seniorów" },
        { label: "Okres dostępności", value: "Maj–czerwiec" },
      ],
      whyBuy: "Najdelikatniejszy miód w naszej ofercie. Długo pozostaje płynny.",
    };
  }

  if (nameLower.includes("akacjowo-spadziowy")) {
    return {
      richDescription: "Miód akacjowo-spadziowy to rzadki i ceniony skarb naszej pasieki. Powstaje z harmonijnego połączenia nektaru kwitnącej akacji i leśnej spadzi.",
      specs: [
        { label: "Smak", value: "Złożony – delikatny kwiatowy z żywiczną, leśną głębią" },
        { label: "Aromat", value: "Unikalny, akacjowo-leśny, z nutą żywicy" },
        { label: "Krystalizacja", value: "Średnia – elegancka, drobnoziarnista" },
        { label: "Zastosowanie", value: "Dla koneserów, do serów, deserów, wieczornej herbaty" },
        { label: "Właściwości zdrowotne", value: "Wyjątkowo bogaty w minerały i związki bioaktywne" },
        { label: "Okres dostępności", value: "Ograniczona – wczesne lato" },
      ],
      whyBuy: "Prawdziwa rzadkość. Połączenie dwóch światów – kwiatów i lasu.",
    };
  }

  if (nameLower.includes("nawłociowy") || nameLower.includes("nawlociowy")) {
    return {
      richDescription: "Miód nawłociowy pozyskiwany jest późnym latem i jesienią z nektaru nawłoci pospolitej. Charakteryzuje się piękną, złocistą barwą i intensywnym, ziołowo-kwiatowym aromatem.",
      specs: [
        { label: "Smak", value: "Złocisty, ziołowo-kwiatowy, lekko słodki" },
        { label: "Aromat", value: "Intensywny, ziołowy, przyjemny" },
        { label: "Krystalizacja", value: "Średnia" },
        { label: "Zastosowanie", value: "Wspieranie odporności, herbata, codzienne spożycie" },
        { label: "Właściwości zdrowotne", value: "Wspiera odporność i naturalne procesy oczyszczania" },
        { label: "Okres dostępności", value: "Wrzesień–grudzień" },
      ],
      whyBuy: "Późnoletni dar natury. Wspiera odporność w trudniejszym okresie roku.",
    };
  }

  // Fallback dla plastrów i świec
  return {
    richDescription: product.longDescription || "Szczegółowy opis produktu wkrótce.",
    specs: [
      { label: "Pochodzenie", value: "Pasieka w Topolnie nad Wisłą" },
      { label: "Jakość", value: "Niepasteryzowany, surowy miód / 100% naturalny" },
      { label: "Opakowanie", value: "Szklane / naturalny wosk" },
    ],
    whyBuy: "Wybierz produkt z naszej rodzinnej pasieki – pełen naturalnych wartości i tradycji.",
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
          {/* IMAGE SECTION */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3.6] lg:aspect-square rounded-3xl overflow-hidden bg-white border border-brand-creamDark shadow-sm">
              {isAvailable ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#F5EDE4]">
                  <Image
                    src="/logo.png"
                    alt="Jankesowa Pasieka"
                    width={320}
                    height={320}
                    className="opacity-20 grayscale"
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