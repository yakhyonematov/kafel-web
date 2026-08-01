'use client';

import React from 'react';
import Link from 'next/link';
import { X, Phone, User, Send } from 'lucide-react';
import { NAVIGATION_LINKS } from '../../constants/navigation';
import { SITE_CONFIG } from '../../constants/site';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useScrollLock(isOpen);
  useEscapeKey(isOpen, onClose);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
      {/* Overlay backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Slide-out Panel (Sliding from Left as in Atlas Concorde screenshot) */}
      <div className={`fixed inset-y-0 left-0 w-full sm:w-[360px] bg-white shadow-2xl flex flex-col p-8 overflow-y-auto z-10 justify-between transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="space-y-10">
          {/* Top Row: Circular Close Button & Logo */}
          <div className="flex justify-between items-center border-b border-border pb-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent text-white flex items-center justify-center rotate-45 transform">
                <span className="-rotate-45 font-bold text-xs">V</span>
              </div>
              <span className="font-sans font-bold text-xs tracking-widest text-primary uppercase">
                VODIY KAFEL
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-bg-secondary transition-all"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Large Menu Navigation Links (Atlas Concorde style) */}
          <nav className="flex flex-col gap-6">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="text-2xl font-bold text-text-primary hover:text-accent transition-colors tracking-tight block py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Secondary Links & Actions */}
        <div className="space-y-8 pt-8 border-t border-border mt-auto">
          <div className="flex flex-col gap-4 text-sm font-semibold">
            {/* Quick Link 1: Call */}
            <a
              href={`tel:${SITE_CONFIG.phonePrimary.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 text-text-primary hover:text-accent transition-colors"
            >
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span>Qo'ng'iroq: {SITE_CONFIG.phonePrimary}</span>
            </a>

            {/* Quick Link 2: Admin Panel */}
            <Link
              href="/admin/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 text-text-primary hover:text-accent transition-colors"
            >
              <User className="w-4 h-4 text-accent shrink-0" />
              <span>Admin Panelga kirish</span>
            </Link>

            {/* Quick Link 3: Map Location */}
            <a
              href={SITE_CONFIG.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-text-primary hover:text-accent transition-colors"
            >
              <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Xaritada ochish (Yandex)</span>
            </a>
          </div>

          {/* Socials & Follow Us Section */}
          <div className="space-y-3.5 border-t border-border-light pt-6">
            <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase block">
              FOLLOW US:
            </span>
            <div className="flex items-center gap-4">
              <a
                href={SITE_CONFIG.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-accent hover:text-white hover:border-accent transition-all"
                aria-label="Telegram"
              >
                <Send className="w-4.5 h-4.5 rotate-[-30deg]" />
              </a>
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-accent hover:text-white hover:border-accent transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
