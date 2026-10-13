import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thulirtherapycentre.com";

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
