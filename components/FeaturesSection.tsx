"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FEATURES_DATA = [
  {
    num: "01",
    title: "Stillness in Motion",
    desc: "Experience gravity suspended. Rain droplets rise and float, carving shapes of tranquility in the misty silence of the ancient grove.",
    icon: (
      <svg
        className="w-7 h-7 text-[#7fb3a8]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {/* Leaf Contour Path */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 2C6.48 2 2 6.48 2 12c0 2.76 1.12 5.26 2.93 7.07l.07.07c2.4 2.4 6.2 2.4 8.6 0l7.33-7.33c.8-.8 1.07-2 .67-3.07l-.27-.67C20.6 4.4 17 2 12 2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 2c0 5.52-4.48 10-10 10"
        />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Depth of Presence",
    desc: "A procedural WebGL forest responds to your inputs. Walk through dense, light-adaptive fog that wraps trees in mysterious silhouettes.",
    icon: (
      <svg
        className="w-7 h-7 text-[#7fb3a8]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {/* Raindrop Contour Path */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Patience as Power",
    desc: "Procedurally synthesized audio and dynamic lighting create a meditative ritual. Learn to wait, for magic reveals itself only to patient observers.",
    icon: (
      <svg
        className="w-7 h-7 text-[#7fb3a8]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {/* Japanese Lantern Path */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M6 8h12v10H6zm3-5h6v5H9zm2 15v3m0-18v3"
        />
      </svg>
    ),
  },
];

interface CardProps {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

function FeatureCard({ num, title, desc, icon }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;

    // Maximum tilt parameters (15 degrees)
    const rotateX = -py * 30;
    const rotateY = px * 30;

    gsap.to(inner, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.025,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;

    gsap.to(inner, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[520px] aspect-[4/3] md:aspect-[1.45/1] p-[1.5px] rounded-3xl overflow-hidden group select-none"
      style={{ perspective: 1000 }}
    >
      {/* Dynamic Border Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#4a7c6f] via-[#7fb3a8] to-[#b8d4e8] opacity-15 group-hover:opacity-100 transition-all duration-700 animate-border-gradient"
        style={{
          backgroundSize: "200% 200%",
        }}
      />

      {/* Inner Card */}
      <div
        ref={innerRef}
        className="relative w-full h-full bg-[#0d0d0d] rounded-[22px] p-6 md:p-10 flex flex-col justify-between overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Background Huge Index (20vw-equivalent scaled) */}
        <div
          className="absolute right-4 bottom-[-15%] font-display text-[15vw] md:text-[11vw] font-bold text-[#e8e0d4] opacity-[0.025] select-none pointer-events-none"
          style={{ transform: "translateZ(10px)" }}
        >
          {num}
        </div>

        {/* Card Header */}
        <div
          className="flex items-center justify-between w-full"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
            {icon}
          </div>
          <span className="font-body text-[10px] tracking-[0.25em] text-[#7fb3a8]/60 uppercase font-medium">
            Phenom_{num}
          </span>
        </div>

        {/* Card Body */}
        <div
          className="mt-6 flex flex-col justify-end"
          style={{ transform: "translateZ(30px)" }}
        >
          <h3 className="font-display text-2xl md:text-3xl font-light tracking-wide text-[#e8e0d4]">
            {title}
          </h3>
          <p className="mt-4 font-body text-xs md:text-sm font-light leading-[1.8] text-[#e8e0d4]/50">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Staggered reveal for rows on scroll
    gsap.fromTo(
      ".feature-row-wrapper",
      {
        y: 65,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15, // 0.15s delay between rows
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%", // Trigger animation when top hits 72% height
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative w-full py-40 bg-[#0a0a0a] overflow-hidden flex flex-col items-center border-t border-white/5"
    >
      <div className="w-full max-w-6xl px-6 flex flex-col items-center">
        {/* Header Header */}
        <div className="text-center mb-28 select-none">
          <span className="font-accent text-xs md:text-sm tracking-[0.25em] text-[#7fb3a8] uppercase">
            Aesthetic Matrix
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-light tracking-[0.08em] text-[#e8e0d4]">
            Grove Coordinates
          </h2>
        </div>

        {/* Asymmetric Alternating Grid */}
        <div className="w-full flex flex-col gap-28 md:gap-36">
          {/* Feature 1 — Left aligned */}
          <div className="feature-row-wrapper flex flex-col md:flex-row items-center justify-start w-full">
            <div className="w-full md:w-1/2 flex justify-start">
              <FeatureCard
                num={FEATURES_DATA[0].num}
                title={FEATURES_DATA[0].title}
                desc={FEATURES_DATA[0].desc}
                icon={FEATURES_DATA[0].icon}
              />
            </div>
            <div className="hidden md:block w-1/2" />
          </div>

          {/* Feature 2 — Right aligned */}
          <div className="feature-row-wrapper flex flex-col md:flex-row items-center justify-end w-full">
            <div className="hidden md:block w-1/2" />
            <div className="w-full md:w-1/2 flex justify-end">
              <FeatureCard
                num={FEATURES_DATA[1].num}
                title={FEATURES_DATA[1].title}
                desc={FEATURES_DATA[1].desc}
                icon={FEATURES_DATA[1].icon}
              />
            </div>
          </div>

          {/* Feature 3 — Left aligned */}
          <div className="feature-row-wrapper flex flex-col md:flex-row items-center justify-start w-full">
            <div className="w-full md:w-1/2 flex justify-start">
              <FeatureCard
                num={FEATURES_DATA[2].num}
                title={FEATURES_DATA[2].title}
                desc={FEATURES_DATA[2].desc}
                icon={FEATURES_DATA[2].icon}
              />
            </div>
            <div className="hidden md:block w-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}
