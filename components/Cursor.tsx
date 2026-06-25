"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Cursor() {
  const mainRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    trailRefs.current = trailRefs.current.slice(0, 8);
  }, []);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    // Show cursor on first mousemove to prevent cursor appearing at (0, 0)
    const onFirstMove = () => {
      setIsVisible(true);
      window.removeEventListener("mousemove", onFirstMove);
    };
    window.addEventListener("mousemove", onFirstMove);

    // Initialize quick setters using GSAP
    const xSetters = [
      gsap.quickTo(mainEl, "x", { duration: 0.05, ease: "power3.out" }),
      ...trailRefs.current.map((ref, idx) =>
        gsap.quickTo(ref, "x", { duration: 0.08 + idx * 0.03, ease: "power3.out" })
      ),
    ];

    const ySetters = [
      gsap.quickTo(mainEl, "y", { duration: 0.05, ease: "power3.out" }),
      ...trailRefs.current.map((ref, idx) =>
        gsap.quickTo(ref, "y", { duration: 0.08 + idx * 0.03, ease: "power3.out" })
      ),
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      xSetters.forEach((setter) => setter(clientX));
      ySetters.forEach((setter) => setter(clientY));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-magnetic]") ||
        target.classList.contains("interactive") ||
        target.style.cursor === "pointer";

      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const relatedTarget = e.relatedTarget as HTMLElement;
      const wasInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-magnetic]") ||
        target.classList.contains("interactive");

      const isNowInteractive =
        relatedTarget &&
        (relatedTarget.tagName === "A" ||
          relatedTarget.tagName === "BUTTON" ||
          relatedTarget.closest("a") ||
          relatedTarget.closest("button") ||
          relatedTarget.closest("[data-magnetic]") ||
          relatedTarget.classList.contains("interactive"));

      if (wasInteractive && !isNowInteractive) {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onFirstMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* 8 Trail Ghost Cursors */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="custom-cursor fixed bg-glow"
          style={{
            width: isHovered ? "20px" : "8px",
            height: isHovered ? "20px" : "8px",
            opacity: (8 - i) * 0.08,
            transition: "width 0.3s ease, height 0.3s ease",
            backgroundColor: "#7fb3a8", // Glow teal
          }}
        />
      ))}

      {/* Main Cursor Dot */}
      <div
        ref={mainRef}
        className={`custom-cursor fixed bg-primary ${
          isHovered ? "cursor-glow" : ""
        }`}
        style={{
          width: isHovered ? "40px" : "12px",
          height: isHovered ? "40px" : "12px",
          boxShadow: isHovered ? "0 0 15px #7fb3a8" : "none",
          transition: "width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease",
          backgroundColor: "#e8e0d4", // Primary warm white
        }}
      />
    </>
  );
}
