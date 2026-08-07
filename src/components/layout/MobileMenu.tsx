'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X, Phone, User, Send, MapPin, ExternalLink,
  Home, LayoutGrid, Info, MessageCircle, ChevronRight,
} from 'lucide-react';
import { NAVIGATION_LINKS } from '../../constants/navigation';
import { SITE_CONFIG } from '../../constants/site';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

// Map icon names to components
const ICON_MAP: Record<string, React.ElementType> = {
  Home, LayoutGrid, Info, MapPin, MessageCircle,
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  useScrollLock(isOpen);
  useEscapeKey(isOpen, onClose);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
      {/* Overlay backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className={`fixed inset-y-0 left-0 w-full sm:w-[380px] bg-white shadow-2xl flex flex-col overflow-y-auto z-10 transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="font-black text-white text-xs">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-wide text-primary uppercase leading-tight">
                VODIY KAFEL
              </span>
              <span className="text-[0.55rem] tracking-[0.25em] text-text-muted uppercase font-medium">
                SAVDO MARKAZI
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-all"
            aria-label="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Accent divider */}
        <div className="h-px bg-gradient-to-r from-accent/40 via-primary/20 to-transparent mx-6" />

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 p-4 pt-5">
          {NAVIGATION_LINKS.map((link, idx) => {
            const isActive = pathname === link.href;
            const IconComponent = link.icon ? ICON_MAP[link.icon] : null;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-primary hover:bg-bg-secondary'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'bg-bg-secondary text-text-secondary group-hover:bg-accent/10 group-hover:text-accent'
                }`}>
                  {IconComponent && <IconComponent className="w-[18px] h-[18px]" />}
                </div>
                <span className="text-[15px] font-bold tracking-tight flex-1">{link.label}</span>
                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                  isActive ? 'text-accent' : 'text-text-muted/40 group-hover:text-text-muted group-hover:translate-x-0.5'
                }`} />
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Section */}
        <div className="p-6 pt-4 space-y-5">
          {/* Quick Actions */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase px-1">
              Tezkor havolalar
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              <a
                href={`tel:${SITE_CONFIG.phonePrimary.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-accent/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-text-primary block">Qo&apos;ng&apos;iroq qilish</span>
                  <span className="text-[11px] text-text-muted">{SITE_CONFIG.phonePrimary}</span>
                </div>
              </a>

              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-accent/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-text-primary block">Admin Panel</span>
                  <span className="text-[11px] text-text-muted">Boshqaruv tizimi</span>
                </div>
              </Link>

              <a
                href={SITE_CONFIG.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-secondary hover:bg-accent/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-text-primary flex items-center gap-1">
                    Xaritada ochish
                    <ExternalLink className="w-3 h-3 text-text-muted" />
                  </span>
                  <span className="text-[11px] text-text-muted truncate block">{SITE_CONFIG.address}</span>
                </div>
              </a>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3 pt-3 border-t border-border">
            <span className="text-[10px] font-bold tracking-[0.2em] text-text-muted uppercase">
              IJTIMOIY:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={SITE_CONFIG.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#2AABEE]/10 text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-pink-50 text-pink-500 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
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
