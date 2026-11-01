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
    inStock: 30,        // aktualna ilość
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
    inStock: 20,        // aktualna ilość
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
    inStock: 12,        // aktualna ilość
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
    inStock: 30,        // aktualna ilość
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
    inStock: 20,        // aktualna ilość
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
];

// ===== Zestaw 2 słoików 1,2 kg =====
export const BUNDLE_ID = 20;
export const BUNDLE_PRICE = 110;
// Pozycja w koszyku ma id kodujące wybrane miody: 100000 + a*1000 + b (a <= b)
const BUNDLE_CART_BASE = 100000;

export function getBundleProduct(): Product {
  return products.find((p) => p.id === BUNDLE_ID)!;
}

/** Miody 1,2 kg dostępne teraz (na stanie, nie "wkrótce") */
export function getBundleVarieties(): Product[] {
  return products.filter(
    (p) =>
      p.category === "miody" &&
      p.unit === "900 ml (1,2 kg)" &&
      p.available !== false &&
      p.inStock > 0
  );
}

export function varietyShortName(p: Product): string {
  return p.name.split(" – ")[0].replace(/^Miód\s+/, "");
}

export function bundleCartId(a: number, b: number): number {
  const [x, y] = a <= b ? [a, b] : [b, a];
  return BUNDLE_CART_BASE + x * 1000 + y;
}

/** Zwraca wybrane miody dla id pozycji zestawu albo null, jeśli id/wybór nieprawidłowy */
export function parseBundleCartId(id: number): [Product, Product] | null {
  if (!Number.isInteger(id) || id <= BUNDLE_CART_BASE || id >= BUNDLE_CART_BASE * 2) return null;
  const rest = id - BUNDLE_CART_BASE;
  const a = Math.floor(rest / 1000);
  const b = rest % 1000;
  const allowed = getBundleVarieties();
  const pa = allowed.find((p) => p.id === a);
  const pb = allowed.find((p) => p.id === b);
  if (!pa || !pb) return null;
  return [pa, pb];
}

export function bundleVarietiesLabel(pair: [Product, Product]): string {
  return `${varietyShortName(pair[0])} + ${varietyShortName(pair[1])}`;
}

/** Pozycja koszyka dla zestawu z wybranymi miodami */
export function makeBundleCartProduct(a: number, b: number): Product | null {
  const id = bundleCartId(a, b);
  const pair = parseBundleCartId(id);
  const bundle = getBundleProduct();
  if (!pair || !bundle) return null;
  return {
    ...bundle,
    id,
    name: `Zestaw 2 × 1,2 kg: ${bundleVarietiesLabel(pair)}`,
    price: BUNDLE_PRICE,
  };
}
