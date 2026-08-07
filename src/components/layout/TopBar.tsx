'use client';

import React from 'react';
import { MdOutlineCall as Phone, MdOutlineAccessTime as Clock, MdOutlineSend as Send } from 'react-icons/md';
import { SITE_CONFIG } from '../../constants/site';

export default function TopBar() {
  return (
    <div className="w-full bg-primary-dark text-text-inverse/80 text-[11px] font-semibold tracking-widest uppercase py-4 border-b border-white/10 hidden md:block">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 flex justify-between items-center gap-4">
        {/* Left side: Working hours */}
        <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>Ish vaqti: {SITE_CONFIG.workHours} ({SITE_CONFIG.workDays.split('(')[0].trim()})</span>
        </div>

        {/* Right side: Contact & Socials */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0 whitespace-nowrap">
          <a
            href={`tel:${SITE_CONFIG.phonePrimary.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-accent" />
            <span>{SITE_CONFIG.phonePrimary}</span>
          </a>
          
          <div className="flex items-center gap-3 border-l border-white/15 pl-4 shrink-0">
            <a
              href={SITE_CONFIG.socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-3.5 h-3.5 rotate-[-30deg]" />
            </a>
            <a
              href={SITE_CONFIG.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors animate-fade-in"
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
      </div>
    </div>
  );
}
