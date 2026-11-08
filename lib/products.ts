import { Product } from "./types";

export const products: Product[] = [
  {
    id: 1,
    name: "Miód rzepakowo-mniszkowy – 900 ml (1,2 kg)",
    slug: "miod-rzepakowo-mniszkowy-900ml",
    description: "Jasnozłoty miód rzepakowo-mniszkowy. Delikatny, bardzo słodki z subtelnymi nutami mniszka.",
    longDescription: "Miód rzepakowo-mniszkowy to wyjątkowe połączenie nektaru rzepaku i mniszka lekarskiego. Pochodzi z obfitych, wczesnowiosennych pożytków na kujawskich polach nad Wisłą. Charakteryzuje się jasnozłotą barwą, bardzo słodkim i delikatnym smakiem z subtelną kwiatową nutą mniszka. Szybko krystalizuje, tworząc drobną, kremową konsystencję.",
    price: 60,
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
    price: 60,
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
    id: 13,
    name: "Świece z wosku pszczelego",
    slug: "swiece-z-wosku-pszczelego",
    description: "Naturalne świece 100% z wosku pszczelego.",
    longDescription: "Ręcznie wytwarzane świece ze 100% czystego wosku pszczelego.",
    price: 32,
    unit: "150 g",
    category: "produkty",
    image: "/images/swiece-z-wosku-pszczelego.PNG",
    inStock: 10,        // aktualna ilość
    available: true,
  },
  {
    id: 20,
    name: "Zestaw 2 słoików miodu – 2 × 900 ml (2 × 1,2 kg)",
    slug: "zestaw-2-sloikow-miodu-900ml",
    description: "Dwa duże słoiki miodu 1,2 kg do wyboru za 110 zł – oszczędzasz 10 zł, a wysyłka kosztuje tyle samo co za jeden słoik.",
    longDescription: "Zestaw dwóch dużych słoików miodu 900 ml (1,2 kg) z naszej pasieki w Topolnie. Sam wybierasz dwa rodzaje spośród dostępnych miodów – możesz też wziąć dwa takie same. Płacisz 110 zł zamiast 120 zł za dwa pojedyncze słoiki, czyli oszczędzasz 10 zł, a wysyłka kosztuje tyle samo co za jeden słoik. Miód naturalny, niepasteryzowany, w szklanych słoikach.",
    price: 110,
    unit: "2 × 900 ml (2 × 1,2 kg)",
    category: "zestawy",
    image: "/images/miod-rzepakowo-mniszkowy-1-2-kg.webp",
    inStock: 15,
    available: true,
    badgeText: "Oszczędzasz 10 zł",
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
];

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
    id: 20, count: 2, varietyUnit: "900 ml (1,2 kg)", price: 110, regularPrice: 120,
    // 100000 + a*1000 + b (a <= b) – kodowanie bez zmian względem pierwszej wersji
    cartBase: 100000, labelPrefix: "Zestaw 2 × 1,2 kg", jarLabel: "900 ml", jarShort: "1,2 kg",
    feedNetWeightKg: 2.4, feedPackagingKg: 0.7,
  },
  {
    id: 21, count: 3, varietyUnit: "350 ml (0,49 kg)", price: 80, regularPrice: 90,
    cartBase: 2000000, labelPrefix: "Zestaw 3 × 350 ml", jarLabel: "350 ml", jarShort: "0,49 kg",
    feedNetWeightKg: 1.47, feedPackagingKg: 0.6,
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
  return BUNDLES.find((b) => id === b.id || (id > b.cartBase && id < bundleRangeEnd(b)));
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
export const BUNDLE_PRICE = 110;
export function getBundleProduct(): Product {
  return products.find((p) => p.id === BUNDLE_ID)!;
}
export function getBundleVarieties(): Product[] {
  return getBundleVarietiesFor(getBundleConfig(BUNDLE_ID)!);
}

// ===== Pakowanie: duży słoik = 2 miejsca, mały = 1; paczka max 8 miejsc i max 6 małych =====
export const PACKAGE_UNITS = 8;
export const PACKAGE_MAX_SMALL = 6;
export const PACKING_NOTE =
  "Dla bezpieczeństwa słoików pakujemy maks. 4 duże (1,2 kg) albo 6 małych słoików w jednej paczce (1 duży = 2 małe). Większe zamówienie wyślemy w kilku paczkach – koszt dostawy liczony jest za każdą paczkę.";

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
    const b = findBundleForCartId(it.id);
    const chosen = b ? parseBundleCartIdFor(b, it.id) : null;
    const list = chosen ?? [products.find((p) => p.id === it.id)].filter(Boolean) as Product[];
    for (const p of list) {
      const s = jarSize(p);
      if (s === "large") large += q;
      else if (s === "small") small += q;
      else if (p.id === 12) other += q;
    }
  }
  return Math.max(packagesNeeded(large, small, other), 1);
}
