'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, Phone, User, Globe, X } from 'lucide-react';
import { NAVIGATION_LINKS } from '../../constants/navigation';
import { SITE_CONFIG } from '../../constants/site';
import { useCartStore } from '../../store/useCartStore';
import { useFilterStore } from '../../store/useFilterStore';
import MobileMenu from './MobileMenu';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setSearch = useFilterStore((state) => state.setSearch);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchVal);
    setIsMobileSearchOpen(false);
    if (pathname !== '/products') {
      router.push(`/products?search=${encodeURIComponent(searchVal)}`);
    }
  };

  const isTransparent = pathname === '/' && !isScrolled;

  return (
    <>
      <header
        className="fixed top-0 md:top-4 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:max-w-[1240px] px-0 md:px-6 z-[45] transition-all duration-300"
      >
        {/* Mobile Search Overlay Bar */}
        {isMobileSearchOpen && (
          <div className="absolute inset-0 bg-white z-50 flex items-center px-4 gap-3 border-b border-border text-text-primary h-16 md:h-20 rounded-none md:rounded-full shadow-lg">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center relative">
              <input
                type="text"
                placeholder="Mahsulot kodini yoki nomini qidiring..."
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full h-11 pl-4 pr-10 rounded-full border border-border bg-bg-secondary text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-3.5 text-text-muted hover:text-primary"
                aria-label="Qidirish"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 rounded-full hover:bg-bg-secondary text-text-secondary"
              aria-label="Qidiruvni yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Main Floating Navbar Capsule */}
        <div
          className={`w-full h-16 md:h-20 transition-all duration-300 rounded-none md:rounded-full px-4 md:px-8 flex justify-between items-center gap-4 border ${
            isTransparent
              ? 'bg-transparent text-white border-transparent'
              : 'bg-white/95 backdrop-blur-md text-text-primary shadow-lg shadow-black/5 border-border/80'
          }`}
        >
          {/* 1. Left side: Menu trigger & Logo */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Hamburger menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 rounded-full transition-colors hover:bg-black/5 ${
                isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-bg-secondary text-text-primary'
              }`}
              aria-label="Menyu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-accent text-white flex items-center justify-center rotate-45 transform shadow-xs shrink-0">
                <span className="-rotate-45 font-bold text-xs sm:text-sm tracking-tight">V</span>
              </div>
              <span className="font-sans font-bold text-xs min-[360px]:text-sm sm:text-base md:text-lg tracking-[0.1em] min-[360px]:tracking-[0.2em] md:tracking-[0.25em] leading-none uppercase select-none text-current truncate">
                VODIY KAFEL
              </span>
            </Link>
          </div>

          {/* 2. Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAVIGATION_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.18em] transition-all relative py-1 hover:text-accent ${
                    isTransparent
                      ? isActive ? 'text-white border-b-2 border-white' : 'text-white/70'
                      : isActive ? 'text-accent border-b-2 border-accent' : 'text-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right side: Search Input (desktop) & Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* Search Input Bar (desktop only) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-40 lg:w-48 xl:w-56">
              <input
                type="text"
                placeholder="Qidiruv..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className={`w-full h-9 pl-4 pr-9 rounded-full text-xs transition-all focus:outline-none ${
                  isTransparent
                    ? 'border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white focus:bg-white/15'
                    : 'border border-border bg-bg-secondary text-text-primary placeholder-text-muted focus:border-accent focus:bg-white'
                }`}
              />
              <button
                type="submit"
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                  isTransparent ? 'text-white/60 hover:text-white' : 'text-text-muted hover:text-primary'
                }`}
                aria-label="Qidirish"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Call */}
            <a
              href={`tel:${SITE_CONFIG.phonePrimary.replace(/\s+/g, '')}`}
              className={`p-2 rounded-full transition-colors hover:bg-black/5 hidden sm:flex ${
                isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-bg-secondary text-text-primary'
              }`}
              title="Qo'ng'iroq qilish"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Profile icon */}
            <Link
              href="/admin/dashboard"
              className={`p-2 rounded-full transition-colors hover:bg-black/5 hidden sm:flex ${
                isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-bg-secondary text-text-primary'
              }`}
              title="Admin Panel"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Language indicator */}
            <div
              className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isTransparent ? 'bg-white/10 border border-white/20' : 'bg-bg-secondary border border-border'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>UZ</span>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className={`p-2 rounded-full sm:hidden transition-colors hover:bg-black/5 ${
                isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-bg-secondary text-text-primary'
              }`}
              aria-label="Qidirish"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Icon Drawer Trigger */}
            <button
              onClick={() => {
                const event = new CustomEvent('open-cart-drawer');
                window.dispatchEvent(event);
              }}
              className={`p-2 rounded-full relative transition-colors hover:bg-black/5 ${
                isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-bg-secondary text-text-primary'
              }`}
              aria-label="Savat"
            >
              <ShoppingBag className="w-4 h-4" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Adjust page margin to header height (except on home page where hero starts on top) */}
      {pathname !== '/' && <div className="h-16 md:h-24" />}
    </>
  );
}
