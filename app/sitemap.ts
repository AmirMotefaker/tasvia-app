import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tasvia.ir";
  const routes = [
    "", "/product", "/solutions", "/security", "/pricing", "/about", "/contact",
    "/settlement-management", "/suppliers", "/reconciliation", "/financial-intelligence",
    "/integrations", "/developers", "/resources", "/faq", "/compare/variza"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/product" ? 0.9 : 0.7,
  }));
}
