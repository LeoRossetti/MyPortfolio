"use client";

// Ported from React Bits — https://reactbits.dev
// Pure three.js (no @react-three/fiber) — the component owns its renderer
// and RAF loop.

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uDataTexture;
  uniform sampler2D uTexture;
  uniform vec4 resolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 offset = texture2D(uDataTexture, vUv);
    gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
  }
`;

type Props = {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
  className?: string;
};

export default function GridDistortion({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null as THREE.Texture | null },
      uDataTexture: { value: null as THREE.DataTexture | null },
    };

    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = Math.random() * 255 - 125;
      data[i * 4 + 1] = Math.random() * 255 - 125;
    }

    const dataTexture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width === 0 || height === 0) return;

      const containerAspect = width / height;
      renderer.setSize(width, height);

      plane.scale.set(containerAspect, 1, 1);

      const frustumHeight = 1;
      const frustumWidth = frustumHeight * containerAspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();

      uniforms.resolution.value.set(width, height, 1, 1);
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
    textureLoader.load(imageSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      uniforms.uTexture.value = texture;
      handleResize();
    });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", handleResize);
    }

    const mouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      mouseState.x = x;
      mouseState.y = y;
      mouseState.prevX = x;
      mouseState.prevY = y;
    };

    // Listen on window so the distortion follows the cursor even when it's
    // hovering elements that sit above this canvas in the z-stack (hero
    // content, terminal, CTAs). Coords are still computed relative to the
    // container's rect, so the effect stays correctly positioned. When the
    // cursor is far outside the container, the squared-distance check in
    // the animate loop filters out any cell updates automatically.
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    handleResize();

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      uniforms.time.value += 0.05;

      const d = dataTexture.image.data as Float32Array;
      for (let i = 0; i < size * size; i++) {
        d[i * 4] *= relaxation;
        d[i * 4 + 1] *= relaxation;
      }

      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDist = size * mouse;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const distSq =
            Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
          if (distSq < maxDist * maxDist) {
            const index = 4 * (i + size * j);
            const power = Math.min(maxDist / Math.sqrt(distSq), 10);
            d[index] += strength * 100 * mouseState.vX * power;
            d[index + 1] -= strength * 100 * mouseState.vY * power;
          }
        }
      }

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }
      window.removeEventListener("mousemove", handleMouseMove);

      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      uniforms.uTexture.value?.dispose();

      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [grid, mouse, strength, relaxation, imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`distortion-container ${className}`}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        minWidth: 0,
        minHeight: 0,
      }}
    />
  );
}
