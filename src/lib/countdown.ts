"use client";

import { useSyncExternalStore, useMemo } from "react";

/** Shared 1-second timer — all countdown consumers share a single setInterval */

let now = Date.now();
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function startTimer() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    now = Date.now();
    for (const fn of listeners) fn();
  }, 1000);
}

function stopTimer() {
  if (intervalId && listeners.size === 0) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  startTimer();
  return () => {
    listeners.delete(listener);
    stopTimer();
  };
}

function getSnapshot() {
  return now;
}

function getServerSnapshot() {
  return Date.now();
}

/** Returns the current timestamp, updated every second. Shared across all consumers. */
export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Format a countdown from now to target date */
export function formatCountdown(targetMs: number, now: number): string {
  const diff = targetMs - now;
  if (diff <= 0) return "";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return d > 0 ? `${d}N ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Returns { d, h, m, s } countdown to target date */
export function useCountdownTo(endDate?: string): { d: number; h: number; m: number; s: number } {
  const now = useNow();
  const targetMs = useMemo(() => {
    if (endDate) {
      const d = new Date(endDate);
      if (!isNaN(d.getTime())) return d.getTime();
    }
    // Fallback: end of current week (Sunday 23:59:59)
    const n = new Date();
    const end = new Date(n);
    end.setDate(n.getDate() + (7 - n.getDay()));
    end.setHours(23, 59, 59, 999);
    return end.getTime();
  }, [endDate]);

  return useMemo(() => {
    const diff = Math.max(0, targetMs - now);
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  }, [targetMs, now]);
}
