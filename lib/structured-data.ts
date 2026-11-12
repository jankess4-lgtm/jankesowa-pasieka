import type { Product } from "./types";
import type { BlogPost } from "./blog";
import { pasiekaPhotos } from "./pasieka-photos";
import { GOOGLE_PROFILE_URL } from "./google-profile";

export const SITE_URL = "https://jankesowapasieka.pl";

export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const pasiekaImageUrls = pasiekaPhotos.map((photo) => `${SITE_URL}${photo.src}`);

/** LocalBusiness + Store — injected in the root layout (homepage and every page). */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Store"],
  name: "Jankesowa Pasieka",
  legalName: "Jankesowa Pasieka",
  description:
    "Rodzinna pasieka w Topolnie na Kujawach. Naturalny miód: akacjowy, wielokwiatowy, rzepakowo-mniszkowy. Wysyłka w całej Polsce, odbiór w Topolnie, Bydgoszczy i Świeciu.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: [`${SITE_URL}/logo.png`, `${SITE_URL}/og-image.jpg`, ...pasiekaImageUrls],
  telephone: "48514070298",
  email: "kontakt@jankesowapasieka.pl",
  priceRange: "40-110 PLN",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Topolno 45",
    addressLocality: "Pruszcz",
    postalCode: "86-120",
    addressRegion: "Kujawsko-Pomorskie",
    addressCountry: "PL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 53.3139954,
    longitude: 18.2237814,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "16:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "13:00",
    },
  ],
  sameAs: [GOOGLE_PROFILE_URL],
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function productJsonLd(product: Product) {
  const inStock = product.available !== false && product.inStock > 0;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${SITE_URL}${product.image}`,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "Jankesowa Pasieka",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/produkty/${product.slug}`,
      priceCurrency: "PLN",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Jankesowa Pasieka",
      },
    },
  };
}

export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: "pl-PL",
    author: {
      "@type": "Person",
      name: "Krzysztof",
      worksFor: {
        "@type": "Organization",
        name: "Jankesowa Pasieka",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Jankesowa Pasieka",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };
}
