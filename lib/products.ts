import { Product } from "./types";

export const products: Product[] = [
  {
    id: 1,
    name: "Miód rzepakowo-mniszkowy – 900 ml (1,2 kg)",
    slug: "miod-rzepakowo-mniszkowy-900ml",
    description: "Jasnozłoty miód rzepakowo-mniszkowy. Delikatny, bardzo słodki z subtelnymi nutami mniszka.",
    longDescription: "Miód rzepakowo-mniszkowy to wyjątkowe połączenie nektaru rzepaku i mniszka lekarskiego. Pochodzi z obfitych, wczesnowiosennych pożytków na kujawskich polach nad Wisłą. Charakteryzuje się jasnozłotą barwą, bardzo słodkim i delikatnym smakiem z subtelną kwiatową nutą mniszka. Szybko krystalizuje, tworząc drobną, kremową konsystencję.",
    price: 50,
    unit: "900 ml (1,2 kg)",
    category: "miody",
    image: "/images/miod-rzepakowo-mniszkowy-1-2-kg.webp",
    inStock: 25,        // aktualna ilość
    available: true,
  },
  {
    id: 2,
    name: "Miód rzepakowo-mniszkowy – 350 ml (0,49 kg)",
    slug: "miod-rzepakowo-mniszkowy-350ml",
    description: "Jasnozłoty miód rzepakowo-mniszkowy. Delikatny, bardzo słodki z subtelnymi nutami mniszka.",
    longDescription: "Miód rzepakowo-mniszkowy to wyjątkowe połączenie nektaru rzepaku i mniszka lekarskiego. Charakteryzuje się jasnozłotą barwą, bardzo słodkim, delikatnym smakiem z subtelną kwiatową nutą mniszka. Szybko krystalizuje, tworząc drobną, kremową konsystencję.",
    price: 30,
    unit: "350 ml (0,49 kg)",
    category: "miody",
    image: "/images/miod-rzepakowo-mniszkowy-0-49-kg.webp",
    inStock: 15,        // aktualna ilość
    available: true,
  },
  {
    id: 3,
    name: "Miód lipowy – 900 ml (1,2 kg)",
    slug: "miod-lipowy-900ml",
    description: "Intensywny, mentolowy, z wyraźnym aromatem kwitnącej lipy.",
    longDescription: "Miód lipowy pozyskiwany z nektaru kwiatów lipy. Intensywny, mentolowy smak i aromat. Działa uspokajająco i wspiera odporność.",
    price: 60,
    unit: "900 ml (1,2 kg)",
    category: "miody",
    image: "/images/miod-lipowy-900ml.jpg",
    inStock: 0,
    available: false,
    badgeText: "Już wkrótce",
  },
  {
    id: 4,
    name: "Miód wielokwiatowy – 900 ml (1,2 kg)",
    slug: "miod-wielokwiatowy-900ml",
    description: "Delikatny, kwiatowy, o przyjemnym i złożonym smaku. Uniwersalny miód na co dzień.",
    longDescription: "Miód wielokwiatowy to najbardziej uniwersalny miód w naszej ofercie. Zbierany z bogatej, zróżnicowanej bazy pożytkowej terenów nadwiślańskich Kujaw.",
    price: 50,
    unit: "900 ml (1,2 kg)",
    category: "miody",
    image: "/images/miod-wielokwiatowy-1-2-kg.webp",
    inStock: 15,        // aktualna ilość
    available: true,
  },
  {
    id: 7,
    name: "Miód nawłociowy – 900 ml (1,2 kg)",
    slug: "miod-nawlocowy-900ml",
    description: "Złocisty miód jesienny z nektaru nawłoci. Intensywny, ziołowo-kwiatowy aromat.",
    longDescription: "Miód nawłociowy pozyskiwany jest późnym latem i jesienią z nektaru nawłoci pospolitej.",
    price: 60,
    unit: "900 ml (1,2 kg)",
    category: "miody",
    image: "/images/miod-nawlocowy-1,2-kg.png",
    inStock: 0,
    available: false,
    badgeText: "Produkt sezonowy - niedostępny",
  },
  {
    id: 5,
    name: "Miód akacjowy – 900 ml (1,2 kg)",
    slug: "miod-akacjowy-900ml",
    description: "Jeden z najjaśniejszych i najdelikatniejszych miodów, o subtelnym kwiatowym zapachu.",
    longDescription: "Miód akacjowy to jeden z najdelikatniejszych i najbardziej cenionych miodów...",
    price: 60,
    unit: "900 ml (1,2 kg)",
    category: "miody",
    image: "/images/miod-akacjowy-1-2-kg.webp",
    inStock: 25,        // aktualna ilość
    available: true,
  },
  {
    id: 6,
    name: "Miód akacjowy – 350 ml (0,49 kg)",
    slug: "miod-akacjowy-350ml",
    description: "Delikatny miód akacjowy w mniejszym słoiku.",
    longDescription: "Miód akacjowy w mniejszym opakowaniu – idealny na początek lub jako prezent.",
    price: 30,
    unit: "350 ml (0,49 kg)",
    category: "miody",
    image: "/images/miod-akacjowy-0-49-kg.webp",
    inStock: 15,        // aktualna ilość
    available: true,
  },
  {
    id: 12,
    name: "Plastry miodu",
    slug: "plastry-miodu",
    description: "Naturalny miód w plastrze – prosto z ula.",
    longDescription: "Piękne, pełne plastry miodu prosto z naszych uli.",
    price: 75,
    unit: "plaster ok. 450–500 g",
    category: "produkty",
    image: "/images/miod-w-plastrach.webp",
    inStock: 4,         // aktualna ilość
    available: true,
  },
  {
    id: 20,
    name: "Zestaw 2 słoików miodu – 2 × 900 ml (2 × 1,2 kg)",
    slug: "zestaw-2-sloikow-miodu-900ml",
    description: "Dwa duże słoiki miodu 1,2 kg do wyboru za 95 zł – od 5 zł taniej niż przy zakupie osobno, z darmową wysyłką.",
    longDescription: "Zestaw dwóch dużych słoików miodu 900 ml (1,2 kg) z naszej pasieki w Topolnie. Sam wybierasz dwa rodzaje spośród dostępnych miodów – możesz też wziąć dwa takie same. Płacisz 95 zł, zawsze taniej niż dwa duże słoiki osobno: przy wielokwiatowym i rzepakowo-mniszkowym (po 50 zł) oszczędzasz 5 zł, przy dwóch akacjach (po 60 zł) – 25 zł, a przy mieszance 50 zł i 60 zł – 15 zł. Wysyłka jest darmowa (od 95 zł wartości produktów). Miód naturalny, niepasteryzowany, w szklanych słoikach.",
    price: 95,
    unit: "2 × 900 ml (2 × 1,2 kg)",
    category: "zestawy",
    image: "/images/miod-rzepakowo-mniszkowy-1-2-kg.webp",
    inStock: 15,
    available: true,
    badgeText: "Oszczędzasz od 5 zł",
  },
  {
    id: 21,
    name: "Zestaw 3 małych słoików miodu – 3 × 350 ml (3 × 0,49 kg)",
    slug: "zestaw-3-malych-sloikow-miodu-350ml",
    description: "Trzy małe słoiki miodu 0,49 kg do wyboru za 80 zł zamiast 90 zł – oszczędzasz 10 zł, a wysyłka kosztuje tyle samo co za jeden słoik.",
    longDescription: "Zestaw trzech małych słoików miodu 350 ml (0,49 kg) z naszej pasieki w Topolnie. Sam wybierasz trzy miody spośród dostępnych – możesz też wziąć kilka takich samych. Płacisz 80 zł zamiast 90 zł za trzy pojedyncze słoiki, czyli oszczędzasz 10 zł, a wysyłka kosztuje tyle samo co za jeden słoik. To ładny pomysł na prezent i dobry sposób, żeby spróbować kilku rodzajów miodu. Miód naturalny, niepasteryzowany, w szklanych słoikach.",
    price: 80,
    unit: "3 × 350 ml (3 × 0,49 kg)",
    category: "zestawy",
    image: "/images/miod-akacjowy-0-49-kg.webp",
    inStock: 15,
    available: true,
    badgeText: "Oszczędzasz 10 zł",
  },
  {
    id: 22,
    name: "Zestaw świąteczny – 3 małe słoiki miodu w pudełku z kokardą",
    slug: "zestaw-swiateczny-3-male-sloiki",
    description: "Trzy małe słoiki miodu (po 0,49 kg) w pudełku przewiązanym kokardą. Gotowy prezent z pasieki na święta – odmiany wybierasz sam.",
    longDescription: "Zestaw świąteczny z naszej pasieki w Topolnie: trzy słoiki miodu 350 ml (0,49 kg) w pudełku przewiązanym kokardą. Sam wybierasz odmiany spośród tych, które właśnie mamy – możesz też wziąć kilka takich samych. To spokojny, praktyczny prezent na stół, bez kombinowania z pakowaniem. Miód naturalny, niepasteryzowany, w szklanych słoikach. Pudełko i kokarda są w cenie.",
    price: 89,
    unit: "3 × 350 ml (3 × 0,49 kg)",
    category: "zestawy",
    image: "/images/miod-akacjowy-0-49-kg.webp",
    inStock: 15,
    available: true,
    badgeText: "Na święta",
  },
  {
    id: 23,
    name: "Zestaw 3 dużych słoików miodu – 3 × 900 ml (3 × 1,2 kg)",
    slug: "zestaw-3-duzych-sloikow-miodu-900ml",
    description: "Trzy duże słoiki miodu 1,2 kg do wyboru za 135 zł zamiast 150 zł – oszczędzasz 15 zł. 3,6 kg miodu, a wysyłka jest już darmowa.",
    longDescription: "Zestaw trzech dużych słoików miodu 900 ml (1,2 kg) z naszej pasieki w Topolnie. Sam wybierasz trzy rodzaje spośród dostępnych miodów – możesz też wziąć kilka takich samych. Płacisz 135 zł zamiast 150 zł za trzy słoiki po 50 zł (wielokwiatowy albo rzepakowo-mniszkowy), czyli oszczędzasz 15 zł. Jeśli w zestawie będzie miód akacjowy (60 zł za słoik), oszczędzasz jeszcze więcej, a cena zestawu zostaje 135 zł. To 3,6 kg miodu, więc wysyłka jest darmowa (od 95 zł wartości produktów). Miód naturalny, niepasteryzowany, w szklanych słoikach.",
    price: 135,
    unit: "3 × 900 ml (3 × 1,2 kg)",
    category: "zestawy",
    image: "/images/zestaw-3-duze-sloiki.webp",
    inStock: 15,
    available: true,
    badgeText: "Oszczędzasz 15 zł",
  },
  {
    id: 30,
    name: "Walec z motywem roślinnym",
    slug: "swieca-walec-z-motywem-roslinnym",
    description: "Ręcznie odlewany walec z motywem roślinnym, ze 100% wosku pszczelego z naszej pasieki w Topolnie na Kujawach.",
    longDescription: "Świeca w kształcie walca z motywem roślinnym, ręcznie odlewana z czystego wosku pszczelego z naszych uli w Topolnie na Kujawach. Bez parafiny i sztucznych zapachów — pachnie delikatnie woskiem i miodem.",
    price: 32,
    unit: "sztuka",
    category: "produkty",
    image: "/images/swiece/walec-z-motywem-roslinnym.webp",
    inStock: 999,
    available: true,
  },
  {
    id: 31,
    name: "Aniołek z wosku pszczelego",
    slug: "swieca-aniolek",
    description: "Ręcznie odlewany aniołek z naszego wosku pszczelego. Spokojna ozdoba na stół albo prezent.",
    longDescription: "Aniołek ze złożonymi dłońmi, ręcznie odlewany z czystego wosku pszczelego z naszej pasieki w Topolnie na Kujawach. Bez parafiny i sztucznych zapachów. Ładnie wygląda na stole i spokojnie nadaje się na prezent.",
    price: 18,
    unit: "sztuka",
    category: "produkty",
    image: "/images/swiece/aniolek.webp",
    inStock: 999,
    available: true,
  },
  {
    id: 33,
    name: "Stary ul z wosku pszczelego",
    slug: "swieca-stary-ul",
    description: "Ręcznie odlewana kószka – stary ul z naszego wosku pszczelego z Topolna na Kujawach.",
    longDescription: "Ręcznie odlewana kószka – stary ul z czystego wosku pszczelego z naszej pasieki w Topolnie na Kujawach. Bez parafiny i sztucznych zapachów.",
    price: 15,
    unit: "sztuka",
    category: "produkty",
    image: "/images/swiece/koszka.webp",
    inStock: 999,
    available: true,
  },
  {
    id: 34,
    name: "Walec z sercem",
    slug: "swieca-walec-z-sercem",
    description: "Niski walec z wypukłym sercem, ręcznie odlewany z naszego wosku pszczelego z Topolna na Kujawach.",
    longDescription: "Krótka świeca-walec z wypukłym sercem, ręcznie odlewana z czystego wosku pszczelego z naszej pasieki w Topolnie na Kujawach. Bez parafiny i sztucznych zapachów.",
    price: 18,
    unit: "sztuka",
    category: "produkty",
    image: "/images/swiece/serce.webp",
    inStock: 999,
    available: true,
  },
  {
    id: 35,
    name: "Zestaw świec z wosku pszczelego",
    slug: "zestaw-swiec-z-wosku-pszczelego",
    description: "Siedem świec z naszego wosku, które kompletujesz sam — 119 zł. Jeśli wybrane świece osobno kosztowałyby mniej, płacisz tę niższą kwotę.",
    longDescription: "Zestaw siedmiu ręcznie odlewanych świec z czystego wosku pszczelego z naszej pasieki w Topolnie na Kujawach. Wybierasz dowolną mieszankę spośród: walca z motywem roślinnym, aniołka, starego ula (kószki) i walca z sercem. Cena zestawu to 119 zł. Jeśli suma tych samych świec sprzedawanych osobno wyszłaby niższa, płacisz tyle, ile wynoszą osobno. Bez parafiny i sztucznych zapachów.",
    price: 119,
    unit: "7 sztuk",
    category: "produkty",
    image: "/images/swiece/swiece-wszystkie.webp",
    inStock: 999,
    available: true,
    badgeText: "Oszczędzasz 15 zł",
  },
  {
    id: 36,
    name: "Zestaw świąteczny świec",
    slug: "zestaw-swiateczny-swiec",
    description: "Trzy świece z naszego wosku, które kompletujesz sam — 49 zł. Jeśli wybrane świece osobno kosztowałyby mniej, płacisz tę niższą kwotę. Spokojny pomysł na prezent.",
    longDescription: "Zestaw trzech ręcznie odlewanych świec z czystego wosku pszczelego z naszej pasieki w Topolnie na Kujawach. Wybierasz dowolną mieszankę spośród: walca z motywem roślinnym, aniołka, starego ula (kószki) i walca z sercem. Cena zestawu to 49 zł. Jeśli suma tych samych świec sprzedawanych osobno wyszłaby niższa, płacisz tyle, ile wynoszą osobno. Bez parafiny i sztucznych zapachów.",
    price: 49,
    unit: "3 sztuki",
    category: "produkty",
    image: "/images/swiece/swiece-wszystkie.webp",
    inStock: 999,
    available: true,
    badgeText: "Na święta",
  },
];

