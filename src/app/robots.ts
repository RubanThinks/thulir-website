import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteConfig.brand.officialWebsite;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/programs", "/gallery", "/stories", "/impact", "/contact"],
        disallow: ["/admin/", "/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
