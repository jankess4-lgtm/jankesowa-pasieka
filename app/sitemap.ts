import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { blogPosts } from "@/lib/blog";

const SITE = "https://jankesowapasieka.pl";

/** Stable lastmod for static shop pages (avoid a fresh timestamp on every crawl). */
const SITE_PAGES_UPDATED = new Date("2026-11-11T12:00:00+01:00");
const CATALOG_UPDATED = new Date("2026-11-11T12:00:00+01:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: SITE_PAGES_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/produkty`, lastModified: CATALOG_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/o-nas`, lastModified: SITE_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/kontakt`, lastModified: SITE_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/blog`, lastModified: SITE_PAGES_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/regulamin`, lastModified: SITE_PAGES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/polityka-prywatnosci`, lastModified: SITE_PAGES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE}/produkty/${p.slug}`,
    lastModified: CATALOG_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T12:00:00+01:00`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...productPages, ...blogPages];
}
