"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { dispatchLocaleScramble } from "@/components/animation/Scramble";
import { useLocaleSwitcher } from "@/components/i18n/DictionaryProvider";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  ariaLabel: string;
};

const LOCALES: readonly Locale[] = ["en", "pt"] as const;

export function LocaleToggle({ ariaLabel }: Props) {
  const { locale: current, setLocale } = useLocaleSwitcher();

  const switchTo = useCallback(
    (target: Locale) => {
      if (target === current) return;
      // Fire scramble first so listeners start their animation immediately
      // off the click; the dictionary swap follows in the same tick. The
      // <Scramble> components read the latest target on every rAF tick, so
      // they naturally settle on the post-swap value.
      dispatchLocaleScramble();
      setLocale(target);
      const newPath = target === "en" ? "/" : `/${target}`;
      window.history.replaceState(null, "", newPath);
    },
    [current, setLocale],
  );

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1.5 font-mono text-sm"
    >
      {LOCALES.map((loc, i) => {
        const isActive = loc === current;
        return (
          <span key={loc} className="inline-flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden className="text-fg-dim">
                /
              </span>
            )}
            {isActive ? (
              <span
                aria-current="true"
                className="font-medium uppercase text-fg-primary"
              >
                {loc}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => switchTo(loc)}
                lang={loc === "pt" ? "pt-BR" : "en"}
                className={cn(
                  "cursor-pointer lowercase text-fg-dim transition-colors",
                  "hover:text-fg-primary",
                  "focus-visible:text-fg-primary focus-visible:outline-none",
                )}
              >
                {loc}
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
