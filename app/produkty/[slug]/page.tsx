import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import ProductActions from "./ProductActions";

interface ProductPageProps {
  params: { slug: string };
}

// Generate static paths for all products
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug || generateSlug(product.name),
  }));
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/–/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/,/g, "")
    .replace(/ml/g, "ml")
    .replace(/kg/g, "kg")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

function getProductBySlug(slug: string): Product | undefined {
  return products.find(
    (p) => (p.slug || generateSlug(p.name)) === slug
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isAvailable = product.available !== false;

  // Features / benefits based on product type
  const getFeatures = (product: Product) => {
    const baseFeatures = [
      "Produkt z naszej pasieki w Topolnie nad Wisłą",
      "Niepasteryzowany – zachowuje wszystkie naturalne enzymy",
      "Szklane opakowanie (bezpieczne i ekologiczne)",
      "Pochodzi z terenów nadwiślańskich Kujaw",
    ];

    if (product.name.toLowerCase().includes("rzepakowy")) {
      return [
        ...baseFeatures,
        "Smak: bardzo słodki, delikatny, z nutą kwiatową",
        "Aromat: lekki, czysty, miodowy",
        "Zastosowanie: idealny do herbaty, kanapek, naleśników, dla dzieci",
        "Dostępność: wczesna wiosna (rzepak kwitnie w maju)",
        "Właściwości: szybko krystalizuje w drobną, kremową konsystencję",
      ];
    }
    if (product.name.toLowerCase().includes("lipowy")) {
      return [
        ...baseFeatures,
        "Smak: intensywny, mentolowy, korzenny",
        "Aromat: wyraźny, kwitnącej lipy",
        "Zastosowanie: przy przeziębieniach, problemach z gardłem, uspokajająco",
        "Dostępność: czerwiec-lipiec (sezonowy)",
        "Właściwości: działa rozgrzewająco, wspiera odporność",
      ];
    }
    if (product.name.toLowerCase().includes("wielokwiatowy")) {
      return [
        ...baseFeatures,
        "Smak: delikatny, kwiatowy, złożony i zrównoważony",
        "Aromat: przyjemny, wielo-kwiatowy",
        "Zastosowanie: uniwersalny na co dzień – do herbaty, kanapek, deserów",
        "Dostępność: lato (zróżnicowana baza pożytkowa)",
        "Właściwości: bogaty w enzymy i mikroelementy",
      ];
    }
    if (product.name.toLowerCase().includes("gryczany")) {
      return [
        ...baseFeatures,
        "Smak: ciemny, intensywny, lekko pikantny z goryczką",
        "Aromat: głęboki, charakterystyczny",
        "Zastosowanie: do mięs, sosów, pierników, diety wzmacniającej",
        "Dostępność: lato (gryka)",
        "Właściwości: bogaty w rutynę, żelazo i antyoksydanty",
      ];
    }
    if (product.name.toLowerCase().includes("akacjowy")) {
      return [
        ...baseFeatures,
        "Smak: bardzo delikatny, łagodny, kwiatowy",
        "Aromat: subtelny, kwiatowy",
        "Zastosowanie: do herbaty, deserów, naleśników, dla dzieci",
        "Dostępność: maj-czerwiec (akacja)",
        "Właściwości: bardzo wolno krystalizuje, pozostaje płynny długo",
      ];
    }
    if (product.name.toLowerCase().includes("akacjowo-spadzowy")) {
      return [
        ...baseFeatures,
        "Smak: złożony – delikatny z żywiczną głębią",
        "Aromat: unikalny, akacjowo-leśny",
        "Zastosowanie: dla koneserów, do serów, deserów",
        "Dostępność: ograniczona (spadź + akacja)",
        "Właściwości: rzadki i ceniony bukiet smakowy",
      ];
    }
    if (product.name.toLowerCase().includes("nawłociowy")) {
      return [
        ...baseFeatures,
        "Smak: złocisty, ziołowo-kwiatowy",
        "Aromat: intensywny, ziołowy",
        "Zastosowanie: wspierający odporność, późnoletni",
        "Dostępność: wrzesień-grudzień (sezonowy)",
        "Właściwości: wspiera naturalną odporność organizmu",
      ];
    }
    if (product.name.toLowerCase().includes("plaster")) {
      return [
        ...baseFeatures,
        "Smak: najczystszy, pierwotny miód prosto z ula",
        "Aromat: naturalny, woskowy",
        "Zastosowanie: jeść razem z woskiem (bogaty w propolis)",
        "Dostępność: w sezonie",
        "Właściwości: najczystsza i najbardziej tradycyjna forma",
      ];
    }
    if (product.name.toLowerCase().includes("świeca")) {
      return [
        "Ręcznie wytwarzane w naszej pasiece w Topolnie",
        "100% czystego wosku pszczelego – bez parafiny i dodatków",
        "Palą się równo, czysto, bez kopcenia",
        "Wydzielają naturalny, delikatny zapach miodu i wosku",
        "Tworzą przyjemną, ciepłą atmosferę",
        "Dostępne w różnych rozmiarach",
      ];
    }
    return baseFeatures;
  };

  const features = getFeatures(product);
  const isAvailable = product.available !== false;

  return (
    <div className="bg-[#F5EDE4] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-brand-brown/70">
          <Link href="/" className="hover:text-brand-gold">Strona główna</Link>
          {" / "}
          <Link href="/produkty" className="hover:text-brand-gold">Oferta</Link>
          {" / "}
          <span className="text-brand-brown">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-brand-creamDark shadow-sm">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {!isAvailable && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white/90 text-brand-brown px-6 py-2 rounded-full text-sm font-medium">
                    Produkt sezonowy – już wkrótce
                  </span>
                </div>
              )}
            </div>

            {/* Simple gallery hint - using main image */}
            <div className="grid grid-cols-4 gap-3">
              <div className="relative aspect-square rounded-xl overflow-hidden border border-brand-creamDark opacity-80">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden border border-brand-creamDark bg-white flex items-center justify-center text-xs text-brand-brown/50">
                Galeria wkrótce
              </div>
            </div>
          </div>

          {/* Info section */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-brand-brown tracking-tight mb-2">
                {product.name}
              </h1>
              <div className="text-3xl font-semibold text-brand-brown tabular-nums">
                {product.price} <span className="text-xl align-super font-normal">zł</span>
              </div>
              <div className="text-brand-brown/70 mt-1">{product.unit}</div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 bg-brand-cream border border-brand-creamDark rounded-full text-brand-brown">
                Produkt z naszej pasieki
              </span>
              <span className="px-3 py-1 bg-brand-cream border border-brand-creamDark rounded-full text-brand-brown">
                Niepasteryzowany
              </span>
              <span className="px-3 py-1 bg-brand-cream border border-brand-creamDark rounded-full text-brand-brown">
                Szklane opakowanie
              </span>
            </div>

            <div>
              <h2 className="font-medium text-lg mb-2 text-brand-brown">Opis</h2>
              <p className="text-[#374151] leading-relaxed">{product.longDescription}</p>
            </div>

            <div>
              <h2 className="font-medium text-lg mb-3 text-brand-brown">Cechy i korzyści</h2>
              <ul className="space-y-2 text-sm text-[#374151]">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-brand-creamDark">
              <ProductActions product={product} isAvailable={isAvailable} />
            </div>

            <div className="text-xs text-brand-brown/60 pt-2">
              Dostępność może się zmieniać w zależności od sezonu. Wszystkie miody pochodzą wyłącznie z naszych uli.
            </div>
          </div>
        </div>

        {/* Dlaczego nasz miód / Warto wiedzieć */}
        <div className="mt-16 bg-white rounded-3xl border border-brand-creamDark p-8 md:p-10">
          <h2 className="font-serif text-3xl text-brand-brown mb-6 tracking-tight">Dlaczego nasz miód?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-sm text-[#374151]">
            <div>
              <div className="font-medium text-brand-brown mb-2">Rodzinna pasieka</div>
              <p>Mała, rodzinna skala produkcji. Ręcznie rozlewany miód z troską o najwyższą jakość i dobrostan pszczół.</p>
            </div>
            <div>
              <div className="font-medium text-brand-brown mb-2">Wirowany na zimno</div>
              <p>Miód zbierany wyłącznie z dojrzałych plastrów. Bez pasteryzacji i mieszania – zachowuje wszystkie naturalne enzymy.</p>
            </div>
            <div>
              <div className="font-medium text-brand-brown mb-2">Nadwiślańskie Kujawy</div>
              <p>Bogata baza pożytkowa: łąki, zadrzewienia, rzepak, lipy, akacje, gryka i późna spadź. Czyste powietrze z dala od przemysłu.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/produkty" className="text-sm text-brand-gold hover:underline">
            ← Wróć do pełnej oferty
          </Link>
        </div>
      </div>
    </div>
  );
}
