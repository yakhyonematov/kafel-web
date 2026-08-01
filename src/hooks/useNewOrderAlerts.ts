'use client';

import { useEffect, useRef, useState } from 'react';
import { orderService } from '../services/order.service';

const POLL_INTERVAL_MS = 8000;

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.65);
  } catch (e) {
    console.error('Beep playback failed', e);
  }
}

function announceNewOrder(count: number) {
  // A short tone always plays as a reliable baseline notification...
  playBeep();
  // ...and where the browser supports it, an actual spoken phrase on top of it.
  try {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const phrase =
      count > 1
        ? `Diqqat! ${count} ta yangi buyurtma qabul qilindi!`
        : 'Diqqat! Yangi buyurtma qabul qilindi!';
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.95;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Speech synthesis failed', e);
  }
}

/**
 * Polls for NEW orders while `enabled`. Plays a sound + spoken alert only for
 * orders that appear after the first poll (so re-opening the panel with old
 * pending orders doesn't re-announce them every time), and exposes a live
 * pending count for a nav badge.
 */
export function useNewOrderAlerts(enabled: boolean) {
  const [pendingCount, setPendingCount] = useState(0);
  const [latestOrderName, setLatestOrderName] = useState<string | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    let stopped = false;

    async function poll() {
      try {
        const newOrders = await orderService.getOrders('NEW');
        if (stopped) return;
        setPendingCount(newOrders.length);

        if (!initializedRef.current) {
          newOrders.forEach((o) => seenIdsRef.current.add(o.id));
          initializedRef.current = true;
          return;
        }

        const freshOnes = newOrders.filter((o) => !seenIdsRef.current.has(o.id));
        if (freshOnes.length > 0) {
          freshOnes.forEach((o) => seenIdsRef.current.add(o.id));
          setLatestOrderName(freshOnes[0].customerName);
          announceNewOrder(freshOnes.length);
          setTimeout(() => setLatestOrderName(null), 6000);
        }
      } catch (err) {
        console.error('Failed to poll for new orders', err);
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [enabled]);

  return { pendingCount, latestOrderName };
}
