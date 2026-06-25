"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useLenis } from "./LenisProvider";
import SplitText from "./SplitText";
import Magnetic from "./Magnetic";
import { ChevronDown } from "lucide-react";

// Rain particles component
function RainParticles({ count = 2000 }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize random rain particles coordinates
  const tempPositions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30; // x
      arr[i * 3 + 1] = Math.random() * 30 - 15; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30; // z
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const speed = 15 * delta;

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= speed; // Y falls down
      if (positions[i * 3 + 1] < -15) {
        positions[i * 3 + 1] = 15; // wraps around to top
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[tempPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#b8d4e8" // soft blue rain
        size={0.06}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// Low-poly forest spirit component
function ForestSpirit() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Floating bobbing motion
    groupRef.current.position.y = Math.sin(t * 0.45) * 0.25 - 0.3;
    // Slow rotational yaw
    groupRef.current.rotation.y = t * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Body: Low-poly cone */}
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[1, 2.2, 5]} />
        <meshStandardMaterial color="#4a7c6f" roughness={0.7} flatShading />
      </mesh>

      {/* Head: Low-poly icosahedron */}
      <mesh position={[0, 0.8, 0]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#e8e0d4" roughness={0.5} flatShading />
      </mesh>

      {/* Glowing spirit face plate / mask */}
      <mesh position={[0, 0.8, 0.45]}>
        <boxGeometry args={[0.25, 0.4, 0.15]} />
        <meshStandardMaterial
          color="#7fb3a8"
          emissive="#7fb3a8"
          emissiveIntensity={0.3}
          roughness={0.2}
          flatShading
        />
      </mesh>

      {/* Left Antler */}
      <group position={[-0.15, 1.2, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.03, 0.06, 0.8, 4]} />
          <meshStandardMaterial color="#e8e0d4" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[-0.15, 0.7, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.02, 0.03, 0.4, 4]} />
          <meshStandardMaterial color="#e8e0d4" roughness={0.8} flatShading />
        </mesh>
      </group>

      {/* Right Antler */}
      <group position={[0.15, 1.2, 0]} rotation={[0, 0, -0.3]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.03, 0.06, 0.8, 4]} />
          <meshStandardMaterial color="#e8e0d4" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0.15, 0.7, 0]} rotation={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.02, 0.03, 0.4, 4]} />
          <meshStandardMaterial color="#e8e0d4" roughness={0.8} flatShading />
        </mesh>
      </group>

      {/* Floating spirit nodes/sparks around the body */}
      {[-1.3, 1.3].map((posVal, i) => (
        <mesh key={i} position={[posVal, 0.2, i === 0 ? -0.8 : 0.8]}>
          <dodecahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial
            color="#7fb3a8"
            emissive="#7fb3a8"
            emissiveIntensity={0.8}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

// Oscillating light source component
function MovingLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.getElapsedTime();
    // Complex organic floating path for the point light
    lightRef.current.position.x = Math.sin(t * 0.7) * 4;
    lightRef.current.position.y = Math.cos(t * 0.4) * 2 + 1;
    lightRef.current.position.z = Math.sin(t * 0.5) * 3 + 2;
  });

  return (
    <pointLight
      ref={lightRef}
      color="#7fb3a8" // Teal glow color
      intensity={4}
      distance={14}
      decay={2}
    />
  );
}

// Controls camera movement based on scroll pull-back and subtle bobbing
interface SceneControllerProps {
  scrollYRef: React.RefObject<number>;
}

function SceneController({ scrollYRef }: SceneControllerProps) {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Small camera bobbing oscillation
    const bobX = Math.sin(t * 0.5) * 0.05;
    const bobY = Math.cos(t * 0.7) * 0.05;

    // Pull camera back relative to scroll amount
    const scrollFactor = scrollYRef.current || 0;
    const pullBack = scrollFactor * 10; // moves camera back by up to 10 units

    state.camera.position.x = bobX;
    state.camera.position.y = bobY;
    state.camera.position.z = 6.5 + pullBack;

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

interface HeroProps {
  preloaded: boolean;
}

export default function Hero({ preloaded }: HeroProps) {
  const lenis = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  // Monitor mounting client-side
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const progress = Math.max(0, -rect.top / rect.height);
        scrollYRef.current = progress;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set up ScrollTrigger bindings for parallax text and canvas opacity fade
  useEffect(() => {
    if (!preloaded) return;

    const ctx = gsap.context(() => {
      // Parallax text translation and fade-out on scroll
      gsap.to(".hero-text-overlay", {
        y: () => window.innerHeight * 0.35,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Canvas wrapper fade and scale down on scroll
      gsap.to(".hero-canvas-wrapper", {
        opacity: 0,
        scale: 0.94,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Stagger entrance transitions for headers/CTA
      const tl = gsap.timeline();

      tl.fromTo(
        ".hero-headline .char-span",
        {
          y: 70,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 1.1,
          ease: "power4.out",
        }
      );

      tl.fromTo(
        ".hero-subline",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6" // Delay offset to overlap nicely
      );

      tl.fromTo(
        ".hero-cta",
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      );

      tl.fromTo(
        ".hero-scroll-indicator",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // Bounce animation loop for the scroll indicator
      gsap.to(".hero-scroll-chevron", {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.1,
        ease: "power1.inInOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [preloaded]);

  const handleCTAClick = () => {
    if (lenis) {
      lenis.scrollTo("#story", { duration: 1.6 });
    } else {
      const target = document.querySelector("#story");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] flex items-center justify-center select-none"
    >
      {/* 3D Scene Canvas Container */}
      <div className="hero-canvas-wrapper absolute inset-0 w-full h-full pointer-events-none z-0">
        {mounted && (
          <Canvas gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
            <fog attach="fog" args={["#0a0a0a", 3, 14]} />
            <ambientLight intensity={0.12} />
            <directionalLight
              position={[5, 8, 4]}
              intensity={0.6}
              color="#e8e0d4"
            />
            <MovingLight />
            <RainParticles />
            <ForestSpirit />
            <SceneController scrollYRef={scrollYRef} />
          </Canvas>
        )}
      </div>

      {/* Cinematic Text Overlay */}
      <div className="hero-text-overlay relative z-10 flex flex-col items-center text-center px-4 max-w-4xl pointer-events-auto">
        <h1 className="hero-headline font-display text-4xl md:text-7xl font-extralight tracking-[0.12em] text-[#e8e0d4] leading-[1.25] overflow-hidden">
          <SplitText text="Between Rain and Wonder" type="chars" />
        </h1>

        <p className="hero-subline mt-6 font-body text-sm md:text-lg font-light tracking-[0.25em] text-[#b8d4e8]/75 uppercase opacity-0">
          An immersive journey begins
        </p>

        <div className="hero-cta mt-12 opacity-0">
          <Magnetic strength={0.3}>
            <button
              onClick={handleCTAClick}
              className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs md:text-sm font-body tracking-[0.2em] text-[#e8e0d4] uppercase hover:bg-white/10 hover:border-white/20 transition-all duration-300 pointer-events-auto"
            >
              Enter the Forest
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Scroll indicator chevron */}
      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-0">
        <span className="font-body text-[10px] tracking-[0.3em] text-[#e8e0d4]/40 uppercase mb-2">
          Scroll
        </span>
        <div className="hero-scroll-chevron text-[#7fb3a8]">
          <ChevronDown className="w-5 h-5 cursor-glow" />
        </div>
      </div>
    </section>
  );
}
