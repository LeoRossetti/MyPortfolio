"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

// Lazy-load the ogl canvas — no SSR, not in initial bundle.
const Particles = dynamic(() => import("@/components/reactbits/Particles"), {
  ssr: false,
  loading: () => null,
});

/**
 * Site-wide ambient particles. Mounted once at root (app/layout.tsx) as a
 * fixed, pointer-events-none, z-index -10 layer. Every section inherits
 * the same ambient backdrop; per-section backgrounds are no longer needed.
 *
 * The semi-transparent tint overlay on top dims the particles enough that
 * body copy stays legible everywhere without each section adding its own
 * legibility layer.
 *
 * Note: the Hero's GridDistortion canvas still layers on top of this in
 * the Hero area — that's intentional. Two backdrops in the Hero viewport
 * isn't a problem because the GridDistortion is opaque and fully masks
 * the particles while Hero is in view.
 */
export function SiteBackdrop() {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <Particles
        particleCount={280}
        particleSpread={14}
        speed={0.08}
        particleColors={["#ffffff"]}
        alphaParticles
        particleBaseSize={120}
        sizeRandomness={1}
        moveParticlesOnHover={false}
        disableRotation={false}
        pixelRatio={
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1
        }
      />
      {/* Global legibility tint so body copy stays readable in every
          section without each section adding its own overlay. */}
      <div className="bg-bg-base/20 absolute inset-0" />
    </div>
  );
}
