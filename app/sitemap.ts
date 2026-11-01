import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

const BASE_URL = "https://jankesowapasieka.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/produkty", "/o-nas", "/kontakt", "/regulamin", "/polityka-prywatnosci"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/produkty" ? 0.9 : 0.5,
  }));
  const productPages = products.map((p) => ({
    url: `${BASE_URL}/produkty/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p.available === false ? 0.4 : 0.8,
  }));
  return [...pages, ...productPages];
}
