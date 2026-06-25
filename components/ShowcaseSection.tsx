"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Use frames 43–57 (15 available) — 5 cards sampling every 3rd frame
const CARD_FRAMES = [43, 46, 49, 52, 55];

const CARD_CAPTIONS = [
  "The Forest Breathes",
  "Rain & Stillness",
  "Between the Trees",
  "Spirit Light",
  "Ancient Patience",
];

function pad(n: number) {
  return String(n).padStart(3, "0");
}

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const section = sectionRef.current;
    const progressBar = progressRef.current;
    if (!track || !section || !progressBar) return;

    const totalWidth = track.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth + window.innerWidth * 0.5}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Update progress bar
          gsap.set(progressBar, { scaleX: self.progress });

          // Determine active card based on scroll progress
          const cardIndex = Math.min(
            CARD_FRAMES.length - 1,
            Math.floor(self.progress * CARD_FRAMES.length)
          );
          setActiveCard(cardIndex);
        },
      },
    });

    tl.to(track, {
      x: () => -(totalWidth),
      ease: "none",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative w-full h-screen overflow-hidden bg-[#060606] border-t border-white/5"
      aria-label="Showcase gallery"
    >
      {/* Section Header (pinned behind cards) */}
      <div className="absolute top-12 left-0 right-0 z-10 flex flex-col items-center pointer-events-none select-none">
        <span className="font-accent text-xs tracking-[0.25em] text-[#7fb3a8] uppercase">
          Gallery
        </span>
        <h2 className="mt-2 font-display text-2xl md:text-4xl font-light tracking-[0.08em] text-[#e8e0d4]">
          Captured Echoes
        </h2>
      </div>

      {/* Horizontal card track */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 h-full flex items-center gap-8 pl-[15vw]"
        style={{ paddingRight: "15vw", willChange: "transform" }}
      >
        {CARD_FRAMES.map((frameNum, i) => {
          const isActive = i === activeCard;
          return (
            <div
              key={i}
              className="relative shrink-0 rounded-3xl overflow-hidden transition-all duration-500"
              style={{
                width: "clamp(280px, 30vw, 500px)",
                height: "clamp(360px, 42vw, 650px)",
                outline: isActive
                  ? "1.5px solid rgba(127,179,168,0.7)"
                  : "1.5px solid rgba(255,255,255,0.05)",
                boxShadow: isActive
                  ? "0 0 40px rgba(127,179,168,0.15)"
                  : "0 0 0 rgba(0,0,0,0)",
                transform: isActive
                  ? "scale(1)"
                  : "scale(0.95)",
              }}
              role="img"
              aria-label={`Showcase card: ${CARD_CAPTIONS[i]}`}
            >
              {/* Frame Image */}
              <Image
                src={`/frames/ezgif-frame-${pad(frameNum)}.jpg`}
                alt={CARD_CAPTIONS[i]}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 30vw"
                priority={i === 0}
              />

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6,6,6,0.75) 0%, transparent 55%)",
                }}
              />

              {/* Card label */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-lg md:text-xl font-light text-[#e8e0d4] tracking-wide">
                  {CARD_CAPTIONS[i]}
                </p>
                <p className="mt-1 font-body text-[10px] tracking-[0.2em] text-[#b8d4e8]/50 uppercase">
                  Frame {pad(frameNum)}
                </p>
              </div>

              {/* Active teal glow overlay */}
              {isActive && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 30%, rgba(127,179,168,0.08) 0%, transparent 70%)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Scroll Progress Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-white/10 z-20 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full w-full bg-gradient-to-r from-[#4a7c6f] to-[#7fb3a8] origin-left"
          style={{ scaleX: 0 }}
        />
      </div>

      {/* Dot indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {CARD_FRAMES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeCard ? "16px" : "5px",
              height: "5px",
              backgroundColor:
                i === activeCard
                  ? "#7fb3a8"
                  : "rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
