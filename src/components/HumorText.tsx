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

  // Change message when tier changes
  useEffect(() => {
    if (prevTierRef.current !== tier) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setMessage(getRandomMessage(tier));
        setIsAnimating(false);
      }, 200);
      
      prevTierRef.current = tier;
    }
  }, [tier]);

  // Also update message on initial mount based on tier
  useEffect(() => {
    setMessage(getRandomMessage(tier));
  }, []);

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
