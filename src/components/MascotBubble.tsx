import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { PriceTier } from "@/lib/humorMessages";

interface MascotBubbleProps {
  tier: PriceTier;
  isStable: boolean;
  weight: number;
  className?: string;
}

type Expression = 'neutral' | 'thinking' | 'wink' | 'shocked' | 'heartEyes';

export const MascotBubble = ({ tier, isStable, weight, className }: MascotBubbleProps) => {
  const [expression, setExpression] = useState<Expression>('neutral');
  const prevWeightRef = useRef(weight);

  useEffect(() => {
    // Detect big weight jumps for shocked expression
    const weightDiff = Math.abs(weight - prevWeightRef.current);
    
    if (weightDiff > 100 && weight > prevWeightRef.current) {
      setExpression('shocked');
      setTimeout(() => setExpression(getBaseExpression(tier, isStable)), 1000);
    } else if (isStable && weight > 0) {
      setExpression('wink');
      setTimeout(() => setExpression(getBaseExpression(tier, false)), 1500);
    } else {
      setExpression(getBaseExpression(tier, isStable));
    }
    
    prevWeightRef.current = weight;
  }, [weight, isStable, tier]);

  const getBaseExpression = (t: PriceTier, stable: boolean): Expression => {
    if (t === 'legendary') return 'heartEyes';
    if (t === 'hype') return 'heartEyes';
    if (stable) return 'wink';
    return 'neutral';
  };

  const renderExpression = () => {
    switch (expression) {
      case 'neutral':
        return (
          <>
            <circle cx="35" cy="40" r="4" className="fill-foreground" />
            <circle cx="65" cy="40" r="4" className="fill-foreground" />
            <path d="M 40 55 Q 50 60 60 55" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx="35" cy="40" r="4" className="fill-foreground" />
            <circle cx="65" cy="38" r="4" className="fill-foreground" />
            <path d="M 42 55 Q 50 55 58 55" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
          </>
        );
      case 'wink':
        return (
          <>
            <circle cx="35" cy="40" r="4" className="fill-foreground" />
            <path d="M 60 40 L 70 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-foreground" />
            <path d="M 40 55 Q 50 62 60 55" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
          </>
        );
      case 'shocked':
        return (
          <>
            <circle cx="35" cy="38" r="6" className="fill-foreground" />
            <circle cx="65" cy="38" r="6" className="fill-foreground" />
            <ellipse cx="50" cy="58" rx="8" ry="10" className="fill-foreground" />
          </>
        );
      case 'heartEyes':
        return (
          <>
            <path d="M 28 38 C 28 33 33 33 35 38 C 37 33 42 33 42 38 C 42 44 35 50 35 50 C 35 50 28 44 28 38" className="fill-foreground animate-pulse" />
            <path d="M 58 38 C 58 33 63 33 65 38 C 67 33 72 33 72 38 C 72 44 65 50 65 50 C 65 50 58 44 58 38" className="fill-foreground animate-pulse" />
            <path d="M 38 58 Q 50 70 62 58" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
          </>
        );
    }
  };

  return (
    <div 
      className={cn(
        "relative transition-transform duration-300",
        expression === 'shocked' && "animate-mascot-shake",
        expression === 'wink' && "animate-mascot-bounce",
        className
      )}
    >
      <svg viewBox="0 0 100 80" className="w-full h-full">
        {/* Circle face */}
        <circle 
          cx="50" 
          cy="40" 
          r="35" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none" 
          className="text-foreground"
        />
        
        {/* Expression */}
        {renderExpression()}
        
        {/* Blush for happy states */}
        {(expression === 'wink' || expression === 'heartEyes') && (
          <>
            <ellipse cx="25" cy="48" rx="6" ry="3" className="fill-foreground/15" />
            <ellipse cx="75" cy="48" rx="6" ry="3" className="fill-foreground/15" />
          </>
        )}
      </svg>
    </div>
  );
};
