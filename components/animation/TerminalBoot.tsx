"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type BootLine = {
  prompt?: string;
  text: string;
  tone: "muted" | "primary" | "accent";
};

const bootLines: BootLine[] = [
  { prompt: "~", text: "init portfolio@2026", tone: "muted" },
  {
    prompt: "~",
    text: "loading modules [next, react, motion, gsap] ..... ok",
    tone: "primary",
  },
  {
    prompt: "~",
    text: "booting ui ....................................... ok",
    tone: "primary",
  },
  { prompt: "~", text: "ready.", tone: "accent" },
];

const LINE_CADENCE_MS = 200;
const POST_LINE_PAUSE_MS = 200;
const WIPE_DURATION_MS = 500;
const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Full-screen terminal "boot" overlay played on every page load.
 * Respects `prefers-reduced-motion`.
 * Mounts at root in `app/layout.tsx`.
 *
 * (Earlier versions gated this on a `sessionStorage` flag so it only played
 * once per tab; gate removed during design iteration so every reload
 * replays the intro.)
 */
export function TerminalBoot() {
  const prefersReduced = usePrefersReducedMotion();
  const [finished, setFinished] = useState(false);

  if (prefersReduced || finished) return null;

  return <BootSequence onComplete={() => setFinished(true)} />;
}

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const timers: ReturnType<typeof setTimeout>[] = [];
    const total = bootLines.length;

    for (let i = 1; i <= total; i++) {
      timers.push(
        setTimeout(() => setVisibleLines(i), i * LINE_CADENCE_MS),
      );
    }

    const wipeAt = total * LINE_CADENCE_MS + POST_LINE_PAUSE_MS;
    timers.push(setTimeout(() => setWiping(true), wipeAt));

    const completeAt = wipeAt + WIPE_DURATION_MS;
    timers.push(setTimeout(onComplete, completeAt));

    return () => {
      timers.forEach(clearTimeout);
      body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return (
    <motion.div
      aria-hidden
      initial={{ y: 0 }}
      animate={{ y: wiping ? "-100%" : 0 }}
      transition={{ duration: WIPE_DURATION_MS / 1000, ease: EASE }}
      className="bg-bg-base pointer-events-none fixed inset-0 z-[100] flex items-center justify-center font-mono"
    >
      <div className="bg-grid absolute inset-0 opacity-30" />
      <div className="bg-radial-glow absolute inset-0" />

      {/* Bottom accent strip */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-60"
      />

      <div className="relative w-full max-w-2xl px-6 sm:px-10">
        {bootLines.slice(0, visibleLines).map((line, i) => {
          const isLastVisible = i === visibleLines - 1 && !wiping;
          const toneClass =
            line.tone === "accent"
              ? "text-[var(--accent-primary)]"
              : line.tone === "primary"
                ? "text-fg-primary"
                : "text-fg-muted";
          return (
            <div
              key={i}
              className={`py-1 text-sm leading-relaxed sm:text-base ${toneClass}`}
            >
              <span className="text-[var(--accent-secondary)] select-none">
                {line.prompt ?? "~"}{" "}
              </span>
              <span className="text-fg-dim select-none">$ </span>
              <span>{line.text}</span>
              {isLastVisible && <Caret />}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function Caret() {
  return (
    <span className="ml-0.5 inline-block h-[1em] w-[0.5em] -translate-y-[0.1em] animate-[caret_900ms_steps(2,jump-none)_infinite] bg-[var(--accent-secondary)] align-middle" />
  );
}
