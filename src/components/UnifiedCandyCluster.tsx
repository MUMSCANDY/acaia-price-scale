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
const SlotDigit = ({ digit, isAnimating }: { digit: string; isAnimating: boolean }) => {
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (digit !== displayDigit) {
      setAnimationClass("animate-slot-out");
      
      const timeout = setTimeout(() => {
        setDisplayDigit(digit);
        setAnimationClass("animate-slot-in");
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [digit, displayDigit]);

  return (
    <span className={cn("inline-block", animationClass)}>
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
  const [priceAnimating, setPriceAnimating] = useState(false);
  const [weightAnimating, setWeightAnimating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [stablePulse, setStablePulse] = useState(false);
  const prevPriceRef = useRef(price);
  const prevWeightRef = useRef(weight);
  const prevStableRef = useRef(isStable);

  // Weight animation trigger
  useEffect(() => {
    if (weight !== prevWeightRef.current) {
      setWeightAnimating(true);
      setTimeout(() => setWeightAnimating(false), 500);
    }
    prevWeightRef.current = weight;
  }, [weight]);

  // Price animation trigger
  useEffect(() => {
    if (price !== prevPriceRef.current && price > 0) {
      setPriceAnimating(true);
      setTimeout(() => setPriceAnimating(false), 400);
    }
    prevPriceRef.current = price;
  }, [price]);

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
            <SlotDigit key={`w-${i}-${char}`} digit={char} isAnimating={weightAnimating} />
          ))}
        </div>
        <div className={cn(
          "text-foreground/40 font-label text-xl uppercase tracking-[0.5em] mt-4",
          isStable && weight > 0 && "animate-label-fade"
        )} style={{ opacity: isStable && weight > 0 ? undefined : 0.4 }}>
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
      <div className={cn(
        "text-center transition-all duration-300",
        priceAnimating && "animate-price-pop animate-glow"
      )}>
        <div 
          className="font-display font-extrabold text-foreground leading-[0.9] tracking-tight overflow-hidden"
          style={{ fontSize: 'clamp(80px, 18vw, 180px)' }}
        >
          {currencySymbol}
          {priceChars.map((char, i) => (
            <SlotDigit key={`p-${i}-${char}`} digit={char} isAnimating={priceAnimating} />
          ))}
        </div>
        <div className="text-foreground/30 font-label text-base tracking-[0.2em] mt-3">
          {currencySymbol}{pricePerHundred.toLocaleString()} per 100 grams
        </div>
      </div>
    </div>
  );
};
