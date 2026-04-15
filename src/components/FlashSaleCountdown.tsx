"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface FlashSaleCountdownProps {
  salePrice: number;
  originalPrice: number;
  saleEndsAt: string;
  saleStartsAt?: string | null;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function FlashSaleCountdown({
  salePrice,
  originalPrice,
  saleEndsAt,
  saleStartsAt,
}: FlashSaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function calc() {
      const now = Date.now();
      const end = new Date(saleEndsAt).getTime();
      const diff = end - now;
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [saleEndsAt]);

  if (expired) return null;

  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  return (
    <div className="rounded-lg overflow-hidden border border-red-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Zap size={16} className="text-yellow-300 fill-yellow-300" />
          <span className="text-white font-bold text-sm sm:text-base uppercase tracking-wide">Flash Sale</span>
          {discount > 0 && (
            <span className="bg-yellow-400 text-red-700 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-1">
          <span className="text-white/70 text-[10px] sm:text-xs hidden sm:inline">Kết thúc sau</span>
          <div className="flex items-center gap-0.5">
            {timeLeft.days > 0 && (
              <>
                <TimeBox value={timeLeft.days} label="N" />
                <span className="text-white/50 text-xs font-bold">:</span>
              </>
            )}
            <TimeBox value={timeLeft.hours} />
            <span className="text-white/50 text-xs font-bold">:</span>
            <TimeBox value={timeLeft.minutes} />
            <span className="text-white/50 text-xs font-bold">:</span>
            <TimeBox value={timeLeft.seconds} />
          </div>
        </div>
      </div>

      {/* Price comparison */}
      <div className="bg-red-50 px-3 sm:px-4 py-2.5 flex items-center gap-3 flex-wrap">
        <span className="text-lg sm:text-xl font-bold text-red-600">{formatPrice(salePrice)}</span>
        <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
        <span className="text-xs text-gray-400">
          Tiết kiệm <span className="text-red-600 font-semibold">{formatPrice(originalPrice - salePrice)}</span>
        </span>
      </div>
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label?: string }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] bg-white/20 rounded text-white text-xs sm:text-sm font-bold tabular-nums px-1">
      {pad(value)}{label && <span className="text-[9px] font-normal ml-0.5">{label}</span>}
    </span>
  );
}
