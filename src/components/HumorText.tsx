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
  const [shouldBounce, setShouldBounce] = useState(false);
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
        setShouldBounce(true);
        setTimeout(() => setShouldBounce(false), 500);
      }, 250);
    }
    
    prevTierRef.current = tier;
    prevPriceRef.current = price;
  }, [tier, price]);

  // Don't show message if no weight
  if (price === 0) {
    return (
      <div className={cn("text-center h-16 flex items-center justify-center", className)}>
        <p className="text-2xl text-foreground/50 font-display font-bold">
          Add some candy to get started!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("text-center h-16 flex items-center justify-center", className)}>
      <p 
        className={cn(
          "text-2xl md:text-3xl font-display font-bold text-foreground max-w-2xl transition-all duration-300",
          isAnimating 
            ? "opacity-0 transform translate-y-4" 
            : "opacity-100 transform translate-y-0",
          shouldBounce && "animate-humor-bounce"
        )}
      >
        {message}
      </p>
    </div>
  );
};
