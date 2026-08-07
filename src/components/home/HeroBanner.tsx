'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineCallMade as ArrowUpRight } from 'react-icons/md';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&auto=format&fit=crop',
    title: 'VODIY KAFEL',
    subtitle: 'Dizayn tanlovdan boshlanadi',
  },
  {
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&auto=format&fit=crop',
    title: 'YUKSAK SIFAT',
    subtitle: 'Eng sara materiallar to\'plami',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop',
    title: 'KENG TANLOV',
    subtitle: 'Har bir xona uchun maxsus dizayn',
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    startTimer(); // Reset autoplay timer on manual click
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[480px] md:h-[95vh] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-bg-dark">
      
      {/* Background Slides Container (Smooth opacity cross-fade transition) */}
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 z-[-1] pointer-events-none'
          }`}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url('${slide.image}')`,
          }}
        />
      ))}

      {/* Main Architectural Content */}
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 w-full text-center text-text-inverse z-10 flex flex-col items-center justify-center gap-8 md:gap-10 mt-12 md:mt-24">
        
        {/* Dynamic Titles based on Current Slide */}
        <div className="space-y-3 md:space-y-6 w-full">
          <h1 className="font-heading font-bold text-3xl min-[360px]:text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.05em] min-[360px]:tracking-[0.1em] sm:tracking-[0.15em] text-white leading-none uppercase select-none transition-all duration-700">
            {SLIDES[currentSlide].title}
          </h1>
          <p className="text-xs min-[360px]:text-sm md:text-xl font-light tracking-[0.1em] min-[360px]:tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/80 max-w-2xl mx-auto transition-all duration-700 px-2">
            {SLIDES[currentSlide].subtitle}
          </p>
        </div>

        {/* Buttons (Atlas Concorde style) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-4 max-w-[280px] xs:max-w-none">
          <a
            href="/products"
            className="w-full sm:w-auto px-8 h-12 rounded-full border border-white hover:bg-white hover:text-text-primary text-white text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all"
          >
            <span>Katalogni ko'rish</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" />
          </a>
          
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 h-12 rounded-full bg-white hover:bg-white/90 text-text-primary text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-black/10"
          >
            <span>Bog'lanish</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" />
          </a>
        </div>
      </div>

      {/* Decorative vertical lines for premium architectural grid feel */}
      <div className="absolute top-0 bottom-0 left-[15%] w-[1px] bg-white/5 pointer-events-none hidden lg:block" />
      <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-white/5 pointer-events-none hidden lg:block" />
      <div className="absolute top-0 bottom-0 left-[85%] w-[1px] bg-white/5 pointer-events-none hidden lg:block" />

      {/* Bottom Center Carousel Dots Indicators (Now fully functional!) */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleSlideChange(idx)}
            className={`h-1 rounded-full transition-all cursor-pointer ${
              idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
