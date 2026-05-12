"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

const COLORS: Record<Locale, [string, string]> = {
  pt: ["#009C3B", "#FFDF00"], // green, yellow alternating
  en: ["#012169", "#C8102E"], // UK blue, UK red alternating
};

const TIMING = {
  barDuration: 0.22, // each bar's tween length (seconds)
  stagger: 0.018, // delay between bars (seconds)
  hold: 0.08, // pause at full cover (seconds)
} as const;

export function LocaleTransition() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<Locale | null>(null);
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
    ({ target: newTarget }: StartTransitionDetail) => {
      if (phase !== "idle") return;
      setTarget(newTarget);
      setPhase("running");
    },
    [phase],
  );
  useLocaleTransitionListener(start);

  // Reduced-motion path: 200ms solid cross-fade, no GSAP
  useEffect(() => {
    if (!reducedMotion || phase !== "running" || !target) return;
    const destination = target === "en" ? "/" : `/${target}`;
    const pushTimer = window.setTimeout(() => router.push(destination), 100);
    const endTimer = window.setTimeout(() => {
      setPhase("idle");
      setTarget(null);
    }, 200);
    return () => {
      window.clearTimeout(pushTimer);
      window.clearTimeout(endTimer);
    };
  }, [reducedMotion, phase, target, router]);

  // GSAP path: stagger bars enter -> hold -> stagger exit
  const barsRef = useRef<HTMLDivElement[]>([]);
  useGSAP(
    () => {
      if (reducedMotion || phase !== "running" || !target) return;
      const bars = barsRef.current.filter((b): b is HTMLDivElement =>
        Boolean(b),
      );
      if (bars.length !== NUM_BARS) return;

      const destination = target === "en" ? "/" : `/${target}`;

      const tl = gsap.timeline({
        onComplete: () => {
          setPhase("idle");
          setTarget(null);
        },
      });

      // Start above the viewport
      gsap.set(bars, { yPercent: -100 });

      // Enter: stagger down to full cover
      tl.to(bars, {
        yPercent: 0,
        duration: TIMING.barDuration,
        ease: "power3.out",
        stagger: TIMING.stagger,
      });

      // Hold: empty tween to consume time so the timeline holds full cover
      tl.to({}, { duration: TIMING.hold });

      // Fire router.push at midpoint of the hold (absolute timeline position)
      const pushAt =
        TIMING.barDuration +
        (NUM_BARS - 1) * TIMING.stagger +
        TIMING.hold / 2;
      tl.call(() => router.push(destination), undefined, pushAt);

      // Exit: continue staggering down off-screen
      tl.to(bars, {
        yPercent: 100,
        duration: TIMING.barDuration,
        ease: "power3.in",
        stagger: TIMING.stagger,
      });

      return () => {
        tl.kill();
      };
    },
    { dependencies: [phase, target, reducedMotion, router] },
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
