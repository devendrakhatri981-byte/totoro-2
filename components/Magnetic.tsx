"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
  className?: string;
}

export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: MagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      // Animate displacement towards mouse position
      gsap.to(el, {
        x: distanceX * strength,
        y: distanceY * strength,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      // Spring back to original position
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <div
      ref={containerRef}
      className={`magnetic-wrapper inline-block ${className}`}
      data-magnetic="true"
    >
      {children}
    </div>
  );
}
