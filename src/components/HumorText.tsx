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
      <div className={cn("text-center h-28 flex flex-col items-center justify-center", className)}>
        <p className="text-3xl text-foreground/50 font-display font-bold">
          Add some candy to get started!
        </p>
      </div>
    );
  }

  const getTierEmoji = () => {
    switch (tier) {
      case 'tiny': return '🍬';
      case 'nice': return '✨';
      case 'hype': return '🔥';
      case 'legendary': return '👑';
    }
  };

  return (
    <div className={cn("text-center h-28 flex flex-col items-center justify-center", className)}>
      {/* Main humor message - larger and centered */}
      <div 
        className={cn(
          "flex items-center justify-center gap-4 transition-all duration-300",
          isAnimating 
            ? "opacity-0 transform translate-y-4" 
            : "opacity-100 transform translate-y-0",
          shouldBounce && "animate-humor-bounce"
        )}
      >
        <span className={cn(
          "text-2xl",
          tier === 'legendary' && "animate-spin-slow"
        )}>
          {getTierEmoji()}
        </span>
        
        <p className="text-3xl md:text-4xl font-display font-bold text-foreground max-w-2xl">
          {message}
        </p>
        
        <span className={cn(
          "text-2xl",
          tier === 'legendary' && "animate-spin-slow"
        )}>
          {getTierEmoji()}
        </span>
      </div>
      
      {/* Decorative elements based on tier */}
      <div className="flex justify-center gap-3 mt-3 h-8">
        {tier === 'tiny' && (
          <span className="text-xl animate-pulse opacity-60">💭</span>
        )}
        {tier === 'nice' && (
          <>
            <span className="text-lg animate-bounce-slow">✨</span>
            <span className="text-lg animate-bounce-slow" style={{ animationDelay: '0.2s' }}>🍬</span>
            <span className="text-lg animate-bounce-slow" style={{ animationDelay: '0.4s' }}>✨</span>
          </>
        )}
        {tier === 'hype' && (
          <>
            <span className="text-lg animate-bounce">⭐</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.1s' }}>🔥</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.3s' }}>🔥</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.4s' }}>⭐</span>
          </>
        )}
        {tier === 'legendary' && (
          <>
            <span className="text-lg animate-spin-slow">👑</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.1s' }}>💎</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</span>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.3s' }}>💎</span>
            <span className="text-lg animate-spin-slow" style={{ animationDelay: '0.2s' }}>👑</span>
          </>
        )}
      </div>
    </div>
  );
};
