'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function TopLoader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Complete progress whenever pathname changes
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Global click listener to start loader immediately when internal links are clicked
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }

      if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        const targetAttr = target.getAttribute('target');

        // Check if internal route navigation (must start with '/' and not be external link)
        if (href && href.startsWith('/') && !href.startsWith('//') && targetAttr !== '_blank') {
          // Check if it's the current page hash link, if so don't run
          const currentUrl = new URL(window.location.href);
          if (href === currentUrl.pathname + currentUrl.search + currentUrl.hash) {
            return;
          }

          setVisible(true);
          setProgress(15);
          
          const interval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) {
                clearInterval(interval);
                return 90;
              }
              // Increments slowly as it gets closer to 90%
              return prev + (90 - prev) * 0.15;
            });
          }, 150);

          (window as any)._loaderInterval = interval;
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
      if ((window as any)._loaderInterval) {
        clearInterval((window as any)._loaderInterval);
      }
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div 
        className="h-[3px] bg-accent transition-all duration-300 ease-out shadow-[0_0_8px_rgba(197,17,46,0.5)]" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}
