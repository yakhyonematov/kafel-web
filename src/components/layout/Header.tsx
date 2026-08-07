'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdOutlineShoppingBag as ShoppingBag, MdOutlineSearch as Search, MdOutlineMenu as Menu, MdOutlineCall as Phone, MdOutlinePerson as User, MdOutlineClose as X, MdOutlineHome as Home, MdOutlineGridView as LayoutGrid, MdOutlineInfo as Info, MdOutlineLocationOn as MapPin, MdOutlineChatBubble as MessageCircle, MdOutlineArrowForward as ArrowRight } from 'react-icons/md';
import { NAVIGATION_LINKS } from '../../constants/navigation';
import { SITE_CONFIG } from '../../constants/site';
import { useCartStore } from '../../store/useCartStore';
import { useFilterStore } from '../../store/useFilterStore';
import MobileMenu from './MobileMenu';

// Map icon name strings to actual Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Home, LayoutGrid, Info, MapPin, MessageCircle,
};

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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setSearch(searchVal);
    setIsMobileSearchOpen(false);
    if (pathname !== '/products') {
      router.push(`/products?search=${encodeURIComponent(searchVal)}`);
    }
  };

  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[45] transition-all duration-300 ${
          isTransparent
            ? 'bg-black/25 backdrop-blur-md'
            : 'bg-white/95 backdrop-blur-xl border-b border-border'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">

              {/* ─── Left: Logo & Brand ─── */}
              <Link href="/" className="flex items-center gap-2.5 shrink-0">
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 ${
                  isTransparent ? 'bg-white/15' : 'bg-accent'
                }`}>
                  <span className="font-black text-sm text-white">V</span>
                </div>
                <div className="flex flex-col">
                  <span className={`font-black text-sm tracking-wide uppercase leading-tight transition-colors ${
                    isTransparent ? 'text-white' : 'text-primary'
                  }`}>
                    VODIY KAFEL
                  </span>
                  <span className={`hidden sm:block text-[0.6rem] tracking-[0.25em] uppercase font-medium leading-none mt-0.5 transition-colors ${
                    isTransparent ? 'text-white/60' : 'text-text-muted'
                  }`}>
                    SAVDO MARKAZI
                  </span>
                </div>
              </Link>

              {/* ─── Center: Desktop Navigation ─── */}
              <nav className="hidden xl:flex items-center gap-1">
                {NAVIGATION_LINKS.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]) && link.href.split('#')[0] !== '/');
                  const IconComponent = link.icon ? ICON_MAP[link.icon] : null;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                        isTransparent
                          ? isActive
                            ? 'bg-white/15 text-white'
                            : 'text-white/75 hover:text-white hover:bg-white/10'
                          : isActive
                            ? 'bg-accent text-white'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                      }`}
                    >
                      {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* ─── Right: Actions ─── */}
              <div className="flex items-center gap-1 sm:gap-1.5">

                {/* Desktop Search */}
                <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
                  <input
                    type="text"
                    placeholder="Qidiruv..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className={`w-36 lg:w-44 h-9 pl-3.5 pr-9 rounded-full text-xs font-medium transition-all duration-300 focus:outline-none focus:w-52 lg:focus:w-56 ${
                      isTransparent
                        ? 'bg-white/10 border border-white/20 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/40'
                        : 'bg-bg-secondary border border-transparent text-text-primary placeholder-text-muted focus:border-accent/40 focus:bg-white focus:shadow-sm'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                      isTransparent ? 'text-white/50 hover:text-white' : 'text-text-muted hover:text-accent'
                    }`}
                    aria-label="Qidirish"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Divider */}
                <div className={`hidden md:block w-px h-6 mx-1.5 ${isTransparent ? 'bg-white/20' : 'bg-border'}`} />

                {/* Quick Call */}
                <a
                  href={`tel:${SITE_CONFIG.phonePrimary.replace(/\s+/g, '')}`}
                  className={`hidden sm:flex items-center gap-1.5 h-8 pl-2 pr-3 rounded-full text-xs font-bold transition-colors duration-150 ${
                    isTransparent
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-text-secondary hover:bg-accent/10 hover:text-accent'
                  }`}
                  title="Qo'ng'iroq qilish"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline tracking-wide">Aloqa</span>
                </a>

                {/* Admin */}
                <Link
                  href="/admin/dashboard"
                  className={`hidden sm:flex w-8 h-8 items-center justify-center rounded-full transition-all duration-200 ${
                    isTransparent
                      ? 'text-white/70 hover:bg-white/10 hover:text-white'
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  }`}
                  title="Admin Panel"
                >
                  <User className="w-4 h-4" />
                </Link>

                {/* Mobile Search */}
                <button
                  onClick={() => setIsMobileSearchOpen(true)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full md:hidden transition-all duration-200 ${
                    isTransparent
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  }`}
                  aria-label="Qidirish"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Cart */}
                <button
                  onClick={() => {
                    const event = new CustomEvent('open-cart-drawer');
                    window.dispatchEvent(event);
                  }}
                  className={`relative w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                    isTransparent
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  }`}
                  aria-label="Savat"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[0.6rem] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Hamburger Menu */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`xl:hidden w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ml-0.5 ${
                    isTransparent
                      ? 'text-white hover:bg-white/10'
                      : 'text-text-primary hover:bg-bg-secondary'
                  }`}
                  aria-label="Menyu"
                >
                  <Menu className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <div className={`fixed inset-0 z-[60] transition-all duration-300 ${isMobileSearchOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileSearchOpen(false)}
        />
        <div className={`fixed top-0 left-0 right-0 bg-white shadow-2xl p-4 transition-transform duration-300 ${isMobileSearchOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Mahsulot kodini yoki nomini qidiring..."
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-bg-secondary text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:bg-bg-secondary transition-all"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Spacer */}
      {pathname !== '/' && <div className="h-[66px] md:h-[74px]" />}
    </>
  );
}
