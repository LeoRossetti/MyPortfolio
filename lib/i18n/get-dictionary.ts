import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaries = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  pt: () => import("./dictionaries/pt").then((m) => m.default),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
