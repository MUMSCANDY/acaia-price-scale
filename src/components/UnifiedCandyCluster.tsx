import { cn } from "@/lib/utils";
import { PriceTier } from "@/lib/humorMessages";
import { useEffect, useState, useRef } from "react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

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
        "inline-block origin-center transition-[filter] duration-150",
        getAnimationClass()
      )}
      style={{ 
        animationDelay: isSpinning ? `${index * 30}ms` : `${index * 150}ms`,
        filter: isSpinning ? 'blur(2px)' : 'blur(0px)',
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

  // Animated counters - smooth counting animation
  const animatedWeight = useAnimatedCounter(weight, 1200);
  const animatedPrice = useAnimatedCounter(price, 1200);

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

  const weightChars = formatNumberToChars(animatedWeight);
  const priceChars = formatNumberToChars(animatedPrice);

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
        "text-center transition-transform duration-300",
        stablePulse && "animate-stable-pulse"
      )}>
        <div 
          className="font-display font-extrabold text-foreground leading-[0.8] tracking-[0.05em] py-2"
          style={{ fontSize: 'clamp(100px, 22vw, 220px)' }}
        >
          {weightChars.map((char, i) => (
            <SlotDigit key={`w-${i}-${weightChars.join('')}`} digit={char} index={i} isStable={isStable} />
          ))}
        </div>
        <div className="text-foreground/85 font-label text-sm tracking-[0.15em] mt-1">
          grams of sweetness
        </div>
      </div>

      {/* Spacer - Reduced */}
      <div className="my-3" />

      {/* Price - Secondary but still bold */}
      <div className="text-center transition-all duration-300">
        <div 
          className="font-display font-extrabold text-foreground leading-[0.85] tracking-[0.04em] py-1"
          style={{ fontSize: 'clamp(60px, 14vw, 140px)' }}
        >
          {currencySymbol}
          {priceChars.map((char, i) => (
            <SlotDigit key={`p-${i}-${priceChars.join('')}`} digit={char} index={i} isStable={isStable} />
          ))}
        </div>
        <div className="text-foreground/85 font-label text-sm tracking-[0.15em] mt-1">
          {currencySymbol}{pricePerHundred.toLocaleString()} per 100 grams
        </div>
      </div>
    </div>
  );
};