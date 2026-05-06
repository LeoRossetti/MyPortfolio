"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/data/services";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { TechChip } from "@/components/site/TechChip";

type Props = {
  service: Service;
  /** Localised copy for this service (title + pitch). */
  copy: { title: string; pitch: string };
  className?: string;
};

export function ServiceCard({ service, copy, className }: Props) {
  const { icon: Icon, tech } = service;
  const { title, pitch } = copy;
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // mouse-tracked spotlight position (percent within card)
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  // subtle tilt (capped at ~3deg)
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    mouseX.set(px);
    mouseY.set(py);
    // tilt: offset from center, scaled to a small angle
    rotY.set(((px - 50) / 50) * 2.4);
    rotX.set(((50 - py) / 50) * 1.8);
  };

  const onMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.1), transparent 70%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "group bg-bg-elevated/60 border-border-subtle hover:border-border-strong relative isolate flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-colors sm:min-h-[240px] sm:p-8",
        className,
      )}
    >
      {/* Mouse spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      {/* Gradient border on hover */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          "[background:linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)] [mask:linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)] [mask-composite:exclude] p-px",
        )}
      />

      <div className="relative">
        <div className="border-border-subtle bg-bg-base/70 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border">
          <Icon className="text-accent-primary size-5" strokeWidth={1.6} />
        </div>
        <h3 className="font-display text-fg-primary mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h3>
        <p className="text-fg-muted mt-3 max-w-md text-sm leading-relaxed sm:text-[15px]">
          {pitch}
        </p>
      </div>

      <ul className="relative mt-6 flex flex-wrap gap-2">
        {tech.map((t) => (
          <TechChip key={t} name={t} tone="base" />
        ))}
      </ul>
    </motion.div>
  );
}
