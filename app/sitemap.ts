import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/`,
          "pt-BR": `${siteUrl}/pt`,
        },
      },
    },
    {
      url: `${siteUrl}/pt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${siteUrl}/`,
          "pt-BR": `${siteUrl}/pt`,
        },
      },
    },
  ];
}
