/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { TouristDestination } from "../types";
import { getDestinationImage } from "../utils/imageHelper";

// 1. ANIMATED COUNTER COMPONENT
interface AnimatedCounterProps {
  value: number;
  duration?: number; // default 1.5 seconds
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ value, duration = 1.5, suffix = "", className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    
    if (elementRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            let start = 0;
            const end = value;
            if (start === end) return;

            const totalMiliseconds = duration * 1000;
            const startTime = performance.now();

            const updateCount = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / totalMiliseconds, 1);
              
              // Ease-out quad formula
              const easeOut = (t: number) => t * (2 - t);
              const current = Math.floor(start + easeOut(progress) * (end - start));
              
              setCount(current);

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                setCount(end);
              }
            };

            requestAnimationFrame(updateCount);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer && elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span ref={elementRef} className={className}>
      {count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

// 2. SHIMMER SKELETON COMPONENT
interface ShimmerSkeletonProps {
  className?: string;
  rows?: number;
}

export function ShimmerSkeleton({ className = "h-4 w-full rounded-lg", rows = 1 }: ShimmerSkeletonProps) {
  if (rows > 1) {
    return (
      <div className="space-y-3.5 py-2 w-full">
        {Array.from({ length: rows }).map((_, idx) => {
          const widths = ["w-3/4", "w-5/6", "w-2/3", "w-1/2", "w-4/5"];
          const widthClass = widths[idx % widths.length];
          return (
            <div
              key={idx}
              className={`h-4.5 ${widthClass} rounded-xl animate-shimmer`}
            />
          );
        })}
      </div>
    );
  }
  return (
    <div className={`${className} animate-shimmer`} />
  );
}

// 3. PREMIUM IMAGES CAROUSEL SHOWCASE
interface PremiumCarouselProps {
  destinations: TouristDestination[];
  onSelect?: (dest: TouristDestination) => void;
}

const DEFAULT_CAROUSEL_SPOTS = [
  {
    name: "Kodaikanal",
    state: "Tamil Nadu",
    district: "Dindigul",
    overview: "A misty, scenic hill station with a beautiful star-shaped lake, dense pine forests, and towering green valleys.",
    tags: { isHillStation: true, isBeach: false, isWaterfall: false, isForestOrNationalPark: false, isTempleOrMuseum: false, isViewpoint: true }
  },
  {
    name: "Munnar",
    state: "Kerala",
    district: "Idukki",
    overview: "Breathtakingly beautiful hill station famous for its rolling hills covered in vibrant, lush tea plantations.",
    tags: { isHillStation: true, isBeach: false, isWaterfall: false, isForestOrNationalPark: false, isTempleOrMuseum: false, isViewpoint: true }
  },
  {
    name: "Hampi",
    state: "Karnataka",
    district: "Vijayanagara",
    overview: "A majestic UNESCO World Heritage Site with ancient ruins, exquisite stone monuments, and unique boulder landscapes.",
    tags: { isHillStation: false, isBeach: false, isWaterfall: false, isForestOrNationalPark: false, isTempleOrMuseum: true, isViewpoint: false }
  },
  {
    name: "Varkala",
    state: "Kerala",
    district: "Trivandrum",
    overview: "A stunning seaside destination featuring unique high red-sandstone cliffs facing the Arabian Sea.",
    tags: { isHillStation: false, isBeach: true, isWaterfall: false, isForestOrNationalPark: false, isTempleOrMuseum: false, isViewpoint: true }
  },
  {
    name: "Gokarna",
    state: "Karnataka",
    district: "Uttara Kannada",
    overview: "A quiet, spiritual coastal town famous for its pristine crescent-shaped beaches and beautiful rocky terrains.",
    tags: { isHillStation: false, isBeach: true, isWaterfall: false, isForestOrNationalPark: false, isTempleOrMuseum: false, isViewpoint: true }
  }
];

export function PremiumCarousel({ destinations, onSelect }: PremiumCarouselProps) {
  const list = destinations && destinations.length >= 3 ? destinations : (DEFAULT_CAROUSEL_SPOTS as any[] as TouristDestination[]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  useEffect(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
    autoplayTimer.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [currentIndex, list.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const activeSpot = list[currentIndex];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 px-1">
        <div>
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            Curated Premier Destinations
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-dark tracking-tight">
            Explore Spectacular Escapes
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-sm font-light">
          Swipe or navigate through our premium featured destinations, showing estimated costs, local attractions, and scenic views.
        </p>
      </div>

      <div 
        className="relative h-[340px] sm:h-[450px] md:h-[500px] w-full rounded-[32px] overflow-hidden border border-white/60 shadow-2xl group select-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* CAROUSEL IMAGE SLIDES WITH KEN BURNS ACTIVE EFFECT */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <motion.img
                src={getDestinationImage(activeSpot.name, activeSpot.tags, "original")}
                alt={activeSpot.name}
                initial={{ scale: 1.02 }}
                animate={{ scale: 1.12 }}
                transition={{ duration: 6, ease: "easeOut" }}
                className="w-full h-full object-cover origin-center"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dark Cinematic Vignette & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent z-10" />
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-950/30 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-950/30 to-transparent z-10 hidden md:block" />
        </div>

        {/* GLASSMORPHIC CAPTION OVERLAYS */}
        <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-10 right-4 sm:right-10 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-5 sm:p-7 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl max-w-2xl text-left"
            >
              <div className="flex flex-wrap items-center gap-2.5 mb-2 sm:mb-3">
                <span className="px-3 py-1 bg-gradient-to-r from-primary to-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-md shadow-primary/10">
                  {activeSpot.state}
                </span>
                <span className="text-white/80 text-[10px] font-bold tracking-wide flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  {activeSpot.district} District
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-display font-black text-white tracking-tight drop-shadow-sm mb-2 sm:mb-3">
                {activeSpot.name}
              </h3>

              <p className="text-xs text-white/90 leading-relaxed font-light line-clamp-3 mb-4 sm:mb-5">
                {activeSpot.overview}
              </p>

              {onSelect && (
                <button
                  onClick={() => onSelect(activeSpot)}
                  className="px-5 py-3.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-xl transition shadow-lg active:scale-95 cursor-pointer hover:opacity-95"
                >
                  View full details & vote
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NAVIGATION CONTROLS */}
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 rounded-full transition cursor-pointer select-none z-30 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 hidden sm:block shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 rounded-full transition cursor-pointer select-none z-30 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 hidden sm:block shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* PAGINATION DOTS */}
        <div className="absolute top-6 right-6 sm:right-10 z-20 flex gap-2">
          {list.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? "w-6 bg-secondary" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
