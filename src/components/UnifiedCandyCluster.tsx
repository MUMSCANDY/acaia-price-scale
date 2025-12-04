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
  const [priceAnimating, setPriceAnimating] = useState(false);
  const prevPriceRef = useRef(price);

  // Price animation trigger
  useEffect(() => {
    if (price !== prevPriceRef.current && price > 0) {
      setPriceAnimating(true);
      setTimeout(() => setPriceAnimating(false), 400);
    }
    prevPriceRef.current = price;
  }, [price]);

  // Format number with thousand separators
  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString();
  };

  return (
    <div className={cn("flex flex-col items-center justify-center w-full", className)}>
      
      {/* Weight - Massive brutalist display */}
      <div className="text-center">
        <div 
          className="font-display font-extrabold text-foreground leading-[0.85] tracking-tighter"
          style={{ fontSize: 'clamp(140px, 25vw, 240px)' }}
        >
          {formatNumber(weight)}
        </div>
        <div className="text-foreground/40 font-label text-xl uppercase tracking-[0.4em] -mt-2">
          grams
        </div>
      </div>

      {/* Divider - Minimal line */}
      <div className="w-20 h-[3px] bg-foreground/15 rounded-full my-6" />

      {/* Price - Large secondary */}
      <div className={cn(
        "text-center transition-transform duration-300",
        priceAnimating && "animate-price-pop"
      )}>
        <div 
          className="font-display font-extrabold text-foreground leading-[0.9] tracking-tight"
          style={{ fontSize: 'clamp(90px, 16vw, 160px)' }}
        >
          {currencySymbol}{formatNumber(price)}
        </div>
        <div className="text-foreground/35 font-label text-base uppercase tracking-[0.25em] mt-1">
          {currencySymbol}{formatNumber(pricePerHundred)} / 100g
        </div>
      </div>

      {/* Stable indicator - Minimal pill */}
      {isStable && weight > 0 && (
        <div className="mt-8 px-8 py-3 bg-foreground text-background font-label text-sm uppercase tracking-[0.2em] rounded-full animate-scale-in shadow-soft">
          Ready
        </div>
      )}
    </div>
  );
};
