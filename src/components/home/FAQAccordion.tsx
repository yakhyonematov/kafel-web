'use client';

import React, { useState } from 'react';
import { FAQ_DATA } from '../../constants/faq';
import { ChevronRight, HelpCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="py-16 md:py-24 bg-white border-t border-b border-border-light w-full relative overflow-hidden">
      {/* Decorative vertical background line */}
      <div className="absolute inset-y-0 left-1/3 w-[1px] bg-border-light/40 pointer-events-none hidden lg:block" />

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-border-light">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase block">
              Savol-Javoblar
            </span>
            <h2 className="font-sans font-medium text-2xl sm:text-3xl tracking-tight text-text-primary uppercase">
              Eng ko'p beriladigan savollar
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Kafel va plitkalarni sotib olish, yetkazib berish va sifat kafolatlari bo'yicha eng muhim ma'lumotlar.
            </p>
          </div>
          <Link
            href="/#contact"
            className="px-6 h-10 rounded-full border border-primary hover:bg-primary hover:text-white text-text-primary text-[10px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all self-start md:self-auto shrink-0"
          >
            <span>Savol qoldirish</span>
            <MessageSquare className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* FAQ Dashboard Console */}
        
        {/* Desktop View (lg:grid) */}
        <div className="hidden lg:grid grid-cols-12 gap-10 lg:gap-16 items-stretch">
          
          {/* Left Column: Interactive Timeline Question Index (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-4">
            <span className="text-[9px] font-bold tracking-[0.25em] text-text-muted uppercase mb-2 block">
              Mavzular indeksi
            </span>
            
            <div className="space-y-3.5">
              {FAQ_DATA.map((faq, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={faq.id}
                    onClick={() => setActiveIndex(index)}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-300 flex items-start gap-4 focus:outline-none ${
                      isActive
                        ? 'border-accent bg-accent/5 text-text-primary shadow-xs'
                        : 'border-border hover:border-text-muted text-text-secondary bg-transparent'
                    }`}
                  >
                    <span className={`text-[10px] sm:text-xs font-mono font-bold leading-none mt-1 shrink-0 ${
                      isActive ? 'text-accent' : 'text-text-muted'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-1 flex-1">
                      <h3 className={`font-semibold text-xs sm:text-sm tracking-wide leading-snug uppercase ${
                        isActive ? 'text-text-primary' : 'text-text-secondary'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 transition-transform duration-300 ${
                      isActive ? 'text-accent translate-x-1' : 'text-text-muted/60'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: High Contrast Answer Display (7 cols) */}
          <div className="lg:col-span-7 flex">
            <div className="bg-[#1E1E1E] text-white/90 p-8 sm:p-10 rounded-xl flex flex-col justify-between gap-8 border border-white/5 shadow-lg w-full relative overflow-hidden group">
              {/* Giant quotation graphic overlay */}
              <div className="absolute -right-6 -top-10 text-[180px] font-serif font-bold text-white/5 select-none leading-none pointer-events-none">
                “
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-accent uppercase">
                    Javob №{String(activeIndex + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="space-y-4">
                  <h4 className="font-sans font-medium text-base sm:text-lg text-white uppercase tracking-wide leading-snug border-b border-white/10 pb-4">
                    {FAQ_DATA[activeIndex]?.question}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                    {FAQ_DATA[activeIndex]?.answer}
                  </p>
                </div>
              </div>

              {/* Console Footer */}
              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                  Vodiy Kafel Savdo Uyi
                </span>
                <Link
                  href="/#contact"
                  className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-accent transition-colors flex items-center gap-1"
                >
                  <span>Qo'shimcha savol so'rash</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View (lg:hidden inline vertical accordion) */}
        <div className="block lg:hidden space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-md'
                    : 'border-border bg-white text-text-primary'
                }`}
              >
                <button
                  onClick={() => setActiveIndex(isActive ? -1 : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm tracking-wide focus:outline-none"
                >
                  <span className={`text-xs font-mono shrink-0 ${isActive ? 'text-accent' : 'text-text-muted'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 uppercase font-semibold text-xs">{faq.question}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                    isActive ? 'text-accent rotate-90' : 'text-text-muted/60'
                  }`} />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isActive ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="px-4 pb-5 pt-1 text-xs sm:text-sm leading-relaxed font-light border-t border-white/10 text-white/70">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
