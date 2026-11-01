import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/koszyk", "/success", "/cancel"] }],
    sitemap: "https://jankesowapasieka.pl/sitemap.xml",
    host: "https://jankesowapasieka.pl",
  };
}
