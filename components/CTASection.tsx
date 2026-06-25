"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ctaVertexShader, ctaFragmentShader } from "@/shaders/ctaNoise";
import SplitText from "./SplitText";
import Magnetic from "./Magnetic";
import { useLenis } from "./LenisProvider";

// ── Shader Background Plane ──────────────────────────────────────
function ShaderBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useRef({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  });

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} scale={[2, 2, 1]}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        vertexShader={ctaVertexShader}
        fragmentShader={ctaFragmentShader}
        uniforms={uniforms.current}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── 50 Drifting Particle Dots ────────────────────────────────────
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useRef(() => {
    const arr = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 3;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2;
      arr[i * 3 + 2] = Math.random() * 0.5;
    }
    return arr;
  });

  const speeds = useRef(
    Array.from({ length: 50 }, () => ({
      x: (Math.random() - 0.5) * 0.0008,
      y: (Math.random() - 0.5) * 0.0008,
    }))
  );

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < 50; i++) {
      pos[i * 3] += speeds.current[i].x;
      pos[i * 3 + 1] += speeds.current[i].y;
      // Wrap edges
      if (pos[i * 3] > 1.5) pos[i * 3] = -1.5;
      if (pos[i * 3] < -1.5) pos[i * 3] = 1.5;
      if (pos[i * 3 + 1] > 1) pos[i * 3 + 1] = -1;
      if (pos[i * 3 + 1] < -1) pos[i * 3 + 1] = 1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const initPositions = positions.current();

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#7fb3a8"
        size={0.012}
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}

// ── Ripple Button ────────────────────────────────────────────────
interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function RippleButton({ children, onClick, className = "" }: RippleButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    onClick?.();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={`relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb3a8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] ${className}`}
      aria-label="Begin the Journey"
    >
      {children}
      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-ripple"
          style={{
            width: 10,
            height: 10,
            left: rp.x - 5,
            top: rp.y - 5,
          }}
        />
      ))}
    </button>
  );
}

// ── Main CTA Section ─────────────────────────────────────────────
export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Word-by-word reveal on scroll
      gsap.fromTo(
        ".cta-headline .word-span",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".cta-sub",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".cta-buttons",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScroll = () => {
    if (lenis) {
      lenis.scrollTo("#story", { duration: 1.6 });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden border-t border-white/5"
      aria-labelledby="cta-headline"
    >
      {/* GLSL Shader Canvas Background */}
      <div className="absolute inset-0 w-full h-full z-0" aria-hidden="true">
        <Canvas
          gl={{ antialias: false }}
          camera={{ position: [0, 0, 1], fov: 75 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ShaderBackground />
          <FloatingParticles />
        </Canvas>
      </div>

      {/* Gradient overlay for text legibility */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.65) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl select-none">
        <span className="font-accent text-xs tracking-[0.25em] text-[#7fb3a8] uppercase mb-6">
          The threshold
        </span>

        <h2
          id="cta-headline"
          className="cta-headline font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.06em] text-[#e8e0d4] leading-[1.15] overflow-hidden"
        >
          <SplitText text="Step into the stillness." type="words" />
        </h2>

        <p className="cta-sub mt-7 font-body text-sm md:text-base tracking-[0.2em] text-[#b8d4e8]/70 uppercase font-light opacity-0">
          Antigravity — where wonder waits.
        </p>

        <div className="cta-buttons mt-14 flex flex-col sm:flex-row items-center gap-5 opacity-0">
          <Magnetic strength={0.3}>
            <RippleButton className="group px-10 py-4 rounded-full border border-[#4a7c6f]/60 bg-transparent hover:bg-gradient-to-r hover:from-[#4a7c6f] hover:to-[#7fb3a8] font-body text-xs md:text-sm tracking-[0.2em] text-[#e8e0d4] uppercase transition-all duration-500">
              Begin the Journey
            </RippleButton>
          </Magnetic>

          <button
            onClick={handleScroll}
            className="font-body text-xs tracking-[0.2em] text-[#e8e0d4]/50 uppercase hover:text-[#7fb3a8] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb3a8] rounded"
            aria-label="Scroll to Watch the story section"
          >
            Watch the story ↓
          </button>
        </div>
      </div>
    </section>
  );
}
