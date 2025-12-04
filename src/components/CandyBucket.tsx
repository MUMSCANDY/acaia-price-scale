import { cn } from "@/lib/utils";
import { PriceTier } from "@/lib/humorMessages";
import { useEffect, useState } from "react";

interface CandyBucketProps {
  tier: PriceTier;
  fillPercent: number;
  className?: string;
}

// Candy shapes for the fill animation
const candyShapes = [
  { type: 'circle', color: 'fill-foreground/70' },
  { type: 'oval', color: 'fill-foreground/60' },
  { type: 'rect', color: 'fill-foreground/65' },
  { type: 'diamond', color: 'fill-foreground/55' },
  { type: 'circle', color: 'fill-foreground/75' },
];

export const CandyBucket = ({ tier, fillPercent, className }: CandyBucketProps) => {
  const [candies, setCandies] = useState<Array<{ id: number; x: number; y: number; type: string; delay: number }>>([]);
  
  // Generate candy pieces based on fill percent
  useEffect(() => {
    const numCandies = Math.floor((fillPercent / 100) * 12);
    const newCandies = [];
    
    for (let i = 0; i < numCandies; i++) {
      newCandies.push({
        id: i,
        x: 20 + (i % 4) * 15 + Math.random() * 8,
        y: 75 - (Math.floor(i / 4) * 12) - Math.random() * 5,
        type: candyShapes[i % candyShapes.length].type,
        delay: i * 0.05,
      });
    }
    setCandies(newCandies);
  }, [fillPercent]);

  const getExpression = () => {
    switch (tier) {
      case 'tiny':
        return (
          <>
            {/* Shy/sad eyes - looking down */}
            <ellipse cx="35" cy="48" rx="4" ry="3" className="fill-foreground" />
            <ellipse cx="55" cy="48" rx="4" ry="3" className="fill-foreground" />
            {/* Small shy smile */}
            <path d="M 38 58 Q 45 62 52 58" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-foreground" />
          </>
        );
      case 'nice':
        return (
          <>
            {/* Happy closed eyes (^_^) */}
            <path d="M 31 46 Q 35 42 39 46" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-foreground" />
            <path d="M 51 46 Q 55 42 59 46" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-foreground" />
            {/* Happy smile */}
            <path d="M 34 56 Q 45 66 56 56" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-foreground" />
            {/* Blush */}
            <ellipse cx="28" cy="54" rx="5" ry="3" className="fill-foreground/15" />
            <ellipse cx="62" cy="54" rx="5" ry="3" className="fill-foreground/15" />
          </>
        );
      case 'hype':
        return (
          <>
            {/* Excited star eyes */}
            <g className="animate-sparkle">
              <path d="M 35 45 L 37 48 L 40 48 L 38 50 L 39 53 L 35 51 L 31 53 L 32 50 L 30 48 L 33 48 Z" className="fill-foreground" />
              <path d="M 55 45 L 57 48 L 60 48 L 58 50 L 59 53 L 55 51 L 51 53 L 52 50 L 50 48 L 53 48 Z" className="fill-foreground" />
            </g>
            {/* Big excited open smile */}
            <path d="M 32 54 Q 45 70 58 54" stroke="currentColor" strokeWidth="3" fill="hsl(var(--background))" strokeLinecap="round" className="text-foreground" />
            {/* Sparkles around */}
            <g className="animate-float-gentle">
              <circle cx="72" cy="35" r="3" className="fill-foreground/60" />
              <circle cx="18" cy="38" r="2" className="fill-foreground/50" />
              <circle cx="75" cy="55" r="2" className="fill-foreground/40" />
            </g>
          </>
        );
      case 'legendary':
        return (
          <>
            {/* Heart eyes */}
            <path d="M 30 44 C 30 40 33 40 35 43 C 37 40 40 40 40 44 C 40 49 35 53 35 53 C 35 53 30 49 30 44" className="fill-foreground animate-pulse" />
            <path d="M 50 44 C 50 40 53 40 55 43 C 57 40 60 40 60 44 C 60 49 55 53 55 53 C 55 53 50 49 50 44" className="fill-foreground animate-pulse" />
            {/* Blissful open smile */}
            <path d="M 30 56 Q 45 74 60 56" stroke="currentColor" strokeWidth="3" fill="hsl(var(--background))" strokeLinecap="round" className="text-foreground" />
            {/* Floating hearts */}
            <g className="animate-float-hearts">
              <path d="M 75 28 C 75 25 77 25 78 27 C 79 25 81 25 81 28 C 81 31 78 34 78 34 C 78 34 75 31 75 28" className="fill-foreground/60" />
            </g>
            <g className="animate-float-hearts" style={{ animationDelay: '0.3s' }}>
              <path d="M 12 35 C 12 33 14 33 15 35 C 16 33 18 33 18 35 C 18 37 15 40 15 40 C 15 40 12 37 12 35" className="fill-foreground/50" />
            </g>
            {/* Crown */}
            <g className="animate-bounce-slow">
              <path d="M 30 20 L 35 28 L 45 22 L 55 28 L 60 20 L 62 32 L 28 32 Z" className="fill-foreground/80" />
            </g>
          </>
        );
    }
  };

  // Calculate fill height
  const fillHeight = (fillPercent / 100) * 45;
  const fillY = 82 - fillHeight;

  const renderCandy = (candy: { id: number; x: number; y: number; type: string; delay: number }) => {
    const baseProps = {
      key: candy.id,
      className: cn("fill-foreground/60 animate-candy-pop"),
      style: { animationDelay: `${candy.delay}s` }
    };

    switch (candy.type) {
      case 'circle':
        return <circle {...baseProps} cx={candy.x} cy={candy.y} r={4} />;
      case 'oval':
        return <ellipse {...baseProps} cx={candy.x} cy={candy.y} rx={5} ry={3} />;
      case 'rect':
        return <rect {...baseProps} x={candy.x - 3} y={candy.y - 3} width={6} height={6} rx={1} />;
      case 'diamond':
        return <path {...baseProps} d={`M ${candy.x} ${candy.y - 4} L ${candy.x + 4} ${candy.y} L ${candy.x} ${candy.y + 4} L ${candy.x - 4} ${candy.y} Z`} />;
      default:
        return <circle {...baseProps} cx={candy.x} cy={candy.y} r={3} />;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <svg 
        viewBox="0 0 90 100" 
        className={cn(
          "w-full h-full transition-transform duration-500",
          tier === 'nice' && "animate-float-gentle",
          tier === 'hype' && "animate-bucket-bounce",
          tier === 'legendary' && "animate-bucket-wiggle"
        )}
      >
        {/* Bucket body - rounded trapezoid */}
        <defs>
          <clipPath id="bucketClip">
            <path d="M 18 38 Q 15 82 25 85 L 65 85 Q 75 82 72 38 Z" />
          </clipPath>
        </defs>
        
        {/* Fill gradient background */}
        <rect 
          x="15" 
          y={fillY} 
          width="60" 
          height={fillHeight + 8}
          className="fill-foreground/15 transition-all duration-700 ease-out"
          clipPath="url(#bucketClip)"
        />
        
        {/* Animated candies inside bucket */}
        <g clipPath="url(#bucketClip)">
          {candies.map(candy => renderCandy(candy))}
        </g>
        
        {/* Bucket outline - softer, rounder */}
        <path 
          d="M 18 38 Q 15 82 25 85 L 65 85 Q 75 82 72 38" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        />
        
        {/* Bucket rim - rounder */}
        <ellipse cx="45" cy="38" rx="29" ry="7" stroke="currentColor" strokeWidth="3" fill="hsl(var(--background))" className="text-foreground" />
        
        {/* Handle - curved and cute */}
        <path d="M 22 30 Q 45 8 68 30" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-foreground" />
        
        {/* Face expression */}
        <g className="transition-all duration-300">
          {getExpression()}
        </g>
        
        {/* Overflow candies for legendary tier */}
        {tier === 'legendary' && (
          <g className="animate-candy-overflow">
            <circle cx="32" cy="32" r="5" className="fill-foreground/70" />
            <ellipse cx="45" cy="28" rx="6" ry="4" className="fill-foreground/65" />
            <circle cx="58" cy="31" r="4" className="fill-foreground/60" />
            <rect x="36" y="34" width="5" height="5" rx="1" className="fill-foreground/55" />
            <circle cx="52" cy="35" r="3" className="fill-foreground/50" />
          </g>
        )}
      </svg>
    </div>
  );
};
