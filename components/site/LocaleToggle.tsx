"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { dispatchLocaleTransition } from "@/lib/hooks/use-locale-transition";
import { useCurrentLocale } from "@/lib/hooks/use-current-locale";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  ariaLabel: string;
  enLabel: string;
  ptLabel: string;
  /** Larger tap target for inside StaggeredMenu. */
  size?: "sm" | "lg";
};

export function LocaleToggle({ ariaLabel, enLabel, ptLabel, size = "sm" }: Props) {
  const current = useCurrentLocale();
  const router = useRouter();

  const switchTo = useCallback(
    (target: Locale) => {
      if (target === current) return;
      // Persist the choice for return visits. 1-year expiry, root path,
      // SameSite=Lax (cookie sent on top-level GETs from external sites
      // — important for shared links).
      document.cookie = `NEXT_LOCALE=${target}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      router.prefetch(target === "en" ? "/" : `/${target}`);
      dispatchLocaleTransition(target);
    },
    [current, router],
  );

  const sizeClasses = size === "lg" ? "h-11 text-sm" : "h-8 text-xs";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex overflow-hidden rounded-full border border-border-subtle bg-bg-elevated/40 backdrop-blur",
        sizeClasses,
      )}
    >
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={current === "en"}
        className={cn(
          "px-3 font-mono uppercase tracking-[0.18em] transition-colors",
          current === "en"
            ? "bg-fg-primary text-bg-base"
            : "text-fg-muted hover:text-fg-primary",
        )}
      >
        {enLabel}
      </button>
      <span aria-hidden className="w-px bg-border-subtle" />
      <button
        type="button"
        onClick={() => switchTo("pt")}
        aria-pressed={current === "pt"}
        className={cn(
          "px-3 font-mono uppercase tracking-[0.18em] transition-colors",
          current === "pt"
            ? "bg-fg-primary text-bg-base"
            : "text-fg-muted hover:text-fg-primary",
        )}
      >
        {ptLabel}
      </button>
    </div>
  );
}
