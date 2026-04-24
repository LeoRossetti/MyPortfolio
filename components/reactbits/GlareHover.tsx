"use client";

// Ported from React Bits — https://reactbits.dev
// Adapted from the original `GlareHover` (which acts as a full card
// wrapper with its own chrome): this version is a pointer-events-none
// overlay that drops inside any Tailwind `group` parent and sweeps a
// diagonal light glare on parent hover. Composes with any existing
// card chrome without dictating its background/border/radius.

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Props = {
  color?: string;
  opacity?: number;
  angle?: number;
  /** Gradient size as a percentage of the overlay (e.g. 250 = 250%). */
  size?: number;
  /** Sweep duration in milliseconds. */
  duration?: number;
  className?: string;
};

export function GlareHover({
  color = "#ffffff",
  opacity = 0.28,
  angle = -30,
  size = 250,
  duration = 800,
  className = "",
}: Props) {
  const hex = color.replace("#", "");
  let rgba = color;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  const style: CSSProperties = {
    backgroundImage: `linear-gradient(${angle}deg, transparent 60%, ${rgba} 70%, transparent 100%)`,
    backgroundSize: `${size}% ${size}%`,
    transition: `background-position ${duration}ms ease`,
  };

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] bg-no-repeat bg-[position:-100%_-100%] group-hover:bg-[position:100%_100%]",
        className,
      )}
      style={style}
    />
  );
}
