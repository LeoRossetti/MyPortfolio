"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

function subscribe() {
  return () => {};
}

function getTouchSnapshot() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function getTouchServerSnapshot() {
  return false;
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const isTouch = useSyncExternalStore(
    subscribe,
    getTouchSnapshot,
    getTouchServerSnapshot,
  );
  const prefersReduced = useSyncExternalStore(
    subscribe,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 220, damping: 26, mass: 0.7 });
  const ringY = useSpring(cursorY, { stiffness: 220, damping: 26, mass: 0.7 });

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isTouch || prefersReduced) return;

    document.documentElement.classList.add("cursor-hidden");

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='hover']",
      );
      setIsHovering(Boolean(interactive));
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      document.documentElement.classList.remove("cursor-hidden");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [isTouch, prefersReduced, cursorX, cursorY]);

  if (isTouch || prefersReduced) return null;

  return (
    <>
      <style>{`
        html.cursor-hidden,
        html.cursor-hidden * {
          cursor: none !important;
        }
      `}</style>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-secondary)]"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 1 : 0,
        }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[99] size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          opacity: isVisible ? 1 : 0,
          borderColor: "var(--accent-primary)",
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          borderWidth: isHovering ? 2 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />
    </>
  );
}
