'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MdOutlineCall as Phone, MdOutlineEmail as Mail, MdOutlineLocationOn as MapPin, MdOutlineAccessTime as Clock, MdOutlineSend as Send, MdOutlineArrowUpward as ArrowUp, MdOutlineVerifiedUser as ShieldCheck } from 'react-icons/md';
import { SITE_CONFIG } from '../../constants/site';
import { NAVIGATION_LINKS } from '../../constants/navigation';

export default function Footer() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
    setPhone('');
    setName('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#121212] text-text-inverse/70 pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Symmetrical Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-accent text-white rounded-full flex items-center justify-center hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all z-20 group"
        aria-label="Yuqoriga qaytish"
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>

      {/* Decorative vertical background divider lines */}
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none hidden lg:block">
        <div className="max-w-[1240px] mx-auto h-full px-6 grid grid-cols-12 divide-x divide-white/5">
          <div className="col-span-4 h-full"></div>
          <div className="col-span-2 h-full"></div>
          <div className="col-span-3 h-full"></div>
          <div className="col-span-3 h-full"></div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand details (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 text-white">
              {/* Brand Red Diamond Logo */}
              <div className="w-9 h-9 bg-accent rotate-45 flex items-center justify-center shrink-0 border border-white/10 shadow-md">
                <span className="font-sans font-bold text-white text-base -rotate-45">V</span>
              </div>
              <span className="font-sans font-medium text-lg leading-tight tracking-[0.1em] uppercase">
                Vodiy Kafel
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-text-inverse/50 leading-relaxed max-w-sm">
              {SITE_CONFIG.description.split('.')[0]}. Biz mijozlarimizni yuqori sifatli, birinchi sort kafellar bilan ta'minlaymiz hamda ularning xonadoniga o’zgacha kayfiyat va shinamlik ulashamiz.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:border-accent hover:-translate-y-0.5 transition-all"
                aria-label="Telegram"
              >
                <Send className="w-3.5 h-3.5 rotate-[-30deg]" />
              </a>
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:border-accent hover:-translate-y-0.5 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-5 lg:pl-4">
            <h3 className="text-white font-bold text-[10px] uppercase tracking-[0.2em] border-b border-white/10 pb-3">
              Navigatsiya
            </h3>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent transition-colors block py-0.5 text-text-inverse/60 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-white font-bold text-[10px] uppercase tracking-[0.2em] border-b border-white/10 pb-3">
              Kontaktlarimiz
            </h3>
            <ul className="flex flex-col gap-4 text-xs sm:text-sm text-text-inverse/60">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a
                    href={SITE_CONFIG.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors leading-relaxed block text-white/90"
                  >
                    {SITE_CONFIG.address}
                  </a>
                  <span className="block text-[10px] text-text-inverse/40">
                    Mo'ljal: {SITE_CONFIG.landmarks}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 text-white/90">
                  <a href={`tel:${SITE_CONFIG.phonePrimary.replace(/\s+/g, '')}`} className="hover:text-white transition-colors font-medium">
                    {SITE_CONFIG.phonePrimary}
                  </a>
                  <a href={`tel:${SITE_CONFIG.phoneSecondary.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                    {SITE_CONFIG.phoneSecondary}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors block text-white/90">
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-xs text-text-inverse/50 pt-1">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-white/80">{SITE_CONFIG.workHours}</p>
                  <p className="text-[10px]">{SITE_CONFIG.workDays}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Callback (3 cols - Minimalist form design) */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-white font-bold text-[10px] uppercase tracking-[0.2em] border-b border-white/10 pb-3">
              Savollaringiz bormi?
            </h3>
            <p className="text-xs text-text-inverse/50 leading-relaxed">
              Raqamingizni qoldiring, biz tez orada sizga qayta qo'ng'iroq qilamiz.
            </p>

            {submitted ? (
              <div className="p-4 bg-white/5 border border-success/30 rounded-lg text-success text-xs leading-relaxed text-center animate-fade-in">
                Muvaffaqiyatli yuborildi! Tez fursatda bog'lanamiz.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {/* Name Input Underlined */}
                <div className="border-b border-white/10 focus-within:border-accent transition-colors pb-0.5">
                  <input
                    type="text"
                    placeholder="Ismingiz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-9 bg-transparent text-xs text-white placeholder-white/30 focus:outline-none w-full"
                  />
                </div>
                {/* Phone Input Underlined */}
                <div className="border-b border-white/10 focus-within:border-accent transition-colors pb-0.5">
                  <div className="flex items-center w-full">
                    <span className="text-xs text-white/70 font-medium pr-1 shrink-0">+998</span>
                    <input
                      type="tel"
                      placeholder="Telefon raqamingiz"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="flex-1 h-9 bg-transparent text-xs text-white placeholder-white/30 focus:outline-none w-full"
                    />
                  </div>
                </div>
                {/* Submit button pill shape */}
                <button
                  type="submit"
                  className="w-full h-10 bg-accent text-white font-bold text-[10px] rounded-full uppercase tracking-widest hover:bg-accent-hover transition-all shadow-md shadow-accent/15"
                >
                  Yuborish
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright / Links */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-text-inverse/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <p>© 2026 {SITE_CONFIG.name}. Barcha huquqlar himoyalangan.</p>
          </div>
          <div className="flex gap-4 uppercase tracking-widest text-[9px] font-bold">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Maxfiylik siyosati
            </Link>
            <span>•</span>
            <a href={SITE_CONFIG.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              Xarita orqali topish
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
