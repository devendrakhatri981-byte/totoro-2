"use client";

import React from "react";
import { useLenis } from "./LenisProvider";

const NAV_LINKS = ["Home", "Story", "Features", "Showcase", "Experience", "Contact"];
const NAV_HREFS = ["#home", "#story", "#features", "#showcase", "#experience", "#contact"];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const SOCIALS = [
  { icon: <GitHubIcon />, href: "https://github.com", label: "GitHub" },
  { icon: <TwitterIcon />, href: "https://x.com", label: "Twitter / X" },
  { icon: <InstagramIcon />, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  const lenis = useLenis();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(href, { duration: 1.4 });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="relative w-full bg-[#080808] border-t border-white/5"
      role="contentinfo"
    >
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, #4a7c6f 30%, #7fb3a8 50%, #4a7c6f 70%, transparent)",
        }}
      />

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        {/* Wordmark */}
        <div>
          <span
            className="font-display text-2xl font-light tracking-[0.15em] text-[#e8e0d4]"
            aria-label="Antigravity wordmark"
          >
            Antigravity
          </span>
          <p className="mt-2 font-body text-[11px] tracking-[0.18em] text-[#e8e0d4]/30 uppercase">
            Between Rain and Wonder
          </p>
        </div>

        {/* Nav Links */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {NAV_LINKS.map((name, i) => (
            <a
              key={name}
              href={NAV_HREFS[i]}
              onClick={(e) => handleNavClick(e, NAV_HREFS[i])}
              className="group relative font-body text-xs tracking-[0.15em] text-[#e8e0d4]/45 uppercase hover:text-[#e8e0d4] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb3a8] rounded-sm py-1"
            >
              {name}
              {/* Underline draw from left */}
              <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-[#7fb3a8] group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex justify-end gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="p-2.5 rounded-full border border-white/8 bg-white/5 text-[#e8e0d4]/40 hover:text-[#7fb3a8] hover:bg-white/10 hover:scale-110 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb3a8]"
              style={{
                boxShadow: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 12px rgba(127,179,168,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 py-5">
        <p className="text-center font-body text-[10px] tracking-[0.25em] text-[#e8e0d4]/25 uppercase">
          © 2026 Antigravity. Crafted with stillness.
        </p>
      </div>
    </footer>
  );
}
