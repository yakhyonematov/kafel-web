'use client';

import { useEffect } from 'react';

let lockCount = 0;
let savedScrollY = 0;

/**
 * Locks page scroll while `isLocked` is true — fixes the body in place so
 * overlays (drawers/menus) don't leave the background scrollable behind them
 * on mobile. Reference-counted so nested or sequential overlays (e.g. cart
 * drawer opened from within another sheet) don't unlock each other prematurely.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [isLocked]);
}
