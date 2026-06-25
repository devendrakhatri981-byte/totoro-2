"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATS = [
  { value: 42, suffix: "", label: "Frames", sub: "of cinematic magic" },
  { value: 0, suffix: "∞", label: "Moments", sub: "of stillness" },
  { value: 1, suffix: "", label: "Forest Spirit", sub: "waiting patiently" },
  { value: 0, suffix: "", label: "Shortcuts", sub: "in craftsmanship" },
];

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  index: number;
}

function StatCard({ value, suffix, label, sub, index }: StatCardProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        if (suffix === "∞") {
          // Infinity — no count, just reveal
          setDisplayed(-1);
        } else {
          // Numeric count-up
          const obj = { val: 0 };
          gsap.to(obj, {
            val: value,
            duration: 1.8,
            ease: "power2.out",
            delay: index * 0.12,
            onUpdate: () => setDisplayed(Math.floor(obj.val)),
          });
        }

        // Underline draw animation
        if (lineRef.current) {
          gsap.fromTo(
            lineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power3.out",
              delay: index * 0.12 + 0.3,
              transformOrigin: "left center",
            }
          );
        }
      },
    });
  }, [value, suffix, index]);

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center text-center group px-4 py-8"
      aria-label={`${suffix || value} ${label}: ${sub}`}
    >
      <div className="relative mb-2">
        <span
          ref={numRef}
          className="font-display text-5xl md:text-7xl font-light text-[#e8e0d4] tabular-nums"
          aria-live="polite"
        >
          {suffix === "∞"
            ? "∞"
            : displayed}
        </span>
      </div>

      {/* Label with animated underline */}
      <div className="relative mt-2">
        <span className="font-body text-xs md:text-sm tracking-[0.2em] text-[#e8e0d4]/70 uppercase font-medium">
          {label}
        </span>
        <span
          ref={lineRef}
          className="absolute bottom-[-3px] left-0 right-0 h-[1px] bg-gradient-to-r from-[#4a7c6f] to-[#7fb3a8] origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <p className="mt-3 font-body text-[11px] tracking-wider text-[#e8e0d4]/35 uppercase font-light">
        {sub}
      </p>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Rain-texture background dots using CSS
  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative w-full py-32 bg-[#0a0a0a] overflow-hidden border-t border-white/5"
      aria-label="Project statistics"
    >
      {/* Subtle rain texture using repeating gradients */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(184,212,232,0.5) 14px, rgba(184,212,232,0.5) 15px), repeating-linear-gradient(180deg, transparent, transparent 30px, rgba(184,212,232,0.3) 30px, rgba(184,212,232,0.3) 31px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-20 select-none">
          <span className="font-accent text-xs tracking-[0.25em] text-[#7fb3a8] uppercase">
            By the Numbers
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-light tracking-[0.08em] text-[#e8e0d4]">
            The Craft Behind It
          </h2>
        </div>

        {/* Divider */}
        <div
          className="w-full h-[1px] mb-16 opacity-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, #4a7c6f, #7fb3a8, #4a7c6f, transparent)",
          }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/5">
          {STATS.map((stat, i) => (
            <StatCard key={i} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
