"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  useLocaleTransitionListener,
  type StartTransitionDetail,
} from "@/lib/hooks/use-locale-transition";
import type { Locale } from "@/lib/i18n/config";

type Phase = "idle" | "running";

const TIMING = {
  enter: 0.3, // 300ms
  hold: 0.1, // 100ms
  exit: 0.3, // 300ms
} as const;

const EASING = [0.65, 0, 0.35, 1] as const;

export function LocaleTransition() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<Locale | null>(null);

  const start = useCallback(
    ({ target }: StartTransitionDetail) => {
      if (phase !== "idle") return;
      setTarget(target);
      setPhase("running");

      const destination = target === "en" ? "/" : `/${target}`;

      // router.push fires at the "hold" midpoint so the new page is mounted
      // under the curtain. enter (300ms) -> push at 350ms (mid-hold) -> exit (300ms).
      const pushAt = (TIMING.enter + TIMING.hold / 2) * 1000;
      window.setTimeout(() => {
        router.push(destination);
      }, pushAt);

      const totalMs = (TIMING.enter + TIMING.hold + TIMING.exit) * 1000;
      window.setTimeout(() => {
        setPhase("idle");
        setTarget(null);
      }, totalMs);
    },
    [phase, router],
  );

  useLocaleTransitionListener(start);

  // EN -> PT: white panel, enter from left (-100%), exit to right (+100%), text "PT" black
  // PT -> EN: black panel, enter from right (+100%), exit to left (-100%), text "EN" white
  const isToPt = target === "pt";
  const panelBg = isToPt ? "#ffffff" : "#000000";
  const textColor = isToPt ? "#000000" : "#ffffff";
  const code = isToPt ? "PT" : "EN";
  const enterFrom = isToPt ? "-100%" : "100%";
  const exitTo = isToPt ? "100%" : "-100%";

  if (reducedMotion && phase === "running") {
    return (
      <AnimatePresence>
        {phase === "running" && (
          <motion.div
            key="cross-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: panelBg,
            }}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {phase === "running" && (
        <motion.div
          key="curtain"
          aria-hidden
          initial={{ x: enterFrom }}
          animate={{
            x: ["0%", "0%", exitTo],
            transition: {
              times: [
                TIMING.enter / (TIMING.enter + TIMING.hold + TIMING.exit),
                (TIMING.enter + TIMING.hold) /
                  (TIMING.enter + TIMING.hold + TIMING.exit),
                1,
              ],
              duration: TIMING.enter + TIMING.hold + TIMING.exit,
              ease: EASING,
            },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: panelBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: textColor,
            fontFamily: "var(--font-geist-mono)",
            fontSize: "clamp(4rem, 12vw, 10rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              transition: {
                times: [0, 0.4, 0.7, 1],
                duration: TIMING.enter + TIMING.hold + TIMING.exit,
                ease: "linear",
              },
            }}
          >
            {code}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
