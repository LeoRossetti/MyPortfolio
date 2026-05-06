"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { TerminalLine } from "@/lib/data/hero";
import type { Dictionary } from "@/lib/i18n/types";

type TerminalDict = Dictionary["hero"]["terminal"];
type TerminalChrome = Dictionary["terminal"];

type Props = {
  lines: TerminalLine[];
  /** Slice of the dictionary used to look up the visible text for each line. */
  terminalDict: TerminalDict;
  /** Localised chrome (window title + aria-label). */
  chrome: TerminalChrome;
  /** ms per character */
  speed?: number;
  /** ms pause after a command line finishes typing before the next line starts */
  linePause?: number;
  /** start typing only after this many ms */
  startDelay?: number;
  className?: string;
};

type RenderedLine = {
  source: TerminalLine;
  /** how many characters of `text` are currently revealed */
  reveal: number;
  done: boolean;
};

function getText(line: TerminalLine, terminalDict: TerminalDict): string {
  if (line.kind === "blank") return "";
  const value = terminalDict[line.key as keyof TerminalDict];
  return typeof value === "string" ? value : "";
}

function fullReveal(
  lines: TerminalLine[],
  terminalDict: TerminalDict,
): RenderedLine[] {
  return lines.map((source) => ({
    source,
    reveal: getText(source, terminalDict).length,
    done: true,
  }));
}

function emptyReveal(lines: TerminalLine[]): RenderedLine[] {
  return lines.map((source) => ({ source, reveal: 0, done: false }));
}

export function TypingTerminal(props: Props) {
  const prefersReduced = usePrefersReducedMotion();
  // Remount on motion preference changes so initial state is derived correctly,
  // avoiding setState-in-effect.
  return (
    <TypingTerminalInner
      key={prefersReduced ? "static" : "animated"}
      {...props}
      prefersReduced={prefersReduced}
    />
  );
}

function TypingTerminalInner({
  lines,
  terminalDict,
  chrome,
  speed = 22,
  linePause = 280,
  startDelay = 400,
  className,
  prefersReduced,
}: Props & { prefersReduced: boolean }) {
  const [rendered, setRendered] = useState<RenderedLine[]>(() =>
    prefersReduced ? fullReveal(lines, terminalDict) : emptyReveal(lines),
  );
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (prefersReduced) return;

    const timers = timersRef.current;
    let elapsed = startDelay;

    lines.forEach((line, lineIdx) => {
      const text = getText(line, terminalDict);

      if (line.kind === "blank") {
        const t = setTimeout(() => {
          setRendered((prev) => {
            const next = [...prev];
            next[lineIdx] = { source: line, reveal: 0, done: true };
            return next;
          });
        }, elapsed);
        timers.push(t);
        elapsed += linePause / 2;
        return;
      }

      for (let i = 1; i <= text.length; i++) {
        const charDelay = elapsed + i * speed;
        const t = setTimeout(() => {
          setRendered((prev) => {
            const next = [...prev];
            next[lineIdx] = {
              source: line,
              reveal: i,
              done: i === text.length,
            };
            return next;
          });
        }, charDelay);
        timers.push(t);
      }

      elapsed += text.length * speed + linePause;
    });

    return () => {
      timers.forEach(clearTimeout);
      timersRef.current = [];
    };
    // lines is stable per remount; speed/pause/startDelay only change on prop edit
  }, [lines, terminalDict, speed, linePause, startDelay, prefersReduced]);

  const allDone = rendered.every((l) => l.done);

  return (
    <div
      className={cn(
        "border-border-subtle bg-bg-elevated/70 relative w-full overflow-hidden rounded-2xl border shadow-2xl shadow-black/40 backdrop-blur-xl",
        className,
      )}
      role="presentation"
      aria-label={chrome.ariaLabel}
    >
      <div className="border-border-subtle bg-bg-base/50 flex items-center gap-2 border-b px-4 py-2.5">
        <span className="size-3 rounded-full bg-[#FF5F56]" />
        <span className="size-3 rounded-full bg-[#FFBD2E]" />
        <span className="size-3 rounded-full bg-[#27C93F]" />
        <span className="text-fg-dim ml-3 truncate font-mono text-[11px] tracking-wide">
          {chrome.title}
        </span>
      </div>

      <div className="px-4 py-4 font-mono text-[12.5px] leading-relaxed sm:px-6 sm:py-5 sm:text-sm">
        {rendered.map((line, idx) => {
          const text = getText(line.source, terminalDict);
          const visible = text.slice(0, line.reveal);
          const isLastVisible = !allDone && line.reveal > 0 && !line.done;
          const isFinalLine =
            allDone &&
            idx === rendered.length - 1 &&
            line.source.kind !== "blank";

          if (line.source.kind === "blank") {
            return <div key={idx} className="h-3" aria-hidden />;
          }

          if (line.source.kind === "command") {
            return (
              <div key={idx} className="flex items-baseline gap-2">
                <span className="text-[var(--accent-secondary)] select-none">
                  {line.source.prompt ?? "~"}
                </span>
                <span className="text-fg-dim select-none">$</span>
                <span className="text-fg-primary">
                  {visible}
                  {(isLastVisible || isFinalLine) && <Caret />}
                </span>
              </div>
            );
          }

          const tone = line.source.tone ?? "default";
          return (
            <div
              key={idx}
              className={cn(
                "pl-5",
                tone === "accent"
                  ? "text-[var(--accent-primary)]"
                  : tone === "muted"
                    ? "text-fg-muted"
                    : "text-fg-primary",
              )}
            >
              {visible}
              {(isLastVisible || isFinalLine) && <Caret />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Caret() {
  return (
    <span className="ml-0.5 inline-block h-[1em] w-[0.55em] -translate-y-[0.1em] animate-[caret_900ms_steps(2,jump-none)_infinite] bg-[var(--accent-secondary)] align-middle" />
  );
}
