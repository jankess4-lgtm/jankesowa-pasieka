import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { blogPosts } from "@/lib/blog";

const BASE_URL = "https://jankesowapasieka.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/produkty", "/o-nas", "/kontakt", "/blog", "/regulamin", "/polityka-prywatnosci"].map((path) => ({
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
  const blogPages = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pages, ...productPages, ...blogPages];
}
