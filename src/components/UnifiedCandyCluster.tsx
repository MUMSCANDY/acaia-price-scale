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

  // Animate gauge fill with spring physics
  useEffect(() => {
    const targetPercent = Math.min((weight / maxWeight) * 100, 100);
    const duration = 800;
    const start = displayPercent;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Spring easing
      const easeOut = 1 - Math.pow(1 - progress, 4);
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
      setTimeout(() => setPriceAnimating(false), 500);
    }
    prevPriceRef.current = price;
  }, [price]);

  // Gauge calculations
  const radius = 110;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (displayPercent / 100) * circumference;

  // Get character expression based on tier
  const getCharacterFace = () => {
    switch (tier) {
      case 'tiny':
        return (
          <>
            {/* Eyes - slightly worried */}
            <circle cx="35" cy="52" r="4" className="fill-foreground" />
            <circle cx="55" cy="52" r="4" className="fill-foreground" />
            <circle cx="36" cy="51" r="1.5" className="fill-background" />
            <circle cx="56" cy="51" r="1.5" className="fill-background" />
            {/* Slight frown */}
            <path d="M 38 64 Q 45 61 52 64" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-foreground" />
          </>
        );
      case 'nice':
        return (
          <>
            {/* Happy eyes */}
            <circle cx="35" cy="52" r="4.5" className="fill-foreground" />
            <circle cx="55" cy="52" r="4.5" className="fill-foreground" />
            <circle cx="36.5" cy="51" r="1.5" className="fill-background" />
            <circle cx="56.5" cy="51" r="1.5" className="fill-background" />
            {/* Blush */}
            <ellipse cx="28" cy="58" rx="5" ry="3" className="fill-foreground/10" />
            <ellipse cx="62" cy="58" rx="5" ry="3" className="fill-foreground/10" />
            {/* Happy smile */}
            <path d="M 36 63 Q 45 72 54 63" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-foreground" />
          </>
        );
      case 'hype':
        return (
          <>
            {/* Excited star eyes */}
            <g className="animate-sparkle">
              <path d="M 35 52 L 36.5 55 L 40 55.5 L 37.5 58 L 38 62 L 35 60 L 32 62 L 32.5 58 L 30 55.5 L 33.5 55 Z" className="fill-foreground" />
              <path d="M 55 52 L 56.5 55 L 60 55.5 L 57.5 58 L 58 62 L 55 60 L 52 62 L 52.5 58 L 50 55.5 L 53.5 55 Z" className="fill-foreground" />
            </g>
            {/* Big open smile */}
            <path d="M 34 64 Q 45 78 56 64" stroke="currentColor" strokeWidth="3" fill="hsl(var(--background))" strokeLinecap="round" className="text-foreground" />
          </>
        );
      case 'legendary':
        return (
          <>
            {/* Heart eyes */}
            <g className="animate-pulse">
              <path d="M 31 50 C 31 46 34 46 35 49 C 36 46 39 46 39 50 C 39 54 35 58 35 58 C 35 58 31 54 31 50" className="fill-foreground" />
              <path d="M 51 50 C 51 46 54 46 55 49 C 56 46 59 46 59 50 C 59 54 55 58 55 58 C 55 58 51 54 51 50" className="fill-foreground" />
            </g>
            {/* Ecstatic smile */}
            <path d="M 32 64 Q 45 82 58 64" stroke="currentColor" strokeWidth="3" fill="hsl(var(--background))" strokeLinecap="round" className="text-foreground" />
            {/* Sparkle crown */}
            <g className="animate-bounce-slow">
              <circle cx="45" cy="28" r="3" className="fill-foreground/60" />
              <circle cx="35" cy="32" r="2" className="fill-foreground/40" />
              <circle cx="55" cy="32" r="2" className="fill-foreground/40" />
            </g>
          </>
        );
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center gap-8", className)}>
      {/* LEFT: Premium Character */}
      <div className={cn(
        "relative transition-all duration-700 ease-out",
        tier === 'nice' && "animate-float-gentle",
        tier === 'hype' && "animate-bucket-bounce",
        tier === 'legendary' && "animate-bucket-wiggle"
      )}>
        <svg viewBox="0 0 90 100" className="w-44 h-auto drop-shadow-lg">
          {/* Character body - soft blob shape with gradient feel */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.15" />
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Soft body shape */}
          <ellipse 
            cx="45" 
            cy="58" 
            rx="38" 
            ry="36" 
            fill="url(#bodyGradient)"
            className="transition-all duration-500"
          />
          
          {/* Body outline - soft and rounded */}
          <ellipse 
            cx="45" 
            cy="58" 
            rx="38" 
            ry="36" 
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />
          
          {/* Inner highlight for depth */}
          <ellipse 
            cx="45" 
            cy="48" 
            rx="28" 
            ry="20" 
            fill="hsl(var(--background))"
            fillOpacity="0.3"
          />
          
          {/* Face */}
          <g filter={tier === 'legendary' ? 'url(#softGlow)' : undefined}>
            {getCharacterFace()}
          </g>
          
          {/* Floating elements for high tiers */}
          {(tier === 'hype' || tier === 'legendary') && (
            <g className="animate-float-gentle">
              <circle cx="82" cy="40" r="4" className="fill-foreground/20" />
              <circle cx="8" cy="45" r="3" className="fill-foreground/15" />
            </g>
          )}
          
          {tier === 'legendary' && (
            <>
              <g className="animate-float-hearts">
                <path d="M 80 25 C 80 22 82 22 83 24 C 84 22 86 22 86 25 C 86 28 83 31 83 31 C 83 31 80 28 80 25" className="fill-foreground/40" />
              </g>
              <g className="animate-float-hearts" style={{ animationDelay: '0.5s' }}>
                <path d="M 4 30 C 4 28 6 28 7 29 C 8 28 10 28 10 30 C 10 32 7 34 7 34 C 7 34 4 32 4 30" className="fill-foreground/30" />
              </g>
            </>
          )}
        </svg>
      </div>

      {/* CENTER: Glass-morphism Gauge */}
      <div className="relative">
        {/* Outer ambient glow */}
        <div className={cn(
          "absolute inset-0 rounded-full transition-all duration-700",
          isStable && weight > 0 && "animate-stable-pulse"
        )} style={{
          background: 'radial-gradient(circle, hsl(var(--foreground) / 0.05) 0%, transparent 70%)',
          transform: 'scale(1.3)'
        }} />
        
        <svg viewBox="0 0 280 280" className="w-72 h-72">
          {/* Glass background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius + 20}
            fill="hsl(var(--foreground) / 0.03)"
            className="transition-all duration-500"
          />
          
          {/* Track ring */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="hsl(var(--foreground) / 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress ring with gradient effect */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="hsl(var(--foreground) / 0.6)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            transform="rotate(-90 140 140)"
            className="transition-all duration-500 ease-out"
          />
          
          {/* Soft glow on progress end */}
          {displayPercent > 0 && (
            <circle
              cx={140 + radius * Math.cos((displayPercent / 100 * 360 - 90) * Math.PI / 180)}
              cy={140 + radius * Math.sin((displayPercent / 100 * 360 - 90) * Math.PI / 180)}
              r={12}
              fill="hsl(var(--foreground) / 0.15)"
              className="transition-all duration-300"
            />
          )}
          
          {/* Minimal tick marks - every 25% */}
          {[0, 25, 50, 75].map((pct, i) => {
            const angle = (pct / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const outerR = radius + 18;
            const x = 140 + outerR * Math.cos(rad);
            const y = 140 + outerR * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={2.5}
                className="fill-foreground/20"
              />
            );
          })}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn(
            "text-numbers text-8xl leading-none tabular-nums font-extrabold tracking-tight transition-transform duration-300",
            priceAnimating && "animate-weight-pop"
          )}>
            {weight.toFixed(0)}
          </div>
          <div className="text-body text-lg mt-2 opacity-40 font-semibold tracking-widest uppercase">
            grams
          </div>
        </div>
      </div>

      {/* RIGHT: Elevated Price Card */}
      <div className={cn(
        "relative transition-all duration-500",
        priceAnimating && "animate-price-pop"
      )}>
        {/* Soft shadow layer */}
        <div className="absolute inset-0 rounded-3xl bg-foreground/5 blur-xl transform translate-y-2" />
        
        {/* Glass card */}
        <div className="relative glass-card rounded-3xl px-10 py-8 min-w-[220px]">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          
          <div className="text-center">
            <span className="text-body text-xs font-bold opacity-30 uppercase tracking-[0.2em]">Total</span>
          </div>
          
          <div className="text-numbers text-6xl leading-none tabular-nums text-center mt-2 font-extrabold">
            {currencySymbol}{price}
          </div>
          
          <div className="mt-6 pt-4 border-t border-foreground/10">
            <div className="text-center">
              <span className="text-body text-sm opacity-40 font-medium">
                {currencySymbol}{pricePerHundred} per 100g
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};