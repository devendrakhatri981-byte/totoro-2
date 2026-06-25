"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Antigravity made me feel like I was standing in the rain beside something ancient and kind.",
    author: "Saoirse M.",
    role: "Creative Director, Studio Mist",
    initial: "S",
  },
  {
    quote:
      "The most emotionally resonant web experience I've encountered.",
    author: "Kenji T.",
    role: "Digital Artist & Researcher",
    initial: "K",
  },
  {
    quote: "Every pixel feels intentional. Every frame, a breath.",
    author: "Amara O.",
    role: "Experience Designer, Luminary Labs",
    initial: "A",
  },
];

const CARD_OFFSET = 320;

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const total = TESTIMONIALS.length;

  const goTo = useCallback(
    (index: number) => {
      const next = (index + total) % total;
      setActive(next);
    },
    [total]
  );

  // Auto-advance every 5 seconds
  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setTimeout(() => goTo(active + 1), 5000);
    };
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, goTo]);

  // GSAP card position animations
  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - active;
      const absOffset = Math.abs(offset);
      const clampedOffset = Math.max(-1, Math.min(1, offset));

      gsap.to(card, {
        x: clampedOffset * CARD_OFFSET,
        scale: absOffset === 0 ? 1 : 0.88,
        opacity: absOffset === 0 ? 1 : absOffset === 1 ? 0.45 : 0,
        zIndex: absOffset === 0 ? 10 : 5 - absOffset,
        duration: 0.6,
        ease: "power3.out",
      });
    });
  }, [active]);

  // Drag velocity → advance card
  const handleDragEnd = (velocity: number) => {
    if (velocity < -300) goTo(active + 1);
    else if (velocity > 300) goTo(active - 1);
  };

  const x = useMotionValue(0);
  const dragOpacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  return (
    <section
      id="testimonials"
      className="relative w-full py-40 bg-[#080808] overflow-hidden border-t border-white/5"
      aria-label="Testimonials"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(79,124,111,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-20 select-none">
          <span className="font-accent text-xs tracking-[0.25em] text-[#7fb3a8] uppercase">
            Voices from the Grove
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-light tracking-[0.08em] text-[#e8e0d4]">
            What they felt
          </h2>
        </div>

        {/* Card Stage */}
        <div
          className="relative w-full max-w-xl h-[340px] md:h-[300px] flex items-center justify-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              style={{ x: dragOpacity ? undefined : undefined }}
              drag="x"
              dragConstraints={{ left: -200, right: 200 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                handleDragEnd(info.velocity.x);
              }}
              className="absolute w-full max-w-xl cursor-grab active:cursor-grabbing"
              aria-hidden={i !== active}
              aria-label={`Testimonial ${i + 1} of ${total}`}
            >
              <div className="relative p-8 md:p-12 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 select-none">
                {/* Quote Icon */}
                <Quote
                  className="absolute top-6 right-8 w-8 h-8 text-[#7fb3a8]/20"
                  aria-hidden="true"
                />

                <p className="font-display text-xl md:text-2xl font-light leading-[1.65] text-[#e8e0d4] italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-8 flex items-center gap-4">
                  {/* Avatar initial */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4a7c6f] to-[#7fb3a8] flex items-center justify-center text-[#0a0a0a] font-body text-sm font-semibold shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold tracking-wide text-[#e8e0d4]">
                      {t.author}
                    </p>
                    <p className="font-body text-[10px] tracking-wider text-[#e8e0d4]/40 uppercase mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-6">
          <button
            onClick={() => goTo(active - 1)}
            className="p-2.5 rounded-full border border-white/10 bg-white/5 text-[#e8e0d4]/60 hover:text-[#e8e0d4] hover:bg-white/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb3a8]"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2" role="tablist" aria-label="Testimonial indicators">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb3a8] ${
                  i === active
                    ? "w-6 h-2 bg-[#7fb3a8]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(active + 1)}
            className="p-2.5 rounded-full border border-white/10 bg-white/5 text-[#e8e0d4]/60 hover:text-[#e8e0d4] hover:bg-white/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb3a8]"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
