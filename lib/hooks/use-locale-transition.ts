"use client";
import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";

const EVENT_NAME = "locale-transition:start";

export type StartTransitionDetail = {
  target: Locale;
  /**
   * Called by the transition at the "full cover" hold midpoint. Use it to
   * swap dictionary state and update the URL while the curtain hides the
   * change.
   */
  onSwap?: () => void;
};

export function dispatchLocaleTransition(
  target: Locale,
  onSwap?: () => void,
) {
  window.dispatchEvent(
    new CustomEvent<StartTransitionDetail>(EVENT_NAME, {
      detail: { target, onSwap },
    }),
  );
}

export function useLocaleTransitionListener(
  handler: (detail: StartTransitionDetail) => void,
) {
  useEffect(() => {
    const onEvent = (e: Event) => {
      const ce = e as CustomEvent<StartTransitionDetail>;
      handler(ce.detail);
    };
    window.addEventListener(EVENT_NAME, onEvent);
    return () => window.removeEventListener(EVENT_NAME, onEvent);
  }, [handler]);
}
