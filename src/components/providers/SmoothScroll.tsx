'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Watch for size changes in document body to update Lenis scroll dimensions
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    
    if (document.body) {
      resizeObserver.observe(document.body);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      if ((window as any).__lenis === lenis) {
        (window as any).__lenis = null;
      }
    };
  }, []);

  // Force resize on pathname changes to ensure correct scroll height after navigation
  useEffect(() => {
    if (lenisRef.current) {
      // Small timeout to allow Next.js DOM render to complete
      setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.resize();
          lenisRef.current.scrollTo(0, { immediate: true });
        }
      }, 80);
    }
  }, [pathname]);

  return <>{children}</>;
}
