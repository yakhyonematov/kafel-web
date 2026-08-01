'use client';

import React, { useEffect, useRef, useState } from 'react';
import '@photo-sphere-viewer/core/index.css';
import { Loader2, ImageOff } from 'lucide-react';

interface PanoramaViewerProps {
  /** Path to an equirectangular (360°) panorama image, e.g. '/panorama/showroom.jpg'. */
  src: string;
  className?: string;
}

export default function PanoramaViewer({ src, className = '' }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let viewer: import('@photo-sphere-viewer/core').Viewer | null = null;
    let cancelled = false;

    setStatus('loading');

    (async () => {
      const { Viewer } = await import('@photo-sphere-viewer/core');
      if (cancelled || !containerRef.current) return;

      viewer = new Viewer({
        container: containerRef.current,
        panorama: src,
        defaultZoomLvl: 0,
        navbar: ['zoom', 'move', 'caption', 'fullscreen'],
        loadingTxt: '',
      });

      viewer.addEventListener('ready', () => !cancelled && setStatus('ready'));
      viewer.addEventListener('panorama-error', () => !cancelled && setStatus('error'));
    })();

    return () => {
      cancelled = true;
      viewer?.destroy();
    };
  }, [src]);

  return (
    <div className={`relative w-full h-full bg-bg-dark rounded-xl overflow-hidden ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />

      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70 bg-bg-dark pointer-events-none">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-xs uppercase tracking-widest">Yuklanmoqda...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70 bg-bg-dark px-6 text-center">
          <ImageOff className="w-6 h-6" />
          <span className="text-xs">360° surat hali yuklanmagan</span>
        </div>
      )}
    </div>
  );
}
