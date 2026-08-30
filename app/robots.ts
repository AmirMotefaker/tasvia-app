import type { MetadataRoute } from "next";
import { SITE_URL } from "../src/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/product",
          "/solutions",
          "/security",
          "/pricing",
          "/about",
          "/contact",
          "/settlement-management",
          "/suppliers",
          "/reconciliation",
          "/financial-intelligence",
          "/integrations",
          "/developers",
          "/resources",
          "/faq",
          "/compare/variza",
        ],
        disallow: [
          "/api/",
          "/app",
          "/sign-in",
          "/demo",
          "/onboarding",
          "/settlements",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
