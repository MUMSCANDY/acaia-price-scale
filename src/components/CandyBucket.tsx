import { cn } from "@/lib/utils";
import { PriceTier } from "@/lib/humorMessages";

interface CandyBucketProps {
  tier: PriceTier;
  fillPercent: number;
  className?: string;
}

export const CandyBucket = ({ tier, fillPercent, className }: CandyBucketProps) => {
  const getExpression = () => {
    switch (tier) {
      case 'tiny':
        return (
          <>
            {/* Sad eyes */}
            <ellipse cx="35" cy="45" rx="4" ry="5" className="fill-foreground" />
            <ellipse cx="55" cy="45" rx="4" ry="5" className="fill-foreground" />
            {/* Sad mouth */}
            <path d="M 35 60 Q 45 55 55 60" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
          </>
        );
      case 'nice':
        return (
          <>
            {/* Happy eyes */}
            <ellipse cx="35" cy="45" rx="4" ry="5" className="fill-foreground" />
            <ellipse cx="55" cy="45" rx="4" ry="5" className="fill-foreground" />
            {/* Smile */}
            <path d="M 35 58 Q 45 66 55 58" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
          </>
        );
      case 'hype':
        return (
          <>
            {/* Excited squint eyes */}
            <path d="M 31 45 L 39 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-foreground" />
            <path d="M 51 45 L 59 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-foreground" />
            {/* Big smile */}
            <path d="M 32 56 Q 45 70 58 56" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
            {/* Sparkles */}
            <g className="animate-sparkle">
              <path d="M 70 30 L 73 35 L 78 35 L 74 39 L 76 44 L 70 41 L 64 44 L 66 39 L 62 35 L 67 35 Z" className="fill-foreground" />
              <path d="M 20 25 L 22 28 L 26 28 L 23 31 L 24 35 L 20 33 L 16 35 L 17 31 L 14 28 L 18 28 Z" className="fill-foreground" transform="scale(0.7) translate(15, 15)" />
            </g>
          </>
        );
      case 'legendary':
        return (
          <>
            {/* Heart eyes */}
            <path d="M 32 42 C 32 38 36 38 38 42 C 40 38 44 38 44 42 C 44 47 38 52 38 52 C 38 52 32 47 32 42" className="fill-foreground" />
            <path d="M 46 42 C 46 38 50 38 52 42 C 54 38 58 38 58 42 C 58 47 52 52 52 52 C 52 52 46 47 46 42" className="fill-foreground" />
            {/* Blissful smile */}
            <path d="M 32 58 Q 45 72 58 58" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
            {/* Hearts floating */}
            <g className="animate-float-hearts">
              <path d="M 75 25 C 75 22 78 22 80 25 C 82 22 85 22 85 25 C 85 29 80 33 80 33 C 80 33 75 29 75 25" className="fill-foreground opacity-60" />
              <path d="M 10 30 C 10 28 12 28 13 30 C 14 28 16 28 16 30 C 16 32 13 35 13 35 C 13 35 10 32 10 30" className="fill-foreground opacity-40" />
            </g>
            {/* Sparkles */}
            <g className="animate-sparkle">
              <path d="M 72 50 L 74 53 L 78 53 L 75 56 L 76 60 L 72 58 L 68 60 L 69 56 L 66 53 L 70 53 Z" className="fill-foreground" transform="scale(0.5) translate(50, 0)" />
            </g>
          </>
        );
    }
  };

  // Calculate fill height (bucket body goes from y=35 to y=85, so 50 units)
  const fillHeight = (fillPercent / 100) * 45;
  const fillY = 85 - fillHeight;

  return (
    <div className={cn("relative", className)}>
      <svg 
        viewBox="0 0 90 100" 
        className={cn(
          "w-full h-full transition-transform duration-500",
          tier === 'hype' && "animate-bucket-bounce",
          tier === 'legendary' && "animate-bucket-wiggle"
        )}
      >
        {/* Bucket body - trapezoid shape */}
        <defs>
          <clipPath id="bucketClip">
            <path d="M 15 35 L 25 85 L 65 85 L 75 35 Z" />
          </clipPath>
        </defs>
        
        {/* Fill */}
        <rect 
          x="15" 
          y={fillY} 
          width="60" 
          height={fillHeight + 5}
          className="fill-foreground/20 transition-all duration-700 ease-out"
          clipPath="url(#bucketClip)"
        />
        
        {/* Bucket outline */}
        <path 
          d="M 15 35 L 25 85 L 65 85 L 75 35 Z" 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none" 
          className="text-foreground"
        />
        
        {/* Bucket rim */}
        <ellipse cx="45" cy="35" rx="32" ry="8" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
        
        {/* Handle */}
        <path d="M 20 25 Q 45 5 70 25" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
        
        {/* Face expression */}
        <g className="transition-all duration-300">
          {getExpression()}
        </g>
        
        {/* Overflow candies for legendary tier */}
        {tier === 'legendary' && (
          <g className="animate-candy-overflow">
            <circle cx="30" cy="28" r="5" className="fill-foreground/70" />
            <circle cx="45" cy="24" r="6" className="fill-foreground/80" />
            <circle cx="58" cy="27" r="4" className="fill-foreground/60" />
            <circle cx="38" cy="30" r="3" className="fill-foreground/50" />
            <circle cx="52" cy="32" r="4" className="fill-foreground/65" />
          </g>
        )}
      </svg>
      
      {/* Blush marks for happy/excited states */}
      {(tier === 'nice' || tier === 'hype' || tier === 'legendary') && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[25%] top-[52%] w-[8%] h-[4%] rounded-full bg-foreground/10" />
          <div className="absolute right-[25%] top-[52%] w-[8%] h-[4%] rounded-full bg-foreground/10" />
        </div>
      )}
    </div>
  );
};
