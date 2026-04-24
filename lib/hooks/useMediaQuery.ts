"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * React hook wrapping `window.matchMedia`. Returns a boolean that
 * stays in sync with the query, using `useSyncExternalStore` so SSR
 * and hydration are handled cleanly.
 *
 * Server snapshot is always `false` — callers should treat the first
 * render as "doesn't match" and let the client settle.
 */
export function useMediaQuery(query: string): boolean {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
