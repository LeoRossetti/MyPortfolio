"use client";

import { useCallback, useState } from "react";
import { DropdownMenu } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { dispatchLocaleTransition } from "@/lib/hooks/use-locale-transition";
import { useLocaleSwitcher } from "@/components/i18n/DictionaryProvider";
import { BrazilFlag } from "@/components/icons/BrazilFlag";
import { UKFlag } from "@/components/icons/UKFlag";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  ariaLabel: string;
};

// Native language names — these are proper nouns, not translatable.
const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  pt: "Português",
};

const FLAGS: Record<Locale, React.FC<React.SVGProps<SVGSVGElement>>> = {
  en: UKFlag,
  pt: BrazilFlag,
};

export function LocaleToggle({ ariaLabel }: Props) {
  const { locale: current, setLocale } = useLocaleSwitcher();
  const [open, setOpen] = useState(false);

  const switchTo = useCallback(
    (target: Locale) => {
      setOpen(false);
      if (target === current) return;
      // Cookie persistence for return visits
      document.cookie = `NEXT_LOCALE=${target}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      // Fire wipe; the transition calls onSwap at the hold midpoint
      dispatchLocaleTransition(target, () => {
        setLocale(target);
        const newPath = target === "en" ? "/" : `/${target}`;
        window.history.replaceState(null, "", newPath);
      });
    },
    [current, setLocale],
  );

  const CurrentFlag = FLAGS[current];

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`${ariaLabel}: ${LANGUAGE_NAMES[current]}`}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm font-mono text-sm transition-colors",
            "text-fg-muted hover:text-fg-primary focus-visible:text-fg-primary focus-visible:outline-none",
            "data-[state=open]:text-fg-primary",
          )}
        >
          <span
            className="inline-flex h-3.5 w-5 overflow-hidden rounded-sm ring-1 ring-black/20"
            aria-hidden
          >
            <CurrentFlag className="h-full w-full" />
          </span>
          <span className="lowercase">{current}</span>
          <ChevronDown
            className="size-3 transition-transform duration-200 data-[state=open]:rotate-180"
            aria-hidden
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className={cn(
            "z-50 min-w-[170px] overflow-hidden rounded-lg border border-border-subtle bg-bg-base/95 p-1 shadow-lg backdrop-blur-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-1",
          )}
        >
          {(["en", "pt"] as const).map((loc) => {
            const Flag = FLAGS[loc];
            const isActive = loc === current;
            return (
              <DropdownMenu.Item
                key={loc}
                onSelect={() => switchTo(loc)}
                className={cn(
                  "relative flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm outline-none transition-colors",
                  "focus:bg-bg-elevated/60",
                  "data-[highlighted]:bg-bg-elevated/60",
                  isActive
                    ? "text-fg-primary font-medium"
                    : "text-fg-muted hover:text-fg-primary",
                )}
              >
                <span className="flex w-4 items-center justify-center">
                  {isActive && <Check className="size-3.5" aria-hidden />}
                </span>
                <span
                  className="inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-sm ring-1 ring-black/20"
                  aria-hidden
                >
                  <Flag className="h-full w-full" />
                </span>
                <span>{LANGUAGE_NAMES[loc]}</span>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
