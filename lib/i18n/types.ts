import type { Locale } from "./config";
import type en from "./dictionaries/en";

/**
 * The shape of every dictionary, derived from the English one.
 * Adding a key to en.ts forces pt.ts to add it too — the build fails
 * otherwise.
 */
export type Dictionary = typeof en;

export type { Locale };
