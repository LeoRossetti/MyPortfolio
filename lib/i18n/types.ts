import type { Locale } from "./config";
import type en from "./dictionaries/en";

/**
 * Widen a deeply-`as const` literal type to its runtime equivalents.
 * Preserves object/array shape and tuple lengths, but turns literal
 * `"Home"` into `string` so locale variants can hold real translations.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : T extends object
          ? { readonly [K in keyof T]: Widen<T[K]> }
          : T;

/**
 * The shape of every dictionary, derived from the English one.
 * Adding a key to en.ts forces pt.ts to add it too — the build fails
 * otherwise. Literal-string types are widened so translations are allowed
 * to differ from the English source while preserving structure.
 */
export type Dictionary = Widen<typeof en>;

export type { Locale };
