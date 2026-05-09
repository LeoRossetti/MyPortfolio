"use client";
import { usePathname } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

export function useCurrentLocale(): Locale {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) return first;
  return defaultLocale;
}
