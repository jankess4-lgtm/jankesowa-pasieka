import { products, getBundleConfig } from "@/lib/products";
import { Product } from "@/lib/types";

export const revalidate = 3600;

const BASE_URL = "https://jankesowapasieka.pl";

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Masa netto z pola unit, np. "900 ml (1,2 kg)" -> 1.2, "150 g" -> 0.15
function netWeightKg(unit: string): number | null {
  const kg = unit.match(/(\d+(?:,\d+)?)\s*kg/);
  if (kg) return parseFloat(kg[1].replace(",", "."));
  const g = unit.match(/^(\d+)\s*g$/);
  if (g) return parseInt(g[1], 10) / 1000;
  return null;
}

function itemXml(p: Product) {
  const isHoney = p.category === "miody" || p.category === "zestawy" || p.slug === "plastry-miodu";
  const bundle = getBundleConfig(p.id);
  const weight = bundle ? bundle.feedNetWeightKg : netWeightKg(p.unit);
  const fixedWeight = /^\d+(,\d+)?\s*kg\)?$/.test(p.unit.replace(/^.*\(/, "")) || /^\d+\s*g$/.test(p.unit);
  // Waga wysyłkowa: masa netto + szacunkowo słoik/opakowanie
  const shippingWeight =
    weight !== null ? (weight + (bundle ? bundle.feedPackagingKg : isHoney ? 0.35 : 0.1)).toFixed(2) : p.slug === "plastry-miodu" ? "0.60" : null;

  const lines = [
    `<g:id>${esc(p.slug!)}</g:id>`,
    `<title>${esc(p.name.includes("kg") ? p.name : `${p.name} – ${p.unit.replace(/^plaster /, "")}`)}</title>`,
    `<description>${esc(p.longDescription || p.description)}</description>`,
    `<link>${BASE_URL}/produkty/${esc(p.slug!)}</link>`,
    `<g:image_link>${BASE_URL}${encodeURI(p.image)}</g:image_link>`,
    `<g:availability>in_stock</g:availability>`,
    `<g:price>${p.price.toFixed(2)} PLN</g:price>`,
    `<g:condition>new</g:condition>`,
    `<g:brand>Jankesowa Pasieka</g:brand>`,
    `<g:identifier_exists>no</g:identifier_exists>`,
    isHoney
      ? `<g:google_product_category>4947</g:google_product_category>`
      : `<g:google_product_category>588</g:google_product_category>`,
    `<g:product_type>${isHoney ? "Miody" : "Produkty pszczele &gt; Świece z wosku pszczelego"}</g:product_type>`,
  ];
  if (isHoney && weight !== null && fixedWeight) {
    lines.push(`<g:unit_pricing_measure>${weight} kg</g:unit_pricing_measure>`);
    lines.push(`<g:unit_pricing_base_measure>1 kg</g:unit_pricing_base_measure>`);
  }
  if (shippingWeight) lines.push(`<g:shipping_weight>${shippingWeight} kg</g:shipping_weight>`);
  lines.push(
    `<g:shipping><g:country>PL</g:country><g:service>Paczkomat InPost</g:service><g:price>14.00 PLN</g:price></g:shipping>`
  );
  return `    <item>\n      ${lines.join("\n      ")}\n    </item>`;
}

export function GET() {
  const items = products.filter((p) => p.available !== false && p.slug).map(itemXml).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Jankesowa Pasieka – miody prosto z pasieki</title>
    <link>${BASE_URL}</link>
    <description>Naturalne miody i produkty pszczele z pasieki w Topolnie</description>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
