import { Product } from "./types";
// src/lib/structured-data.ts
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Jankesowa Pasieka",
  "description": "Rodzinna pasieka na Kujawach nad Wisłą w Topolnie (gmina Pruszcz, powiat świecki). Naturalne miody wirowane na zimno, bez pasteryzacji: akacjowy, wielokwiatowy, rzepakowo-mniszkowy, plastry miodu oraz świece z wosku pszczelego.",
  "url": "https://jankesowapasieka.pl",
  "telephone": "+48 514 070 298",
  "email": "jankesowa.pasieka@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Topolno 45",
    "addressLocality": "Pruszcz",
    "addressRegion": "Kujawsko-Pomorskie",
    "postalCode": "86-120",
    "addressCountry": "PL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 53.29089903087663,
    "longitude": 18.298882993735358
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "08:00",
    "closes": "20:00"
  },
  "priceRange": "$$",
  "image": [
    "https://jankesowapasieka.pl/logo.png",
    "https://jankesowapasieka.pl/og-image.jpg"
  ],
  "sameAs": [
    "https://g.page/r/CZ45MnMvHWX6EBM",
    // TODO: dodać linki do FB, IG
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Produkty pszczele Jankesowa Pasieka"
  }
};

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription || product.description,
    image: `https://jankesowapasieka.pl${product.image}`,
    sku: String(product.id),
    brand: { "@type": "Brand", name: "Jankesowa Pasieka" },
    offers: {
      "@type": "Offer",
      url: `https://jankesowapasieka.pl/produkty/${product.slug}`,
      priceCurrency: "PLN",
      price: product.price.toFixed(2),
      availability:
        product.available === false
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Jankesowa Pasieka" },
    },
  };
}
