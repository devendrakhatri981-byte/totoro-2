"use client";

import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Procedural Tree ─────────────────────────────────────────────
interface TreeProps {
  position: [number, number, number];
  height: number;
  trunkRadius: number;
  segments: number;
}

function Tree({ position, height, trunkRadius, segments }: TreeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Dispose geometries on unmount
  useEffect(() => {
    const group = groupRef.current;
    return () => {
      group?.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            (obj.material as THREE.Material)?.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {/* Trunk */}
      <mesh position={[0, height * 0.25, 0]} frustumCulled>
        <cylinderGeometry args={[trunkRadius * 0.6, trunkRadius, height * 0.5, segments]} />
        <meshStandardMaterial color="#1a1209" roughness={0.95} />
      </mesh>
      {/* Lower foliage */}
      <mesh position={[0, height * 0.65, 0]} frustumCulled>
        <coneGeometry args={[trunkRadius * 3, height * 0.6, segments]} />
        <meshStandardMaterial color="#0d1f14" roughness={0.8} flatShading />
      </mesh>
      {/* Upper foliage */}
      <mesh position={[0, height * 0.9, 0]} frustumCulled>
        <coneGeometry args={[trunkRadius * 2, height * 0.45, segments]} />
        <meshStandardMaterial color="#0f2419" roughness={0.8} flatShading />
      </mesh>
      {/* Top spike */}
      <mesh position={[0, height * 1.1, 0]} frustumCulled>
        <coneGeometry args={[trunkRadius * 1.1, height * 0.3, segments]} />
        <meshStandardMaterial color="#122a1c" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

// ── Forest Scene ────────────────────────────────────────────────
interface SceneProps {
  cameraState: React.RefObject<{ z: number; x: number; lookUpY: number }>;
  isMobile: boolean;
}

const TREE_LAYOUT = [
  { pos: [-6, -2, -8] as [number,number,number], h: 5, r: 0.25, s: 5 },
  { pos: [-4, -2, -5] as [number,number,number], h: 4, r: 0.2, s: 5 },
  { pos: [5, -2, -7] as [number,number,number], h: 6, r: 0.3, s: 5 },
  { pos: [3, -2, -4] as [number,number,number], h: 3.5, r: 0.18, s: 5 },
  { pos: [-8, -2, -12] as [number,number,number], h: 7, r: 0.35, s: 5 },
  { pos: [8, -2, -10] as [number,number,number], h: 5.5, r: 0.28, s: 5 },
  { pos: [0, -2, -10] as [number,number,number], h: 6.5, r: 0.3, s: 5 },
  { pos: [-2, -2, -3] as [number,number,number], h: 3, r: 0.15, s: 5 },
];

function ForestScene({ cameraState, isMobile }: SceneProps) {
  const { camera } = useThree();
  const lanternRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = isMobile ? 500 : 3000;

  // Rain particles
  const rainPositions = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = Math.random() * 18 - 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [particleCount]);

  useFrame((_, delta) => {
    // Lerp camera to scroll-driven state
    if (cameraState.current) {
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        cameraState.current.z,
        0.05
      );
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        cameraState.current.x,
        0.05
      );
      camera.lookAt(0, cameraState.current.lookUpY, 0);
    }

    // Animate lantern flicker
    if (lanternRef.current) {
      lanternRef.current.intensity = 2 + Math.sin(Date.now() * 0.008) * 0.4;
    }

    // Rain fall
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const speed = 12 * delta;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] -= speed;
        if (pos[i * 3 + 1] < -5) pos[i * 3 + 1] = 13;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Fog — disabled on mobile for perf */}
      {!isMobile && (
        <primitive
          object={new THREE.FogExp2(0x0a1a14, 0.035)}
          attach="fog"
        />
      )}

      {/* Lighting */}
      <ambientLight color="#1a2f28" intensity={0.4} />
      <directionalLight
        color="#1a3028"
        intensity={0.5}
        position={[5, 10, 5]}
      />

      {/* Lantern point light */}
      <pointLight
        ref={lanternRef}
        color="#ffd080"
        intensity={2}
        distance={12}
        decay={2}
        position={[2, 3, 0]}
      />

      {/* Bus stop pole */}
      <mesh position={[2, 0.5, 0]} frustumCulled>
        <boxGeometry args={[0.08, 5, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Lantern box */}
      <mesh position={[2, 3.2, 0.15]} frustumCulled>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#ffd080"
          emissive="#ffd080"
          emissiveIntensity={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} frustumCulled>
        <planeGeometry args={[40, 40, 20, 20]} />
        <meshStandardMaterial
          color="#061008"
          roughness={0.98}
          wireframe={false}
        />
      </mesh>

      {/* Ground grid lines */}
      <gridHelper
        args={[40, 30, "#0d2018", "#0d2018"]}
        position={[0, -1.99, 0]}
      />

      {/* Trees */}
      {TREE_LAYOUT.map((t, i) => (
        <Tree
          key={i}
          position={t.pos}
          height={t.h}
          trunkRadius={t.r}
          segments={t.s}
        />
      ))}

      {/* Rain particles */}
      <points ref={particlesRef} frustumCulled>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[rainPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#b8d4e8"
          size={0.05}
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>
    </>
  );
}

// ── Main Section ─────────────────────────────────────────────────
export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cameraState = useRef({ z: 20, x: 0, lookUpY: 0 });
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ScrollTrigger controls camera state object (not direct THREE refs)
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.5) {
          // Phase 1: z 20 → 8, slight left lean
          cameraState.current.z = THREE.MathUtils.lerp(20, 8, p * 2);
          cameraState.current.x = THREE.MathUtils.lerp(0, -1.5, p * 2);
          cameraState.current.lookUpY = 0;
        } else {
          // Phase 2: z 8 → 3, looking slightly up
          const p2 = (p - 0.5) * 2;
          cameraState.current.z = THREE.MathUtils.lerp(8, 3, p2);
          cameraState.current.x = THREE.MathUtils.lerp(-1.5, 0, p2);
          cameraState.current.lookUpY = THREE.MathUtils.lerp(0, 1.5, p2);
        }
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full min-h-screen bg-[#050e0a] overflow-hidden border-t border-white/5"
      aria-label="Immersive 3D forest experience"
    >
      {/* Section Header */}
      <div className="absolute top-16 left-0 right-0 z-10 flex flex-col items-center pointer-events-none select-none">
        <span className="font-accent text-xs tracking-[0.25em] text-[#7fb3a8] uppercase">
          Simulation
        </span>
        <h2 className="mt-2 font-display text-3xl md:text-5xl font-light tracking-[0.08em] text-[#e8e0d4]">
          Enter the Ritual
        </h2>
      </div>

      {/* R3F Canvas */}
      <div className="w-full h-screen" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 65, near: 0.1, far: 100 }}
          gl={{
            antialias: !isMobile,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.8,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ForestScene cameraState={cameraState} isMobile={isMobile} />
        </Canvas>
      </div>

      {/* Scroll prompt */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-30 text-center">
        <span className="font-body text-[9px] tracking-[0.3em] text-[#e8e0d4] uppercase animate-pulse">
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
