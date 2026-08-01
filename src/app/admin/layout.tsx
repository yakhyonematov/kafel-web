'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Factory, Image, LogOut, Menu, X, User as UserIcon, Users, ClipboardList, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ADMIN_NAVIGATION_LINKS } from '../../constants/navigation';
import { useNewOrderAlerts } from '../../hooks/useNewOrderAlerts';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after mounting to prevent SSR hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLoginPage = pathname === '/admin/login';

  // Auth Protection Check
  useEffect(() => {
    if (isClient && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isClient, isAuthenticated, isLoginPage, router]);

  // Poll for new orders across every admin page (hook itself no-ops while disabled)
  const { pendingCount, latestOrderName } = useNewOrderAlerts(isClient && isAuthenticated && !isLoginPage);

  // Handle logout
  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  // Prevent flashing of protected layout before hydration check
  if (!isClient) {
    return <div className="min-h-screen bg-bg-secondary flex items-center justify-center text-xs">Yuklanmoqda...</div>;
  }

  // If login page, don't show admin sidebar/header layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated, render loading screen until redirected
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-bg-secondary flex items-center justify-center text-xs">Tekshirilmoqda...</div>;
  }

  // Nav icons selector mapping
  const getNavIcon = (label: string) => {
    if (label === 'Dashboard') return <LayoutDashboard className="w-4 h-4" />;
    if (label === 'Buyurtmalar') return <ClipboardList className="w-4 h-4" />;
    if (label === 'Mahsulotlar') return <ShoppingBag className="w-4 h-4" />;
    if (label === 'Zavodlar') return <Factory className="w-4 h-4" />;
    if (label === 'Galereya') return <Image className="w-4 h-4" />;
    if (label === 'Xodimlar') return <Users className="w-4 h-4" />;
    return <LayoutDashboard className="w-4 h-4" />;
  };

  // Only ADMIN role may manage other admins/managers — backend enforces this too
  const visibleNavLinks = ADMIN_NAVIGATION_LINKS.filter(
    (link) => link.label !== 'Xodimlar' || user?.role === 'ADMIN'
  );

  return (
    <div className="min-h-screen flex bg-bg-secondary text-text-primary">
      {/* New order toast — appears on any admin page when a fresh order is detected */}
      {latestOrderName && (
        <div className="fixed top-4 right-4 z-[100] bg-white border border-accent shadow-2xl rounded-xl p-4 flex items-center gap-3 animate-fade-in max-w-xs">
          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-text-primary">Yangi buyurtma qabul qilindi!</p>
            <p className="text-xs text-text-secondary truncate">{latestOrderName} tomonidan buyurtma berildi.</p>
          </div>
        </div>
      )}

      {/* 1. Sidebar Navigation (Desktop) */}
      <aside className="w-[240px] bg-primary-dark text-text-inverse/80 flex flex-col justify-between shrink-0 border-r border-white/5 hidden md:flex sticky top-0 h-screen">
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white mb-8">
            <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <span className="font-bold text-sm tracking-tight uppercase">VODIY KAFEL</span>
          </Link>

          {/* Menu links */}
          <nav className="flex flex-col gap-1">
            {visibleNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/10'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {getNavIcon(link.label)}
                  <span>{link.label}</span>
                  {link.label === 'Buyurtmalar' && pendingCount > 0 && (
                    <span className="ml-auto bg-error text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar / Logout */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-accent">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-text-inverse/45 uppercase tracking-wider">{user?.role || 'ADMIN'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 h-10 border border-white/15 hover:bg-error hover:border-error hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Panel Drawer */}
      <div className={`fixed inset-0 z-50 md:hidden flex transition-all duration-300 ${sidebarOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`relative w-[250px] bg-primary-dark text-text-inverse/80 flex flex-col justify-between p-6 overflow-y-auto h-full transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 text-white">
                <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
                <span className="font-bold text-xs uppercase">VODIY KAFEL</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-text-inverse/60 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              {visibleNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive ? 'bg-accent text-white shadow-md' : 'hover:bg-white/5'
                    }`}
                  >
                    {getNavIcon(link.label)}
                    <span>{link.label}</span>
                    {link.label === 'Buyurtmalar' && pendingCount > 0 && (
                      <span className="ml-auto bg-error text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/5 pt-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-accent">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">{user?.name}</p>
                <p className="text-[10px] text-text-inverse/45 uppercase">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 h-10 border border-white/15 hover:bg-error hover:border-error hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </aside>
      </div>

      {/* 2. Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header / Top Header */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-bg-secondary md:hidden text-text-primary"
              aria-label="Menyu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-sm sm:text-base text-text-primary">
              {ADMIN_NAVIGATION_LINKS.find((link) => pathname === link.href)?.label || 'Boshqaruv'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-text-secondary hidden sm:inline">
              Salom, {user?.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-accent-light/10 text-accent flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-bg-secondary/40">
          {children}
        </main>
      </div>
    </div>
  );
}
