import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/product", "/solutions", "/security", "/pricing", "/about", "/contact"],
        disallow: ["/demo", "/onboarding", "/settlements"],
      },
    ],
    sitemap: "https://tasvia.ir/sitemap.xml",
    host: "https://tasvia.ir",
  };
}
