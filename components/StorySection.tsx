"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RainAudioGenerator } from "@/lib/rainAudio";
import { Volume2, VolumeX } from "lucide-react";

export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<RainAudioGenerator | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameObj = useRef({ val: 0 });

  // Preload frames 1 to 42
  useEffect(() => {
    const totalFrames = 42;
    let loadedCount = 0;
    const preloadedImages: HTMLImageElement[] = [];

    const pad = (num: number, size: number) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/frames/ezgif-frame-${pad(i, 3)}.jpg`;
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };
      preloadedImages.push(img);
    }
    imagesRef.current = preloadedImages;

    // Create rain audio player instance
    audioRef.current = new RainAudioGenerator();

    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
      }
    };
  }, []);

  const drawImageProp = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = ctx.canvas;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.width;
    const ih = img.height;

    // Calculate ratio for cover (Math.max)
    const ratio = Math.max(cw / iw, ch / ih);
    const nw = iw * ratio;
    const nh = ih * ratio;

    // Center coordinates
    const cx = (cw - nw) / 2;
    const cy = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, cx, cy, nw, nh);
  };

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;
    const ctx = canvas.getContext("2d");
    const img = imagesRef.current[index];
    if (ctx && img) {
      drawImageProp(ctx, img);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high-performance resize mapping
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const isMobile = window.innerWidth < 768;
      const scale = isMobile ? 0.75 : 1; // 0.75x pixel scaling on mobile

      canvas.width = rect.width * dpr * scale;
      canvas.height = rect.height * dpr * scale;
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      // Redraw current frame
      const currentIdx = Math.min(41, Math.max(0, Math.floor(frameObj.current.val)));
      renderFrame(currentIdx);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Set up GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // Scroll depth is 300vh
        scrub: 0.4, // Adds smooth easing delay
        pin: true,
        onUpdate: () => {
          const idx = Math.min(41, Math.max(0, Math.floor(frameObj.current.val)));
          renderFrame(idx);
        },
      },
    });

    // Tween frame object value (0 -> 41)
    tl.to(
      frameObj.current,
      {
        val: 41,
        ease: "none",
        duration: 3, // normalized duration
      },
      0
    );

    // Headline Text 1: visible 0% to 20%
    tl.fromTo(
      ".story-text-1",
      { opacity: 1, y: 0 },
      { opacity: 0, y: -25, duration: 0.6, ease: "power1.inOut" },
      0 // timeline starts immediately (0% scroll)
    );

    // Headline Text 2: visible 40% to 60%
    tl.fromTo(
      ".story-text-2",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power1.inOut" },
      0.9 // starts fading in around 30% scroll
    );
    tl.to(
      ".story-text-2",
      { opacity: 0, y: -25, duration: 0.3, ease: "power1.inOut" },
      1.8 // starts fading out around 60% scroll
    );

    // Headline Text 3: visible 80% to 100%
    tl.fromTo(
      ".story-text-3",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power1.inOut" },
      2.1 // starts fading in around 70% scroll
    );

    return () => {
      window.removeEventListener("resize", handleResize);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [isLoaded]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.stop();
      setIsPlaying(false);
    } else {
      audioRef.current.start();
      setIsPlaying(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center"
    >
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]">
          <p className="font-display text-lg md:text-xl tracking-[0.2em] text-[#e8e0d4] mb-3 uppercase">
            Loading Cinematic Cells
          </p>
          <div className="w-40 h-[1.5px] bg-white/10 relative overflow-hidden">
            <div
              className="h-full bg-[#7fb3a8] transition-all duration-100 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="mt-2 font-body text-[10px] text-[#b8d4e8]/50 tracking-wider">
            {loadingProgress}%
          </span>
        </div>
      )}

      {/* Canvas */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Sound Controller Toggle Button */}
      <button
        onClick={toggleAudio}
        className="absolute top-8 right-8 z-30 p-3.5 rounded-full border border-white/10 bg-[#0a0a0a]/40 backdrop-blur-md text-[#e8e0d4] hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        aria-label="Toggle ambient forest soundscape"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-[#7fb3a8]" style={{ filter: "drop-shadow(0 0 5px #7fb3a8)" }} />
        ) : (
          <VolumeX className="w-5 h-5 text-[#e8e0d4]/40" />
        )}
      </button>

      {/* Overlay Narratives */}
      <div className="relative z-10 w-full max-w-3xl text-center px-8 pointer-events-none select-none">
        <h2 className="story-text-1 absolute inset-x-8 mx-auto font-display text-3xl md:text-5xl font-light tracking-[0.1em] text-white leading-relaxed [text-shadow:0_0_12px_rgba(255,255,255,0.35)]">
          A rainy evening at the forest stop...
        </h2>
        <h2 className="story-text-2 absolute inset-x-8 mx-auto font-display text-3xl md:text-5xl font-light tracking-[0.1em] text-white leading-relaxed [text-shadow:0_0_12px_rgba(255,255,255,0.35)] opacity-0">
          Two worlds, one moment of stillness.
        </h2>
        <h2 className="story-text-3 absolute inset-x-8 mx-auto font-display text-3xl md:text-5xl font-light tracking-[0.1em] text-white leading-relaxed [text-shadow:0_0_12px_rgba(255,255,255,0.35)] opacity-0">
          Magic is patient. So is wonder.
        </h2>
      </div>

      {/* Bottom hints */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center opacity-30">
        <span className="font-body text-[9px] tracking-[0.3em] text-[#e8e0d4] uppercase animate-pulse">
          Scroll to animate
        </span>
      </div>
    </div>
  );
}
