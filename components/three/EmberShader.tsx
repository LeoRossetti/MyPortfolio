"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;       // 0..1 normalized
  uniform vec2 uResolution;
  uniform vec3 uBgDeep;
  uniform vec3 uEmberDeep;
  uniform vec3 uEmberBright;
  uniform vec3 uEmberHot;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // aspect-correct so the noise doesn't smear on wide screens
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 nUv = vec2(uv.x * aspect, uv.y);

    // slow upward drift + a slower lateral wobble for organic motion
    vec2 flow = vec2(sin(uTime * 0.07) * 0.05, -uTime * 0.045);

    // layered noise — second octave domain-warped by the first
    float n1 = fbm(nUv * 2.4 + flow);
    float n2 = fbm(nUv * 4.5 + flow * 1.6 + n1 * 0.35);
    float n = mix(n1, n2, 0.55);

    // strong bottom-heavy gradient: top half is near-black, ember pools at bottom
    float vGrad = pow(1.0 - uv.y, 2.4);

    // subtle mouse warmth
    float mouseDist = distance(uv, uMouse);
    float mouseGlow = exp(-mouseDist * 4.5) * 0.18;

    float intensity = n * vGrad + mouseGlow;

    // color staircase: bg → deep ember → bright ember → hot peaks
    vec3 color = uBgDeep;
    color = mix(color, uEmberDeep, smoothstep(0.05, 0.35, intensity));
    color = mix(color, uEmberBright, smoothstep(0.35, 0.7, intensity));
    color = mix(color, uEmberHot, smoothstep(0.75, 1.0, intensity * vGrad * 1.3));

    // gentle vignette so corners blend with bg-base
    vec2 vc = uv - 0.5;
    float vig = 1.0 - dot(vc, vc) * 0.55;
    color *= vig;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function EmberShader() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uBgDeep: { value: new THREE.Color("#0a0505") },
      uEmberDeep: { value: new THREE.Color("#7f1d1d") },
      uEmberBright: { value: new THREE.Color("#ef4444") },
      uEmberHot: { value: new THREE.Color("#f59e0b") },
    }),
    // size only used for the initial resolution — useFrame keeps it fresh
    [size.width, size.height],
  );

  useFrame((state) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    // pointer is -1..1 — convert to 0..1 (and flip Y for screen-space)
    u.uMouse.value.set(
      state.pointer.x * 0.5 + 0.5,
      state.pointer.y * 0.5 + 0.5,
    );
    u.uResolution.value.set(state.size.width, state.size.height);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
      />
    </mesh>
  );
}
