"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "./SplitText";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  // Simulated progress loader (min 2.5s total)
  useEffect(() => {
    const duration = 2500; // 2.5 seconds minimum load time
    const intervalTime = 20; // 20ms steps
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(100, prev + step);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // HTML5 Canvas rain particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 120;
    const particles: {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        length: Math.random() * 25 + 10,
        speed: Math.random() * 18 + 12,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.25)"; // semi-transparent background to create trail
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "#b8d4e8"; // Rain color
      ctx.lineWidth = 1;

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        ctx.globalAlpha = p.opacity;
        ctx.stroke();

        p.y += p.speed;
        if (p.y > height) {
          p.y = -p.length;
          p.x = Math.random() * width;
          p.speed = Math.random() * 18 + 12;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Text stagger entrance reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".preloader-title .char-span",
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1.2,
          ease: "power4.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Curtain wipe exit sequence upon 100% progress
  useEffect(() => {
    if (progress < 100) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onComplete,
      });

      // Animate text out
      tl.to(".preloader-title .char-span", {
        y: -50,
        opacity: 0,
        stagger: 0.02,
        duration: 0.5,
        ease: "power3.in",
      });

      // Curtain wipe upward
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
        },
        "-=0.1"
      );
    });

    return () => ctx.revert();
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0a0a0a]"
      style={{ willChange: "transform" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center select-none">
        <h1 className="preloader-title font-display text-5xl md:text-8xl tracking-[0.18em] text-[#e8e0d4] uppercase font-light">
          <SplitText text="ANTIGRAVITY" type="chars" />
        </h1>
        <p className="mt-4 font-body text-xs md:text-sm tracking-[0.25em] text-[#b8d4e8]/50 uppercase font-light">
          Initialising Forest Journey — {Math.floor(progress)}%
        </p>
      </div>

      {/* Progress Bar (Thin Bottom Line) */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#4a7c6f] via-[#7fb3a8] to-[#b8d4e8] transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
