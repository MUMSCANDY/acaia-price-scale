import { cn } from "@/lib/utils";
import { PriceTier } from "@/lib/humorMessages";
import { useEffect, useState, useRef } from "react";

interface UnifiedCandyClusterProps {
  weight: number;
  price: number;
  currencySymbol: string;
  pricePerHundred: number;
  tier: PriceTier;
  fillPercent: number;
  isStable: boolean;
  maxWeight?: number;
  className?: string;
}

export const UnifiedCandyCluster = ({
  weight,
  price,
  currencySymbol,
  pricePerHundred,
  tier,
  fillPercent,
  isStable,
  maxWeight = 1500,
  className
}: UnifiedCandyClusterProps) => {
  const [displayPercent, setDisplayPercent] = useState(0);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const prevPriceRef = useRef(price);

  // Animate gauge fill
  useEffect(() => {
    const targetPercent = Math.min((weight / maxWeight) * 100, 100);
    const duration = 600;
    const start = displayPercent;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (targetPercent - start) * easeOut;
      setDisplayPercent(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [weight, maxWeight]);

  // Price animation trigger
  useEffect(() => {
    if (price !== prevPriceRef.current && price > 0) {
      setPriceAnimating(true);
      setTimeout(() => setPriceAnimating(false), 400);
    }
    prevPriceRef.current = price;
  }, [price]);

  // Gauge calculations - brutal thick ring
  const radius = 100;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (displayPercent / 100) * circumference;

  // Calculate fill height for bucket
  const fillHeight = (fillPercent / 100) * 50;

  return (
    <div className={cn("relative flex items-center justify-center gap-10", className)}>
      
      {/* LEFT: Abstract Tub - No face, premium minimal */}
      <div className="relative">
        <svg viewBox="0 0 100 120" className="w-40 h-auto" style={{ filter: 'drop-shadow(var(--shadow-medium))' }}>
          {/* Dark candy fill gradient */}
          <defs>
            <linearGradient id="candyFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="black" stopOpacity="0.15" />
              <stop offset="100%" stopColor="black" stopOpacity="0.35" />
            </linearGradient>
            <clipPath id="tubClip">
              <path d="M 15 35 Q 10 35 10 42 L 14 100 Q 14 108 22 108 L 78 108 Q 86 108 86 100 L 90 42 Q 90 35 85 35 Z" />
            </clipPath>
          </defs>
          
          {/* Candy fill inside tub */}
          <rect 
            x="10" 
            y={108 - fillHeight} 
            width="80" 
            height={fillHeight}
            fill="url(#candyFill)"
            clipPath="url(#tubClip)"
            className="transition-all duration-700 ease-out"
          />
          
          {/* Tub body - thick black outline, hyper-rounded */}
          <path 
            d="M 15 35 Q 10 35 10 42 L 14 100 Q 14 108 22 108 L 78 108 Q 86 108 86 100 L 90 42 Q 90 35 85 35"
            fill="none"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Tub rim - flat top */}
          <path 
            d="M 15 35 L 85 35"
            fill="none"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Subtle rim highlight */}
          <path 
            d="M 20 35 L 80 35"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* CENTER: Weight Gauge - Brutal minimalism with precise micro-dots */}
      <div className="relative">
        <svg viewBox="0 0 260 260" className="w-64 h-64">
          {/* Background track - thick */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeOpacity="0.1"
            strokeLinecap="round"
          />
          
          {/* Progress arc - bold black */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="black"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            transform="rotate(-90 130 130)"
            className="transition-all duration-500 ease-out"
          />
          
          {/* Precise micro-dots - 12 markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const outerR = radius + 20;
            const x = 130 + outerR * Math.cos(rad);
            const y = 130 + outerR * Math.sin(rad);
            const isActive = (i / 12) * 100 <= displayPercent;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3}
                fill="black"
                opacity={isActive ? 0.8 : 0.15}
                className="transition-opacity duration-300"
              />
            );
          })}
          
          {/* Stable indicator glow */}
          {isStable && weight > 0 && (
            <circle
              cx="130"
              cy="130"
              r={radius + 30}
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeOpacity="0.1"
              className="animate-stable-pulse"
            />
          )}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-display text-7xl leading-none tabular-nums tracking-tight">
            {weight.toFixed(0)}
          </div>
          <div className="text-label text-base mt-1 opacity-40 tracking-widest uppercase">
            grams
          </div>
        </div>
      </div>

      {/* RIGHT: Price Card - Hyper-rounded, floating */}
      <div className={cn(
        "relative transition-transform duration-300",
        priceAnimating && "animate-price-pop"
      )}>
        <div className="futureplay-card px-10 py-8 min-w-[200px]">
          <div className="text-center">
            <span className="text-micro text-xs opacity-40 tracking-[0.15em] uppercase">Total</span>
          </div>
          
          <div className="text-display text-5xl leading-none tabular-nums text-center mt-2">
            {currencySymbol}{price}
          </div>
          
          <div className="mt-5 pt-4 border-t-2 border-foreground/10">
            <div className="text-center">
              <span className="text-micro text-sm opacity-40">
                {currencySymbol}{pricePerHundred} per 100g
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};