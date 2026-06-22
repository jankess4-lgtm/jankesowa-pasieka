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

// Generate static paths for all products using explicit slugs
export async function generateStaticParams() {
  return products
    .filter((product) => product.slug)
    .map((product) => ({
      slug: product.slug!,
    }));
}

// Disable on-demand rendering for unknown slugs (strict 404 on Vercel + locally)
export const dynamicParams = false;

// Premium, warm and professional product details
function getProductDetails(product: Product): ProductDetails {
  const nameLower = product.name.toLowerCase();

  if (nameLower.includes("rzepakowo-mniszkowy") || nameLower.includes("rzepakowy")) {
    return {
      richDescription: "Miód rzepakowo-mniszkowy to wyjątkowe połączenie nektaru rzepaku i mniszka lekarskiego. Pochodzi z obfitych, wczesnowiosennych pożytków na kujawskich polach nad Wisłą. Charakteryzuje się jasnozłotą barwą, bardzo słodkim i delikatnym smakiem z subtelną kwiatową nutą mniszka. Szybko krystalizuje, tworząc drobną, kremową konsystencję. Ulubiony przez rodziny z dziećmi i osoby ceniące łagodne, naturalne smaki.",
      specs: [
        { label: "Smak", value: "Bardzo słodki, delikatny, z subtelną nutą mniszka i kwiatową" },
        { label: "Aromat", value: "Lekki, czysty, świeży, miodowy z nutą mniszka" },
        { label: "Krystalizacja", value: "Szybka – drobna, kremowa konsystencja" },
        { label: "Zastosowanie", value: "Herbata, kanapki, naleśniki, deserki dla dzieci" },
        { label: "Właściwości zdrowotne", value: "Bogaty w glukozę, wspiera energię i pracę serca, łagodny dla żołądka" },
        { label: "Okres dostępności", value: "Wczesna wiosna (rzepak i mniszek kwitną w maju)" },
      ],
      whyBuy: "Idealny wybór na co dzień. Szybko krystalizujący, delikatny miód rzepakowo-mniszkowy, który zachwyca zarówno dorosłych, jak i dzieci. Naturalna energia z kujawskich pól.",
    };
  }

  if (nameLower.includes("lipowy")) {
    return {
      richDescription: "Miód lipowy to klasyka polskiej apiterapii. Pozyskiwany z nektaru pięknych, starych lip rosnących wzdłuż Wisły. Posiada intensywny, mentolowy i korzenny smak oraz wyraźny aromat kwitnącej lipy. Tradycyjnie stosowany przy przeziębieniach, problemach z gardłem i jako naturalny środek uspokajający. Jego delikatnie rozgrzewające właściwości czynią go niezastąpionym w sezonie jesienno-zimowym.",
      specs: [
        { label: "Smak", value: "Intensywny, mentolowy, z wyraźną korzenną nutą" },
        { label: "Aromat", value: "Wyraźny, świeży, kwitnącej lipy" },
        { label: "Krystalizacja", value: "Średnia – drobna lub grudkowata" },
        { label: "Zastosowanie", value: "Herbata z cytryną, przeziębienia, wieczorny relaks" },
        { label: "Właściwości zdrowotne", value: "Działa rozgrzewająco, wspiera odporność i uspokaja" },
        { label: "Okres dostępności", value: "Czerwiec–lipiec (sezonowy)" },
      ],
      whyBuy: "Prawdziwy eliksir zdrowia z nadwiślańskich lip. Tradycyjny wybór na przeziębienia i wieczorne chwile relaksu przy kominku.",
    };
  }

  if (nameLower.includes("wielokwiatowy")) {
    return {
      richDescription: "Miód wielokwiatowy to najbardziej uniwersalny miód w naszej ofercie. Zbierany z bogatej, zróżnicowanej bazy pożytkowej terenów nadwiślańskich Kujaw — łąk, zadrzewień i ogrodów. Delikatny, zrównoważony smak z nutami wielu kwiatów sprawia, że jest doskonałym wyborem na co dzień dla całej rodziny. Bogaty w naturalne enzymy i mikroelementy.",
      specs: [
        { label: "Smak", value: "Delikatny, kwiatowy, złożony i zrównoważony" },
        { label: "Aromat", value: "Przyjemny, wielo-kwiatowy, świeży" },
        { label: "Krystalizacja", value: "Średnia – drobna lub średnioziarnista" },
        { label: "Zastosowanie", value: "Uniwersalny – herbata, kanapki, deser, gotowanie" },
        { label: "Właściwości zdrowotne", value: "Bogaty w enzymy, mikroelementy i naturalne substancje aktywne" },
        { label: "Okres dostępności", value: "Lato (zróżnicowana baza pożytkowa)" },
      ],
      whyBuy: "Najlepszy wybór „na co dzień”. Delikatny, wszechstronny i pełen naturalnych dobrodziejstw. Idealny dla całej rodziny.",
    };
  }

  if (nameLower.includes("gryczany")) {
    return {
      richDescription: "Miód gryczany to jeden z najcenniejszych i najbardziej intensywnych miodów. Charakteryzuje się głęboką, ciemną barwą i wyrazistym, lekko pikantnym smakiem z charakterystyczną goryczką. Bardzo bogaty w rutynę, żelazo i antyoksydanty. Tradycyjnie polecany przy anemii, problemach z krążeniem oraz jako naturalne wsparcie odporności.",
      specs: [
        { label: "Smak", value: "Ciemny, intensywny, lekko pikantny z przyjemną goryczką" },
        { label: "Aromat", value: "Głęboki, charakterystyczny, ziemisty" },
        { label: "Krystalizacja", value: "Szybka – drobnoziarnista, twarda" },
        { label: "Zastosowanie", value: "Do mięs, sosów, pierników, diety wzmacniającej" },
        { label: "Właściwości zdrowotne", value: "Bogaty w rutynę, żelazo i silne antyoksydanty" },
        { label: "Okres dostępności", value: "Lato (gryka kwitnie w lipcu-sierpniu)" },
      ],
      whyBuy: "Miód dla wymagających. Wyjątkowa siła i charakter. Tradycyjny wybór osób dbających o krążenie i odporność.",
    };
  }

  if (nameLower.includes("akacjowy") && !nameLower.includes("spadziowy")) {
    return {
      richDescription: "Miód akacjowy z robinii akacjowej to jeden z najdelikatniejszych i najjaśniejszych miodów na świecie. Subtelny kwiatowy aromat i bardzo łagodny smak sprawiają, że jest idealny dla osób, które nie lubią intensywnych miodów. Krystalizuje niezwykle wolno – przez wiele miesięcy pozostaje w płynnej, złocistej formie.",
      specs: [
        { label: "Smak", value: "Bardzo delikatny, łagodny, kwiatowy" },
        { label: "Aromat", value: "Subtelny, słodki, kwiatowy" },
        { label: "Krystalizacja", value: "Bardzo wolna – pozostaje płynny nawet rok" },
        { label: "Zastosowanie", value: "Herbata, deser, naleśniki, dla dzieci i alergików" },
        { label: "Właściwości zdrowotne", value: "Delikatny dla żołądka, polecany dla dzieci i seniorów" },
        { label: "Okres dostępności", value: "Maj–czerwiec (akacja)" },
      ],
      whyBuy: "Najdelikatniejszy miód w naszej ofercie. Długo pozostaje płynny. Idealny dla dzieci i osób ceniących subtelne smaki.",
    };
  }

  if (nameLower.includes("akacjowo-spadziowy")) {
    return {
      richDescription: "Miód akacjowo-spadziowy to rzadki i ceniony skarb naszej pasieki. Powstaje z harmonijnego połączenia nektaru kwitnącej akacji i leśnej spadzi. Delikatna słodycz akacji przeplata się z głębokim, żywicznym i lekko karmelowym posmakiem spadzi. Pochodzi z wyjątkowych terenów, gdzie akacje rosną w sąsiedztwie starych lasów nad Wisłą.",
      specs: [
        { label: "Smak", value: "Złożony – delikatny kwiatowy z żywiczną, leśną głębią" },
        { label: "Aromat", value: "Unikalny, akacjowo-leśny, z nutą żywicy" },
        { label: "Krystalizacja", value: "Średnia – elegancka, drobnoziarnista" },
        { label: "Zastosowanie", value: "Dla koneserów, do serów, deserów, wieczornej herbaty" },
        { label: "Właściwości zdrowotne", value: "Wyjątkowo bogaty w minerały i związki bioaktywne" },
        { label: "Okres dostępności", value: "Ograniczona – wczesne lato" },
      ],
      whyBuy: "Prawdziwa rzadkość. Połączenie dwóch światów – kwiatów i lasu. Wybór dla tych, którzy szukają wyjątkowych, złożonych doznań smakowych.",
    };
  }

  if (nameLower.includes("nawłociowy") || nameLower.includes("nawlociowy")) {
    return {
      richDescription: "Miód nawłociowy pozyskiwany jest późnym latem i jesienią z nektaru nawłoci pospolitej. Charakteryzuje się piękną, złocistą barwą i intensywnym, ziołowo-kwiatowym aromatem. Wspiera naturalną odporność organizmu i jest ceniony jako późnoletni miód wzmacniający.",
      specs: [
        { label: "Smak", value: "Złocisty, ziołowo-kwiatowy, lekko słodki" },
        { label: "Aromat", value: "Intensywny, ziołowy, przyjemny" },
        { label: "Krystalizacja", value: "Średnia" },
        { label: "Zastosowanie", value: "Wspieranie odporności, herbata, codzienne spożycie" },
        { label: "Właściwości zdrowotne", value: "Wspiera odporność i naturalne procesy oczyszczania" },
        { label: "Okres dostępności", value: "Wrzesień–grudzień (sezonowy)" },
      ],
      whyBuy: "Późnoletni dar natury. Wspiera odporność w trudniejszym okresie roku. Piękny, złocisty miód z dzikich łąk nad Wisłą.",
    };
  }

  if (nameLower.includes("plaster")) {
    return {
      richDescription: "Plastry miodu to najczystsza i najbardziej tradycyjna forma spożycia miodu. Piękne, pełne plastry prosto z naszych uli – bez wirowania i jakiejkolwiek obróbki. Miód w naturalnym woskowym plastrze jest nie tylko smaczny, ale też bogaty w propolis i inne cenne substancje zawarte w wosku.",
      specs: [
        { label: "Smak", value: "Najczystszy, pierwotny, naturalny miód prosto z ula" },
        { label: "Aromat", value: "Naturalny, woskowy, intensywnie miodowy" },
        { label: "Krystalizacja", value: "W plastrze zachowuje naturalną formę" },
        { label: "Zastosowanie", value: "Jeść razem z woskiem, deser, herbata, wyjątkowe prezenty" },
        { label: "Właściwości zdrowotne", value: "Bogaty w propolis – naturalne wsparcie odporności" },
        { label: "Okres dostępności", value: "W sezonie (lato)" },
      ],
      whyBuy: "Najbardziej autentyczna forma miodu. Jedz wosk razem z miodem – to prawdziwa uczta dla ciała i ducha.",
    };
  }

  if (nameLower.includes("świeca") || nameLower.includes("swiece")) {
    return {
      richDescription: "Ręcznie wytwarzane świece ze 100% czystego wosku pszczelego pozyskanego w naszej pasiece. Bez parafiny, stearyny i sztucznych dodatków. Palą się równo, czysto i nie kopcą, wydzielając przy tym subtelny, naturalny zapach miodu i wosku. Tworzą niepowtarzalną, ciepłą atmosferę w każdym wnętrzu.",
      specs: [
        { label: "Skład", value: "100% czysty wosk pszczeli" },
        { label: "Płomień", value: "Równy, czysty, bez kopcenia" },
        { label: "Zapach", value: "Naturalny, delikatny miodowo-woskowy" },
        { label: "Zastosowanie", value: "Relaks, medytacja, romantyczne wieczory, dekoracja" },
        { label: "Zalety", value: "Neutralizują zapachy, oczyszczają powietrze" },
        { label: "Dostępność", value: "Przez cały rok" },
      ],
      whyBuy: "Najzdrowsze i najpiękniejsze świece. Prawdziwy wosk z naszej pasieki. Czysty płomień i naturalny aromat.",
    };
  }

  // Fallback
  return {
    richDescription: product.longDescription,
    specs: [
      { label: "Smak", value: "Charakterystyczny dla danego miodu" },
      { label: "Pochodzenie", value: "Pasieka w Topolnie nad Wisłą" },
      { label: "Jakość", value: "Niepasteryzowany, surowy" },
      { label: "Opakowanie", value: "Szklane, bezpieczne i ekologiczne" },
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

  // Prev / Next navigation
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
          {/* Image section - larger and more prominent */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3.6] lg:aspect-square rounded-3xl overflow-hidden bg-white border border-brand-creamDark shadow-sm">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {!isAvailable && (
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <span className="bg-white/95 text-brand-brown px-7 py-2.5 rounded-full text-sm font-medium tracking-wide">
                    Produkt sezonowy – już wkrótce
                  </span>
                </div>
              )}
            </div>

            {/* Refined gallery hint */}
            <div className="grid grid-cols-5 gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-brand-creamDark">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div className="col-span-4 relative aspect-square rounded-2xl overflow-hidden border border-brand-creamDark bg-white flex items-center justify-center text-sm text-brand-brown/40 tracking-wide">
                Galeria wkrótce
              </div>
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

            {/* Elegant feature table */}
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

            <div className="text-xs text-brand-brown/55 pt-1 leading-snug">
              Dostępność może się zmieniać w zależności od sezonu. Wszystkie miody pochodzą wyłącznie z naszych uli.
            </div>
          </div>
        </div>

        {/* Dlaczego warto kupić – new premium section */}
        <div className="mt-16 bg-white rounded-3xl border border-brand-creamDark p-8 md:p-10">
          <div className="max-w-3xl">
            <div className="uppercase tracking-[3px] text-xs text-brand-gold mb-2">Wybierz świadomie</div>
            <h2 className="font-serif text-3xl text-brand-brown mb-5 tracking-tight">Dlaczego warto kupić ten miód?</h2>
            <p className="text-[#374151] leading-relaxed text-[15px]">
              {details.whyBuy}
            </p>
          </div>
        </div>

        {/* Global brand section – Dlaczego nasz miód */}
        <div className="mt-12 bg-[#F5EDE4] rounded-3xl border border-brand-creamDark p-8 md:p-10">
          <h2 className="font-serif text-3xl text-brand-brown mb-8 tracking-tight">Dlaczego nasz miód?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-sm text-[#374151]">
            <div>
              <div className="font-medium text-brand-brown mb-2.5">Rodzinna pasieka</div>
              <p>Mała, rodzinna skala produkcji. Ręcznie rozlewany miód z troską o najwyższą jakość i dobrostan pszczół.</p>
            </div>
            <div>
              <div className="font-medium text-brand-brown mb-2.5">Wirowany na zimno</div>
              <p>Miód zbierany wyłącznie z dojrzałych plastrów. Bez pasteryzacji i mieszania – zachowuje wszystkie naturalne enzymy.</p>
            </div>
            <div>
              <div className="font-medium text-brand-brown mb-2.5">Nadwiślańskie Kujawy</div>
              <p>Bogata baza pożytkowa: łąki, zadrzewienia, rzepak, lipy, akacje, gryka i późna spadź. Czyste powietrze z dala od przemysłu.</p>
            </div>
          </div>
        </div>

        {/* Previous / Next navigation */}
        <div className="mt-12 pt-8 border-t border-brand-creamDark flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          {prevProduct ? (
            <Link
              href={`/produkty/${prevProduct.slug}`}
              className="group flex items-center gap-3 text-brand-brown/80 hover:text-brand-gold transition-colors"
            >
              <span className="text-xl group-hover:-translate-x-0.5 transition">←</span>
              <div>
                <div className="text-[10px] uppercase tracking-[1.5px] text-brand-brown/50">Poprzedni produkt</div>
                <div className="font-medium">{prevProduct.name}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProduct ? (
            <Link
              href={`/produkty/${nextProduct.slug}`}
              className="group flex items-center gap-3 text-right text-brand-brown/80 hover:text-brand-gold transition-colors sm:text-right"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[1.5px] text-brand-brown/50">Następny produkt</div>
                <div className="font-medium">{nextProduct.name}</div>
              </div>
              <span className="text-xl group-hover:translate-x-0.5 transition">→</span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/produkty" className="inline-flex items-center text-sm text-brand-gold hover:underline">
            ← Wróć do pełnej oferty
          </Link>
        </div>
      </div>
    </div>
  );
}