export function isProductListedAsAvailable(p: Product): boolean {
  return p.available !== false && p.inStock > 0;
}

export function isProductOrderable(p: Product): boolean {
  return isProductListedAsAvailable(p);
}

export const CANDLE_IDS = [30, 31, 33, 34, 35, 36];

export function isCandleProduct(p: Product): boolean {
  return CANDLE_IDS.includes(p.id);
}

export function getCandleProducts(): Product[] {
  return CANDLE_IDS
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

/** Ile miejsc w paczce zajmuje produkt (słoiki liczymy osobno przez jarSize). */
export function packingUnits(p: Product): number {
  if (p.id === 35) return 7;
  if (p.id === 36) return 3;
  if (isCandleProduct(p) || p.id === 12) return 1;
  return 0;
}

export const CANDLE_SLUG_REDIRECTS: Record<string, string> = {
  "swiece-z-wosku-pszczelego": "/produkty#swiece",
  "swieca-aniolek-z-dzieciatkiem": "/produkty/swieca-aniolek",
  "swieca-koszka": "/produkty/swieca-stary-ul",
  "swieca-serce": "/produkty/swieca-walec-z-sercem",
};

/** Dwa zestawy i dwa duże słoiki — równy rząd 4 produktów na komputerze. */
export function getHomepageFeaturedProducts(): Product[] {
  const sets = products.filter((p) => p.category === "zestawy" && isProductListedAsAvailable(p));
  const preferredIds = [23, 22, 20, 21];
  const featuredSets = preferredIds
    .map((id) => sets.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 2);
  const honeys = products.filter(
    (p) => p.category === "miody" && isProductListedAsAvailable(p) && !p.unit.includes("350")
  );
  return [...featuredSets, ...honeys.slice(0, 2)];
}

export function sortProductsForCatalog(list: Product[]): Product[] {
  return [...list].sort((a, b) => {
    const rank = (p: Product) => {
      if (!isProductListedAsAvailable(p)) return 2;
      if (p.category === "zestawy") return 0;
      return 1;
    };
    return rank(a) - rank(b);
  });
}

// ===== Zestawy z wyborem miodów =====
export interface BundleConfig {
  id: number;
  count: number;          // ile słoików w zestawie
  varietyUnit: string;    // z jakich słoików wybiera klient
  price: number;          // cena pilnowana przez serwer
  regularPrice: number;   // cena słoików osobno
  cartBase: number;       // id pozycji w koszyku = cartBase + zakodowane id miodów
  labelPrefix: string;    // np. "Zestaw 2 × 1,2 kg"
  jarLabel: string;       // np. "900 ml"
  jarShort: string;       // np. "1,2 kg" (etykiety list wyboru)
  feedNetWeightKg: number;
  feedPackagingKg: number;
}

export const BUNDLES: BundleConfig[] = [
  {
    id: 20, count: 2, varietyUnit: "900 ml (1,2 kg)", price: 95, regularPrice: 100,
    // 100000 + a*1000 + b (a <= b) – kodowanie bez zmian względem pierwszej wersji
    cartBase: 100000, labelPrefix: "Zestaw 2 × 1,2 kg", jarLabel: "900 ml", jarShort: "1,2 kg",
    feedNetWeightKg: 2.4, feedPackagingKg: 0.7,
  },
  {
    id: 21, count: 3, varietyUnit: "350 ml (0,49 kg)", price: 80, regularPrice: 90,
    cartBase: 2000000, labelPrefix: "Zestaw 3 × 350 ml", jarLabel: "350 ml", jarShort: "0,49 kg",
    feedNetWeightKg: 1.47, feedPackagingKg: 0.6,
  },
  {
    id: 22, count: 3, varietyUnit: "350 ml (0,49 kg)", price: 89, regularPrice: 90,
    cartBase: 3000000, labelPrefix: "Zestaw świąteczny 3 × 350 ml", jarLabel: "350 ml", jarShort: "0,49 kg",
    feedNetWeightKg: 1.47, feedPackagingKg: 0.8,
  },
  {
    // cartBase poza zakresami zestawów 21 i 22 (cartBase + 1000^3), żeby id koszyka się nie pokrywały
    id: 23, count: 3, varietyUnit: "900 ml (1,2 kg)", price: 135, regularPrice: 150,
    cartBase: 2_000_000_000, labelPrefix: "Zestaw 3 × 1,2 kg", jarLabel: "900 ml", jarShort: "1,2 kg",
    feedNetWeightKg: 3.6, feedPackagingKg: 1.05,
  },
];

const BUNDLE_SLOT = 1000; // id miodów < 1000

export function getBundleConfig(id: number): BundleConfig | undefined {
  return BUNDLES.find((b) => b.id === id);
}

function bundleRangeEnd(b: BundleConfig): number {
  return b.cartBase + Math.pow(BUNDLE_SLOT, b.count);
}

/** Konfiguracja zestawu dla id produktu albo id pozycji koszyka */
export function findBundleForCartId(id: number): BundleConfig | undefined {
  if (!Number.isInteger(id)) return undefined;
  const exact = BUNDLES.find((b) => id === b.id);
  if (exact) return exact;
  // Zakresy 3-słoikowych zestawów mogą się nakładać — wybieramy ten, którego kodowanie daje poprawne miody.
  const candidates = BUNDLES.filter((b) => id > b.cartBase && id < bundleRangeEnd(b));
  const matched = candidates.find((b) => parseBundleCartIdFor(b, id));
  return matched ?? candidates[0];
}

/** Przekreślona cena „osobno”, jeśli oszczędność jest wyraźna (co najmniej 5 zł). */
export function getVisibleBundleSale(productId: number): { regularPrice: number; price: number; savings: number } | null {
  const b = getBundleConfig(productId);
  if (!b || b.regularPrice - b.price < 5) return null;
  return { regularPrice: b.regularPrice, price: b.price, savings: b.regularPrice - b.price };
}

/** Miody dostępne teraz (na stanie, nie "wkrótce") w rozmiarze danego zestawu */
export function getBundleVarietiesFor(b: BundleConfig): Product[] {
  return products.filter(
    (p) =>
      p.category === "miody" &&
      p.unit === b.varietyUnit &&
      p.available !== false &&
      p.inStock > 0
  );
}

export function varietyShortName(p: Product): string {
  return p.name.split(" – ")[0].replace(/^Miód\s+/, "");
}

export function bundleCartIdFor(b: BundleConfig, ids: number[]): number {
  const sorted = [...ids].sort((x, y) => x - y);
  return b.cartBase + sorted.reduce((acc, v) => acc * BUNDLE_SLOT + v, 0);
}

/** Wybrane miody dla id pozycji zestawu albo null, jeśli id/wybór nieprawidłowy */
export function parseBundleCartIdFor(b: BundleConfig, id: number): Product[] | null {
  if (!Number.isInteger(id) || id <= b.cartBase || id >= bundleRangeEnd(b)) return null;
  let rest = id - b.cartBase;
  const ids: number[] = [];
  for (let i = 0; i < b.count; i++) {
    ids.unshift(rest % BUNDLE_SLOT);
    rest = Math.floor(rest / BUNDLE_SLOT);
  }
  const allowed = getBundleVarietiesFor(b);
  const chosen = ids.map((v) => allowed.find((p) => p.id === v));
  if (chosen.some((p) => !p)) return null;
  return chosen as Product[];
}

export function bundleVarietiesLabel(chosen: Product[]): string {
  return chosen.map(varietyShortName).join(" + ");
}

/** Pozycja koszyka dla zestawu z wybranymi miodami */
export function makeBundleCartProductFor(b: BundleConfig, ids: number[]): Product | null {
  if (ids.length !== b.count) return null;
  const id = bundleCartIdFor(b, ids);
  const chosen = parseBundleCartIdFor(b, id);
  const bundle = products.find((p) => p.id === b.id);
  if (!chosen || !bundle) return null;
  return {
    ...bundle,
    id,
    name: `${b.labelPrefix}: ${bundleVarietiesLabel(chosen)}`,
    price: b.price,
  };
}

// Zgodność wstecz: zestaw 2 słoików 1,2 kg
export const BUNDLE_ID = 20;
export const BUNDLE_PRICE = 95;
export function getBundleProduct(): Product {
  return products.find((p) => p.id === BUNDLE_ID)!;
}
export function getBundleVarieties(): Product[] {
  return getBundleVarietiesFor(getBundleConfig(BUNDLE_ID)!);
}


// ===== Zestawy świec z wyborem zawartości =====
// Kodowanie nie używa BUNDLE_SLOT=1000, bo 7 świec nie zmieściłoby się w bezpiecznym Number.
// Cztery formy mapujemy na cyfry 0–3 (slot 4). Zakresy cartBase są między zestawem 20 a 21,
// żeby id koszyka nie nakładały się na zestawy miodów.
export interface CandleBundleConfig {
  id: number;
  count: number;
  price: number;
  regularPrice: number;
  cartBase: number;
  labelPrefix: string;
  defaultIds: number[];
}

export const CANDLE_VARIETY_IDS = [30, 31, 33, 34] as const;
const CANDLE_BUNDLE_SLOT = 4;

export const CANDLE_BUNDLES: CandleBundleConfig[] = [
  {
    id: 36,
    count: 3,
    price: 49,
    regularPrice: 51,
    cartBase: 1_200_000,
    labelPrefix: "Zestaw świąteczny świec",
    defaultIds: [31, 33, 34],
  },
  {
    id: 35,
    count: 7,
    price: 119,
    regularPrice: 134,
    cartBase: 1_300_000,
    labelPrefix: "Zestaw świec z wosku pszczelego",
    defaultIds: [30, 31, 31, 33, 33, 34, 34],
  },
];

function candleBundleRangeEnd(b: CandleBundleConfig): number {
  return b.cartBase + Math.pow(CANDLE_BUNDLE_SLOT, b.count);
}

export function getCandleBundleConfig(id: number): CandleBundleConfig | undefined {
  return CANDLE_BUNDLES.find((b) => b.id === id);
}

export function isCandleSetProduct(id: number): boolean {
  return CANDLE_BUNDLES.some((b) => b.id === id);
}

export function findCandleBundleForCartId(id: number): CandleBundleConfig | undefined {
  if (!Number.isInteger(id)) return undefined;
  const exact = CANDLE_BUNDLES.find((b) => id === b.id);
  if (exact) return exact;
  return CANDLE_BUNDLES.find((b) => id > b.cartBase && id < candleBundleRangeEnd(b));
}

export function getCandleVarieties(): Product[] {
  return CANDLE_VARIETY_IDS
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined && p.available !== false && p.inStock > 0);
}

