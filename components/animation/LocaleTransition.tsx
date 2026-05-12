"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  useLocaleTransitionListener,
  type StartTransitionDetail,
} from "@/lib/hooks/use-locale-transition";
import type { Locale } from "@/lib/i18n/config";
import { BrazilFlag } from "@/components/icons/BrazilFlag";
import { UKFlag } from "@/components/icons/UKFlag";

type Phase = "idle" | "running";

const TIMING = {
  enter: 0.3,
  hold: 0.1,
  exit: 0.3,
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

  const isToPt = target === "pt";
  // EN -> PT: enter from left, exit to right.
  // PT -> EN: enter from right, exit to left.
  const enterFrom = isToPt ? "-100%" : "100%";
  const exitTo = isToPt ? "100%" : "-100%";

  const Flag = isToPt ? BrazilFlag : UKFlag;

  const flagStyles: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  };

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
              overflow: "hidden",
            }}
          >
            <Flag style={flagStyles} />
          </motion.div>
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
            overflow: "hidden",
          }}
        >
          <Flag style={flagStyles} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
