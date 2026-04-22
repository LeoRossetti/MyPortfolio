"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EmberShader } from "./EmberShader";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

function isWebGLAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function HeroScene() {
  const prefersReduced = usePrefersReducedMotion();
  const [webglOk] = useState(isWebGLAvailable);

  if (prefersReduced || !webglOk) {
    return <StaticFallback />;
  }

  return (
    <div className="relative h-full w-full">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
        dpr={[1, 1.6]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <EmberShader />
        </Suspense>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}

function StaticFallback() {
  return (
    <div
      aria-hidden
      className="bg-ember relative h-full w-full"
    />
  );
}