export function candleShortName(p: Product): string {
  switch (p.id) {
    case 30: return "walec z motywem roślinnym";
    case 31: return "aniołek";
    case 33: return "stary ul";
    case 34: return "walec z sercem";
    default: return p.name;
  }
}

export function candleBundleLabel(chosen: Product[]): string {
  const counts = new Map<string, number>();
  const order: string[] = [];
  for (const p of chosen) {
    const name = candleShortName(p);
    if (!counts.has(name)) order.push(name);
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return order.map((name) => {
    const n = counts.get(name) || 1;
    return n > 1 ? `${n} × ${name}` : name;
  }).join(", ");
}

function candleVarietyIndex(id: number): number {
  return CANDLE_VARIETY_IDS.indexOf(id as typeof CANDLE_VARIETY_IDS[number]);
}

export function candleBundleCartId(b: CandleBundleConfig, ids: number[]): number {
  const indices = ids.map(candleVarietyIndex);
  if (indices.some((i) => i < 0) || indices.length !== b.count) {
    throw new Error("Nieprawidłowy wybór świec w zestawie");
  }
  const sorted = [...indices].sort((a, b) => a - b);
  return b.cartBase + sorted.reduce((acc, v) => acc * CANDLE_BUNDLE_SLOT + v, 0);
}

export function parseCandleBundleCartId(b: CandleBundleConfig, id: number): Product[] | null {
  if (!Number.isInteger(id) || id <= b.cartBase || id >= candleBundleRangeEnd(b)) return null;
  let rest = id - b.cartBase;
  const indices: number[] = [];
  for (let i = 0; i < b.count; i++) {
    indices.unshift(rest % CANDLE_BUNDLE_SLOT);
    rest = Math.floor(rest / CANDLE_BUNDLE_SLOT);
  }
  if (rest !== 0) return null;
  const varieties = getCandleVarieties();
  const chosen = indices.map((idx) => varieties.find((p) => candleVarietyIndex(p.id) === idx));
  if (chosen.some((p) => !p)) return null;
  return chosen as Product[];
}

/** Cena zestawu, albo suma świec osobno — jeśli ta suma jest niższa. */
export function candleBundlePrice(b: CandleBundleConfig, chosen: Product[]): number {
  const singles = chosen.reduce((sum, p) => sum + p.price, 0);
  return Math.min(b.price, singles);
}

export function candleBundleSinglesTotal(chosen: Product[]): number {
  return chosen.reduce((sum, p) => sum + p.price, 0);
}

export function makeCandleBundleCartProduct(b: CandleBundleConfig, ids: number[]): Product | null {
  if (ids.length !== b.count) return null;
  let id: number;
  try {
    id = candleBundleCartId(b, ids);
  } catch {
    return null;
  }
  const chosen = parseCandleBundleCartId(b, id);
  const bundle = products.find((p) => p.id === b.id);
  if (!chosen || !bundle) return null;
  const price = candleBundlePrice(b, chosen);
  return {
    ...bundle,
    id,
    name: `${b.labelPrefix}: ${candleBundleLabel(chosen)}`,
    price,
  };
}

// ===== Pakowanie: duży słoik = 2 miejsca, mały = 1; paczka max 8 miejsc i max 6 małych =====
export const PACKAGE_UNITS = 8;
export const PACKAGE_MAX_SMALL = 6;
export const PACKING_NOTE =
  "Dla bezpieczeństwa słoików pakujemy maks. 4 duże (1,2 kg) albo 6 małych słoików w jednej paczce (1 duży = 2 małe). Większe zamówienie wyślemy w kilku paczkach. Poniżej 95 zł wartości produktów koszt dostawy liczony jest za każdą paczkę; od 95 zł wysyłka jest darmowa.";

/** Ile paczek potrzeba dla podanej liczby dużych i małych słoików oraz innych produktów */
export function packagesNeeded(large: number, small: number, other = 0): number {
  const units = large * 2 + small + other;
  if (units <= 0) return 0;
  return Math.max(Math.ceil(units / PACKAGE_UNITS), Math.ceil(small / PACKAGE_MAX_SMALL), 1);
}

/** Rozmiar słoika dla produktu miodowego */
export function jarSize(p: Product): "large" | "small" | null {
  if (p.category !== "miody") return null;
  return p.unit.includes("350") ? "small" : "large";
}

/** Liczba paczek dla koszyka (pozycje produktów i zestawów) */
export function packagesForCart(items: { id: number; quantity: number }[]): number {
  let large = 0, small = 0, other = 0;
  for (const it of items) {
    const q = it.quantity || 0;
    const candleBundle = findCandleBundleForCartId(it.id);
    const candleChosen = candleBundle ? parseCandleBundleCartId(candleBundle, it.id) : null;
    if (candleChosen) {
      other += candleChosen.length * q;
      continue;
    }
    const b = findBundleForCartId(it.id);
    const chosen = b ? parseBundleCartIdFor(b, it.id) : null;
    const list = chosen ?? [products.find((p) => p.id === it.id)].filter(Boolean) as Product[];
    for (const p of list) {
      const s = jarSize(p);
      if (s === "large") large += q;
      else if (s === "small") small += q;
      else other += packingUnits(p) * q;
    }
  }
  return Math.max(packagesNeeded(large, small, other), 1);
}
