"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  categories: any[];
}

interface Slide {
  name: string;
  image: string;
}

interface Copy {
  title: string;
  subtitle: string;
}

// Curated luxury copy keyed by category name.
const COPY: Record<string, Copy> = {
  Corporate: {
    title: "Command Every Boardroom",
    subtitle: "Sharp, structured corporate suiting tailored to your authority.",
  },
  Agbada: {
    title: "Regal by Heritage",
    subtitle: "Majestic Agbadas crafted for the moments that define you.",
  },
  Kaftans: {
    title: "Effortless Distinction",
    subtitle: "Contemporary kaftans woven with timeless cultural pride.",
  },
  Kaftan: {
    title: "Effortless Distinction",
    subtitle: "Contemporary kaftans woven with timeless cultural pride.",
  },
  Suits: {
    title: "Sculpted to Perfection",
    subtitle: "Precision tailoring measured to your every contour.",
  },
  Default: {
    title: "Crafted for the Gentleman Who Commands Presence",
    subtitle:
      "Bespoke tailoring that honors tradition while defining modern luxury. Every stitch tells your story.",
  },
};

// Fallback slides used when no categories (or category images) are available.
const FALLBACK: Slide[] = [
  { name: "Corporate", image: "/images/category-corporate.jpg" },
  { name: "Agbada", image: "/images/category-agbada.jpg" },
  { name: "Kaftans", image: "/images/category-kaftan.jpg" },
  { name: "Suits", image: "/images/category-suits.jpg" },
];

const SLIDE_DURATION = 6000;

export default function Hero({ categories }: Props) {
  // Build slide list from categories that have an image; otherwise fall back.
  const fromCategories: Slide[] = (categories ?? [])
    .filter((c) => c && c.image)
    .map((c) => ({ name: c.name as string, image: c.image as string }));

  const slides: Slide[] = (fromCategories.length > 0 ? fromCategories : FALLBACK).slice(0, 5);

  const [index, setIndex] = useState(0);
  const safeIndex = index % slides.length;
  const active = slides[safeIndex];
  const copy = COPY[active.name] || COPY.Default;

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  // Auto-advance. Re-runs (and resets the timer) whenever `index` changes,
  // so clicking a dot effectively resets the autoplay countdown.
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [index, slides.length]);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black text-ivory">
      {/* Background crossfade + Ken Burns zoom */}
      <AnimatePresence mode="sync">
        <motion.div
          key={safeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            src={active.image}
            alt={active.name}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_DURATION / 1000, ease: "easeOut" }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        {/* Per-slide copy animates in on change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={safeIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-ivory mb-6 leading-tight md:leading-tight">
              {copy.title}
            </h1>
            <div className="h-1 w-16 bg-[#D4AF37] mb-8" />
            <p className="text-base md:text-xl text-cream mb-10 max-w-2xl font-light leading-relaxed">
              {copy.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Static CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/shop" className="w-full sm:w-auto">
            <button className="px-8 py-4 bg-[#D4AF37] text-black font-semibold tracking-wider uppercase text-xs sm:text-sm hover:bg-ivory transition-colors w-full">
              Explore Our Shop
            </button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <button className="px-8 py-4 border border-[#D4AF37] text-[#D4AF37] font-semibold tracking-wider uppercase text-xs sm:text-sm hover:bg-[#D4AF37] hover:text-black transition-colors w-full">
              Book a Fitting
            </button>
          </Link>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.name + i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === safeIndex ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
