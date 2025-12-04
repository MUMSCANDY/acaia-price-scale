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
    // Change message when tier changes or when price crosses significant threshold
    const tierChanged = prevTierRef.current !== tier;
    const significantPriceJump = Math.abs(price - prevPriceRef.current) > 50;
    
    if (tierChanged || (significantPriceJump && price > 0)) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setMessage(getRandomMessage(tier));
        setIsAnimating(false);
      }, 300);
    }
    
    prevTierRef.current = tier;
    prevPriceRef.current = price;
  }, [tier, price]);

  // Don't show message if no weight
  if (price === 0) {
    return (
      <div className={cn("text-center font-digital", className)}>
        <p className="text-xl text-foreground/50 tracking-wide">
          Add some candy to get started!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("text-center font-digital", className)}>
      <p 
        className={cn(
          "text-2xl text-foreground tracking-wide transition-all duration-300",
          isAnimating ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"
        )}
      >
        "{message}"
      </p>
      
      {/* Decorative elements based on tier */}
      <div className="flex justify-center gap-2 mt-3">
        {tier === 'tiny' && (
          <span className="text-lg animate-pulse">💭</span>
        )}
        {tier === 'nice' && (
          <>
            <span className="text-lg animate-bounce-slow">✨</span>
            <span className="text-lg animate-bounce-slow" style={{ animationDelay: '0.1s' }}>🍬</span>
            <span className="text-lg animate-bounce-slow" style={{ animationDelay: '0.2s' }}>✨</span>
          </>
        )}
        {tier === 'hype' && (
          <>
            <span className="text-lg animate-bounce">🔥</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.2s' }}>🔥</span>
          </>
        )}
        {tier === 'legendary' && (
          <>
            <span className="text-lg animate-spin-slow">👑</span>
            <span className="text-lg animate-bounce">💎</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.1s' }}>🎉</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.2s' }}>💎</span>
            <span className="text-lg animate-spin-slow" style={{ animationDelay: '0.3s' }}>👑</span>
          </>
        )}
      </div>
    </div>
  );
};
