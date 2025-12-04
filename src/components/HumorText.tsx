import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { PriceTier, getRandomMessage } from "@/lib/humorMessages";

interface HumorTextProps {
  tier: PriceTier;
  price: number;
  className?: string;
}

export const HumorText = ({ tier, price, className }: HumorTextProps) => {
  const [message, setMessage] = useState(() => getRandomMessage(tier));
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTierRef = useRef(tier);
  const prevPriceRef = useRef(price);

  useEffect(() => {
    const tierChanged = prevTierRef.current !== tier;
    const significantPriceJump = Math.abs(price - prevPriceRef.current) > 50;
    
    if (tierChanged || (significantPriceJump && price > 0)) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setMessage(getRandomMessage(tier));
        setIsAnimating(false);
      }, 200);
    }
    
    prevTierRef.current = tier;
    prevPriceRef.current = price;
  }, [tier, price]);

  // Don't show message if no weight
  if (price === 0) {
    return (
      <div className={cn("text-center h-12 flex items-center justify-center", className)}>
        <p className="text-label text-lg opacity-40">
          Add some candy to get started
        </p>
      </div>
    );
  }

  return (
    <div className={cn("text-center h-12 flex items-center justify-center", className)}>
      <p 
        className={cn(
          "text-label text-lg opacity-50 tracking-wide transition-opacity duration-200",
          isAnimating ? "opacity-0" : "opacity-50"
        )}
      >
        {message}
      </p>
    </div>
  );
};