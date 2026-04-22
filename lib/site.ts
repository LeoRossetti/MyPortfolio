/**
 * Single source of truth for the site's canonical URL.
 * Used by metadata, OG image, sitemap, and robots.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://leorossetti.dev";
