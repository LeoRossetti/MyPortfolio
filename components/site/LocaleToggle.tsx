"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { dispatchLocaleTransition } from "@/lib/hooks/use-locale-transition";
import { useCurrentLocale } from "@/lib/hooks/use-current-locale";
import { BrazilFlag } from "@/components/icons/BrazilFlag";
import { UKFlag } from "@/components/icons/UKFlag";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  ariaLabel: string;
  enLabel: string;
  ptLabel: string;
  size?: "sm" | "lg";
};

export function LocaleToggle({ ariaLabel, enLabel, ptLabel, size = "sm" }: Props) {
  const current = useCurrentLocale();
  const router = useRouter();

  const destination: Locale = current === "en" ? "pt" : "en";

  const switchTo = useCallback(() => {
    document.cookie = `NEXT_LOCALE=${destination}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    router.prefetch(destination === "en" ? "/" : `/${destination}`);
    dispatchLocaleTransition(destination);
  }, [destination, router]);

  const CurrentFlag = current === "pt" ? BrazilFlag : UKFlag;
  const currentLabel = current === "pt" ? ptLabel : enLabel;

  const dimensions =
    size === "lg"
      ? { height: "h-11", flag: "h-5 w-7", text: "text-sm", gap: "gap-2.5", px: "px-3.5" }
      : { height: "h-8", flag: "h-3.5 w-5", text: "text-xs", gap: "gap-2", px: "px-3" };

  return (
    <button
      type="button"
      onClick={switchTo}
      aria-label={`${ariaLabel}: ${currentLabel}`}
      className={cn(
        "inline-flex items-center rounded-full border border-border-subtle bg-bg-elevated/40 backdrop-blur transition-colors hover:border-border-strong",
        dimensions.height,
        dimensions.px,
        dimensions.gap,
      )}
    >
      <span
        className={cn(
          "inline-flex overflow-hidden rounded-sm ring-1 ring-black/20",
          dimensions.flag,
        )}
        aria-hidden
      >
        <CurrentFlag className="h-full w-full" />
      </span>
      <span
        className={cn(
          "font-mono uppercase tracking-[0.18em] text-fg-primary",
          dimensions.text,
        )}
      >
        {currentLabel}
      </span>
    </button>
  );
}
