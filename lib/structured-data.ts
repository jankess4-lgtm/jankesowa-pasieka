// src/lib/structured-data.ts
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Jankesowa Pasieka",
  "description": "Rodzinna pasieka na Kujawach nad Wisłą w Topolnie. Oferujemy naturalne miody wirowane na zimno, bez pasteryzacji i sztucznych dodatków. Miód lipowy, akacjowy, wielokwiatowy, gryczany oraz inne produkty pszczele prosto z ula.",
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
    // dodaj tu linki do FB, IG itp. jeśli masz
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Produkty pszczele Jankesowa Pasieka"
  }
};