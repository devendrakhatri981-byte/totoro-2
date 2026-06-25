"use client";

import React, { useEffect, useState } from "react";
import { useLenis } from "./LenisProvider";
import { motion } from "framer-motion";
import Magnetic from "./Magnetic";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Story", href: "#story" },
  { name: "Features", href: "#features" },
  { name: "Showcase", href: "#showcase" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navigation() {
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger when section hits the center band of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_LINKS.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) observer.observe(section);
    });

    return () => {
      NAV_LINKS.forEach((link) => {
        const section = document.querySelector(link.href);
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(href, { offset: 0, duration: 1.4 });
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.8, duration: 1, ease: [0.16, 1, 0.3, 1] }} // Appear after preloader wipe
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 md:px-6 py-2.5 md:py-3 rounded-full glassmorphism flex items-center gap-1 md:gap-3 select-none"
    >
      {NAV_LINKS.map((link) => {
        const isActive = activeSection === link.href;

        return (
          <Magnetic key={link.href} strength={0.2}>
            <a
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="relative px-3 py-1 text-[11px] md:text-xs font-body tracking-[0.12em] uppercase transition-colors duration-300 text-[#e8e0d4]/50 hover:text-[#e8e0d4]"
              style={{ display: "inline-block" }}
            >
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  isActive ? "text-[#e8e0d4] font-medium" : ""
                }`}
              >
                {link.name}
              </span>

              {/* Sliding active dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-[#7fb3a8]"
                  style={{ boxShadow: "0 0 8px #7fb3a8" }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </a>
          </Magnetic>
        );
      })}
    </motion.nav>
  );
}
