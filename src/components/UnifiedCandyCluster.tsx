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

// Slot machine digit component
const SlotDigit = ({ digit, index, isStable }: { digit: string; index: number; isStable: boolean }) => {
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [isSpinning, setIsSpinning] = useState(false);
  const prevDigitRef = useRef(digit);

  useEffect(() => {
    if (digit !== prevDigitRef.current) {
      setIsSpinning(true);
      
      // Swap digit after brief delay
      const swapTimeout = setTimeout(() => {
        setDisplayDigit(digit);
      }, 100);
      
      // End spin animation
      const resetTimeout = setTimeout(() => {
        setIsSpinning(false);
      }, 450);
      
      prevDigitRef.current = digit;
      
      return () => {
        clearTimeout(swapTimeout);
        clearTimeout(resetTimeout);
      };
    }
  }, [digit]);

  // Determine animation class
  const getAnimationClass = () => {
    if (isSpinning) return "digit-slot-spin";
    if (isStable) return "digit-stable";
    return "digit-idle";
  };

  return (
    <span 
      className={cn(
        "inline-block origin-center",
        getAnimationClass()
      )}
      style={{ 
        animationDelay: isSpinning ? `${index * 30}ms` : `${index * 150}ms`,
      }}
    >
      {displayDigit}
    </span>
  );
};

// Format number with commas and return as array of characters
const formatNumberToChars = (num: number): string[] => {
  return Math.round(num).toLocaleString().split('');
};

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
  const [showSparkles, setShowSparkles] = useState(false);
  const [stablePulse, setStablePulse] = useState(false);
  const prevStableRef = useRef(isStable);

  // Stable pulse and sparkle trigger
  useEffect(() => {
    if (isStable && !prevStableRef.current && weight > 0) {
      setStablePulse(true);
      setShowSparkles(true);
      setTimeout(() => {
        setStablePulse(false);
        setShowSparkles(false);
      }, 800);
    }
    prevStableRef.current = isStable;
  }, [isStable, weight]);

  const weightChars = formatNumberToChars(weight);
  const priceChars = formatNumberToChars(price);

  return (
    <div className={cn("flex flex-col items-center justify-center w-full relative", className)}>
      
      {/* Pixel Sparkles - show on stabilization */}
      {showSparkles && (
        <>
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-foreground/30 animate-sparkle" style={{ animationDelay: '0ms' }} />
          <div className="absolute top-10 right-1/4 w-1.5 h-1.5 bg-foreground/25 animate-sparkle" style={{ animationDelay: '100ms' }} />
          <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-foreground/20 animate-sparkle" style={{ animationDelay: '200ms' }} />
          <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-foreground/30 animate-sparkle" style={{ animationDelay: '150ms' }} />
        </>
      )}

      {/* Weight - Massive billboard display with slot animation */}
      <div className={cn(
        "text-center pixel-underline transition-transform duration-300",
        stablePulse && "animate-stable-pulse"
      )}>
        <div 
          className="font-display font-extrabold text-foreground leading-[0.85] tracking-tighter overflow-hidden"
          style={{ fontSize: 'clamp(140px, 28vw, 280px)' }}
        >
          {weightChars.map((char, i) => (
            <SlotDigit key={`w-${i}-${weightChars.join('')}`} digit={char} index={i} isStable={isStable} />
          ))}
        </div>
        <div className={cn(
          "text-foreground/85 font-label text-xl uppercase tracking-[0.5em] mt-4",
          isStable && weight > 0 && "animate-label-fade"
        )} style={{ opacity: isStable && weight > 0 ? undefined : 0.85 }}>
          grams
        </div>
      </div>

      {/* Pixel Dots Divider */}
      <div className="pixel-dots my-8">
        <div className="pixel-dot" />
        <div className="pixel-dot" />
        <div className="pixel-dot" />
        <div className="pixel-dot" />
        <div className="pixel-dot" />
      </div>

      {/* Price - Secondary but still bold */}
      <div className="text-center transition-all duration-300">
        <div 
          className="font-display font-extrabold text-foreground leading-[0.9] tracking-tight overflow-hidden"
          style={{ fontSize: 'clamp(80px, 18vw, 180px)' }}
        >
          {currencySymbol}
          {priceChars.map((char, i) => (
            <SlotDigit key={`p-${i}-${priceChars.join('')}`} digit={char} index={i} isStable={isStable} />
          ))}
        </div>
        <div className="text-foreground/85 font-label text-base tracking-[0.2em] mt-3">
          {currencySymbol}{pricePerHundred.toLocaleString()} per 100 grams
        </div>
      </div>
    </div>
  );
};