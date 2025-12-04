import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { PriceTier, getRandomMessage } from "@/lib/humorMessages";

interface HumorTextProps {
  tier: PriceTier;
  price: number;
  isStable?: boolean;
  className?: string;
}

export const HumorText = ({ tier, price, isStable, className }: HumorTextProps) => {
  const [message, setMessage] = useState(() => getRandomMessage(tier));
  const [isAnimating, setIsAnimating] = useState(false);
  const prevStableRef = useRef(isStable);
  const prevTierRef = useRef(tier);

  // Change message when weight stabilizes OR tier changes
  useEffect(() => {
    const justStabilized = isStable && !prevStableRef.current;
    const tierChanged = prevTierRef.current !== tier;
    
    if ((justStabilized || tierChanged) && price > 0) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setMessage(getRandomMessage(tier));
        setIsAnimating(false);
      }, 200);
    }
    
    prevStableRef.current = isStable;
    prevTierRef.current = tier;
  }, [tier, isStable, price]);

  // Don't show message if no weight
  if (price === 0) {
    return (
      <div className={cn("text-center h-14 flex items-center justify-center", className)}>
        <p className="font-label text-2xl font-semibold opacity-50 tracking-wide">
          Place candy on scale
        </p>
      </div>
    );
  }

  return (
    <div className={cn("text-center h-14 flex items-center justify-center", className)}>
      <p 
        className={cn(
          "font-label text-3xl font-semibold tracking-wide transition-all duration-400",
          isAnimating 
            ? "opacity-0 translate-y-3" 
            : "opacity-85 translate-y-0 animate-fade-in-up"
        )}
      >
        {message}
      </p>
    </div>
  );
};
