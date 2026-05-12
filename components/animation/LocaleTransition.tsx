"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import {
  useLocaleTransitionListener,
  type StartTransitionDetail,
} from "@/lib/hooks/use-locale-transition";
import type { Locale } from "@/lib/i18n/config";

type Phase = "idle" | "running";

const NUM_BARS = 6;

const COLORS: Record<Locale, [string, string, string]> = {
  pt: ["#009C3B", "#FFDF00", "#002776"], // green, yellow, blue cycling
  en: ["#012169", "#FFFFFF", "#C8102E"], // UK blue, white, red cycling
};

const TIMING = {
  enterDuration: 0.22, // each bar's tween length on the way in
  enterStagger: 0.018, // delay between bars on the way in
  enterEase: "power3.out", // punchy entry — bars land with deceleration
  hold: 0.1, // pause at full cover (seconds)
  exitDuration: 0.42, // longer exit for a more cinematic feel
  exitStagger: 0.028, // more pronounced stagger on the way out
  exitEase: "power2.inOut", // smooth glide off — no late-stage whip
} as const;

export function LocaleTransition() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<Locale | null>(null);
  // Ref (not state) so we don't re-render when only the callback identity
  // changes, and so the GSAP timeline reads the latest handler at fire time
  // instead of capturing a stale closure.
  const swapHandlerRef = useRef<(() => void) | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Subscribe to changes in the reduced-motion preference
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const start = useCallback(
    ({ target: newTarget, onSwap }: StartTransitionDetail) => {
      if (phase !== "idle") return;
      swapHandlerRef.current = onSwap ?? null;
      setTarget(newTarget);
      setPhase("running");
    },
    [phase],
  );
  useLocaleTransitionListener(start);

  // Reduced-motion path: 200ms solid cross-fade, no GSAP
  useEffect(() => {
    if (!reducedMotion || phase !== "running" || !target) return;
    const pushTimer = window.setTimeout(
      () => swapHandlerRef.current?.(),
      100,
    );
    const endTimer = window.setTimeout(() => {
      setPhase("idle");
      setTarget(null);
      swapHandlerRef.current = null;
    }, 200);
    return () => {
      window.clearTimeout(pushTimer);
      window.clearTimeout(endTimer);
    };
  }, [reducedMotion, phase, target]);

  // GSAP path: stagger bars enter -> hold -> stagger exit
  const barsRef = useRef<HTMLDivElement[]>([]);
  useGSAP(
    () => {
      if (reducedMotion || phase !== "running" || !target) return;
      const bars = barsRef.current.filter((b): b is HTMLDivElement =>
        Boolean(b),
      );
      if (bars.length !== NUM_BARS) return;

      const tl = gsap.timeline({
        onComplete: () => {
          setPhase("idle");
          setTarget(null);
          swapHandlerRef.current = null;
        },
      });

      // Start above the viewport
      gsap.set(bars, { yPercent: -100 });

      // Enter: stagger down to full cover
      tl.to(bars, {
        yPercent: 0,
        duration: TIMING.enterDuration,
        ease: TIMING.enterEase,
        stagger: TIMING.enterStagger,
      });

      // Hold: empty tween to consume time so the timeline holds full cover
      tl.to({}, { duration: TIMING.hold });

      // Fire the dictionary swap at midpoint of the hold (absolute timeline
      // position) — bars are fully covering the viewport, so the React tree
      // can re-render under the curtain without any visible flash.
      const pushAt =
        TIMING.enterDuration +
        (NUM_BARS - 1) * TIMING.enterStagger +
        TIMING.hold / 2;
      tl.call(() => swapHandlerRef.current?.(), undefined, pushAt);

      // Exit: continue staggering down off-screen with a longer, smoother glide
      tl.to(bars, {
        yPercent: 100,
        duration: TIMING.exitDuration,
        ease: TIMING.exitEase,
        stagger: TIMING.exitStagger,
      });

      return () => {
        tl.kill();
      };
    },
    { dependencies: [phase, target, reducedMotion] },
  );

  if (phase !== "running" || !target) return null;

  // Reduced-motion render path (Motion cross-fade)
  if (reducedMotion) {
    const dominantColor = target === "pt" ? COLORS.pt[0] : COLORS.en[0];
    return (
      <AnimatePresence>
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
            background: dominantColor,
            pointerEvents: "none",
          }}
          aria-hidden
        />
      </AnimatePresence>
    );
  }

  // GSAP render path: 6 vertical bars in a flex row
  const colors = COLORS[target];
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: NUM_BARS }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) barsRef.current[i] = el;
          }}
          style={{
            flex: 1,
            height: "100%",
            backgroundColor: colors[i % colors.length],
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
