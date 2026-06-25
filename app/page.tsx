"use client";

import dynamic from "next/dynamic";
import { usePreloader } from "@/components/ClientLayout";

// Dynamic imports — SSR disabled for all WebGL/canvas heavy components
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const StorySection = dynamic(() => import("@/components/StorySection"), {
  ssr: false,
});
const FeaturesSection = dynamic(() => import("@/components/FeaturesSection"), {
  ssr: false,
});
const ShowcaseSection = dynamic(() => import("@/components/ShowcaseSection"), {
  ssr: false,
});
const ExperienceSection = dynamic(
  () => import("@/components/ExperienceSection"),
  { ssr: false }
);
const StatsSection = dynamic(() => import("@/components/StatsSection"), {
  ssr: false,
});
const TestimonialsSection = dynamic(
  () => import("@/components/TestimonialsSection"),
  { ssr: false }
);
const CTASection = dynamic(() => import("@/components/CTASection"), {
  ssr: false,
});
import Footer from "@/components/Footer";

export default function Home() {
  const preloaded = usePreloader();

  return (
    <main className="w-full" role="main" aria-label="Antigravity main content">
      {/* ── Hero — 3D R3F forest spirit + rain ───────────────── */}
      <Hero preloaded={preloaded} />

      {/* ── Story — 42-frame canvas scroll sequence ──────────── */}
      <StorySection />

      {/* ── Features — 3D hover tilt cards ───────────────────── */}
      <FeaturesSection />

      {/* ── Showcase — GSAP horizontal scroll gallery ────────── */}
      <ShowcaseSection />

      {/* ── Experience — Procedural R3F forest + camera pan ──── */}
      <ExperienceSection />

      {/* ── Stats — animated count-up columns ────────────────── */}
      <StatsSection />

      {/* ── Testimonials — carousel with depth layers ────────── */}
      <TestimonialsSection />

      {/* ── CTA — GLSL shader bg + magnetic button ───────────── */}
      <CTASection />

      {/* ── Contact placeholder ───────────────────────────────── */}
      <section
        id="contact"
        className="relative w-full py-40 px-6 flex flex-col items-center justify-center bg-[#0a0a0a] border-t border-white/5"
        aria-label="Contact section"
      >
        <div className="max-w-3xl text-center select-none">
          <span className="font-accent text-xs tracking-[0.25em] text-[#7fb3a8] uppercase">
            Reach out
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-light tracking-[0.08em] text-[#e8e0d4]">
            Leave the Grove
          </h2>
          <p className="mt-8 font-body text-sm md:text-base leading-[2] text-[#e8e0d4]/55 max-w-xl mx-auto font-light">
            Connect with us to explore custom 3D web spaces, advanced layout
            structures, and narrative-driven installations built to wonder.
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </main>
  );
}
