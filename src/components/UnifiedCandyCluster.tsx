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

// Candy shapes for the bucket fill
const candyShapes = ['circle', 'oval', 'rect', 'lollipop', 'wrapped'];

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
  const [displayPercent, setDisplayPercent] = useState(0);
  const [candies, setCandies] = useState<Array<{ id: number; x: number; y: number; type: string; delay: number }>>([]);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const prevPriceRef = useRef(price);

  // Animate gauge fill
  useEffect(() => {
    const targetPercent = Math.min((weight / maxWeight) * 100, 100);
    const duration = 600;
    const start = displayPercent;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (targetPercent - start) * easeOut;
      setDisplayPercent(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [weight, maxWeight]);

  // Generate candy pieces
  useEffect(() => {
    const numCandies = Math.floor((fillPercent / 100) * 15);
    const newCandies = [];
    for (let i = 0; i < numCandies; i++) {
      newCandies.push({
        id: i,
        x: 15 + (i % 5) * 14 + Math.random() * 6,
        y: 70 - (Math.floor(i / 5) * 10) - Math.random() * 4,
        type: candyShapes[i % candyShapes.length],
        delay: i * 0.04,
      });
    }
    setCandies(newCandies);
  }, [fillPercent]);

  // Price animation trigger
  useEffect(() => {
    if (price !== prevPriceRef.current && price > 0) {
      setPriceAnimating(true);
      setTimeout(() => setPriceAnimating(false), 400);
    }
    prevPriceRef.current = price;
  }, [price]);

  // Gauge calculations
  const radius = 120;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (displayPercent / 100) * circumference;

  // Bucket expression based on tier
  const getBucketExpression = () => {
    switch (tier) {
      case 'tiny':
        return (
          <>
            <ellipse cx="32" cy="52" rx="3" ry="2.5" className="fill-foreground" />
            <ellipse cx="48" cy="52" rx="3" ry="2.5" className="fill-foreground" />
            <path d="M 35 60 Q 40 63 45 60" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" className="text-foreground" />
          </>
        );
      case 'nice':
        return (
          <>
            <path d="M 29 50 Q 32 46 35 50" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-foreground" />
            <path d="M 45 50 Q 48 46 51 50" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-foreground" />
            <path d="M 32 58 Q 40 66 48 58" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-foreground" />
            <ellipse cx="26" cy="56" rx="4" ry="2" className="fill-foreground/15" />
            <ellipse cx="54" cy="56" rx="4" ry="2" className="fill-foreground/15" />
          </>
        );
      case 'hype':
        return (
          <>
            <g className="animate-sparkle">
              <path d="M 32 49 L 33.5 51 L 36 51 L 34.5 53 L 35.5 55 L 32 53.5 L 28.5 55 L 29.5 53 L 28 51 L 30.5 51 Z" className="fill-foreground" />
              <path d="M 48 49 L 49.5 51 L 52 51 L 50.5 53 L 51.5 55 L 48 53.5 L 44.5 55 L 45.5 53 L 44 51 L 46.5 51 Z" className="fill-foreground" />
            </g>
            <path d="M 30 58 Q 40 70 50 58" stroke="currentColor" strokeWidth="2.5" fill="hsl(var(--background))" strokeLinecap="round" className="text-foreground" />
          </>
        );
      case 'legendary':
        return (
          <>
            <path d="M 28 48 C 28 45 30 45 32 47 C 34 45 36 45 36 48 C 36 51 32 54 32 54 C 32 54 28 51 28 48" className="fill-foreground animate-pulse" />
            <path d="M 44 48 C 44 45 46 45 48 47 C 50 45 52 45 52 48 C 52 51 48 54 48 54 C 48 54 44 51 44 48" className="fill-foreground animate-pulse" />
            <path d="M 28 60 Q 40 74 52 60" stroke="currentColor" strokeWidth="2.5" fill="hsl(var(--background))" strokeLinecap="round" className="text-foreground" />
            {/* Crown */}
            <g className="animate-bounce-slow">
              <path d="M 26 30 L 30 36 L 40 32 L 50 36 L 54 30 L 56 40 L 24 40 Z" className="fill-foreground/80" />
            </g>
          </>
        );
    }
  };

  const renderBucketCandy = (candy: { id: number; x: number; y: number; type: string; delay: number }) => {
    const baseProps = {
      key: candy.id,
      className: "fill-foreground/50 animate-candy-pop",
      style: { animationDelay: `${candy.delay}s` }
    };

    switch (candy.type) {
      case 'circle':
        return <circle {...baseProps} cx={candy.x} cy={candy.y} r={3.5} />;
      case 'oval':
        return <ellipse {...baseProps} cx={candy.x} cy={candy.y} rx={4} ry={2.5} />;
      case 'rect':
        return <rect {...baseProps} x={candy.x - 2.5} y={candy.y - 2.5} width={5} height={5} rx={1} />;
      case 'lollipop':
        return (
          <g {...baseProps}>
            <circle cx={candy.x} cy={candy.y - 2} r={3} />
            <rect x={candy.x - 0.5} y={candy.y + 1} width={1} height={4} />
          </g>
        );
      case 'wrapped':
        return (
          <g {...baseProps}>
            <ellipse cx={candy.x} cy={candy.y} rx={4} ry={2.5} />
            <path d={`M ${candy.x - 4} ${candy.y} L ${candy.x - 6} ${candy.y - 1.5} M ${candy.x - 4} ${candy.y} L ${candy.x - 6} ${candy.y + 1.5}`} stroke="currentColor" strokeWidth="0.8" className="text-foreground/50" />
            <path d={`M ${candy.x + 4} ${candy.y} L ${candy.x + 6} ${candy.y - 1.5} M ${candy.x + 4} ${candy.y} L ${candy.x + 6} ${candy.y + 1.5}`} stroke="currentColor" strokeWidth="0.8" className="text-foreground/50" />
          </g>
        );
      default:
        return <circle {...baseProps} cx={candy.x} cy={candy.y} r={3} />;
    }
  };

  const fillHeight = (fillPercent / 100) * 35;
  const fillY = 75 - fillHeight;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Unified cluster container */}
      <div className="relative flex items-center">
        
        {/* LEFT: MUMS Ice-cream Tub Style Bucket - positioned to overlap with gauge */}
        <div className={cn(
          "relative -mr-8 z-10 transition-transform duration-500",
          tier === 'nice' && "animate-float-gentle",
          tier === 'hype' && "animate-bucket-bounce",
          tier === 'legendary' && "animate-bucket-wiggle"
        )}>
          <svg viewBox="0 0 80 90" className="w-48 h-auto">
            {/* Bucket body - MUMS ice-cream tub style (no handle, rounded tub) */}
            <defs>
              <clipPath id="tubClip">
                <path d="M 10 40 L 12 78 Q 12 82 18 82 L 62 82 Q 68 82 68 78 L 70 40 Q 70 36 40 36 Q 10 36 10 40 Z" />
              </clipPath>
            </defs>
            
            {/* Fill background */}
            <rect 
              x="10" 
              y={fillY} 
              width="60" 
              height={fillHeight + 10}
              className="fill-foreground/12 transition-all duration-700 ease-out"
              clipPath="url(#tubClip)"
            />
            
            {/* Animated candies */}
            <g clipPath="url(#tubClip)">
              {candies.map(candy => renderBucketCandy(candy))}
            </g>
            
            {/* Tub outline - soft, rounded, no handle */}
            <path 
              d="M 10 40 L 12 78 Q 12 82 18 82 L 62 82 Q 68 82 68 78 L 70 40" 
              stroke="currentColor" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground"
            />
            
            {/* Tub rim - flat top edge with gentle curve */}
            <path 
              d="M 10 40 Q 10 35 40 35 Q 70 35 70 40"
              stroke="currentColor" 
              strokeWidth="3" 
              fill="hsl(var(--background))" 
              strokeLinecap="round"
              className="text-foreground" 
            />
            
            {/* Face expression */}
            <g className="transition-all duration-300">
              {getBucketExpression()}
            </g>
            
            {/* Overflow candies for legendary */}
            {tier === 'legendary' && (
              <g className="animate-candy-overflow">
                <circle cx="28" cy="32" r="4" className="fill-foreground/60" />
                <ellipse cx="40" cy="30" rx="5" ry="3" className="fill-foreground/55" />
                <circle cx="52" cy="32" r="3.5" className="fill-foreground/50" />
              </g>
            )}

            {/* Sparkles for hype/legendary */}
            {(tier === 'hype' || tier === 'legendary') && (
              <g className="animate-float-gentle">
                <circle cx="75" cy="45" r="2.5" className="fill-foreground/50" />
                <circle cx="5" cy="50" r="2" className="fill-foreground/40" />
              </g>
            )}

            {/* Hearts for legendary */}
            {tier === 'legendary' && (
              <>
                <g className="animate-float-hearts">
                  <path d="M 72 25 C 72 22 74 22 75 24 C 76 22 78 22 78 25 C 78 28 75 31 75 31 C 75 31 72 28 72 25" className="fill-foreground/50" />
                </g>
                <g className="animate-float-hearts" style={{ animationDelay: '0.4s' }}>
                  <path d="M 2 35 C 2 33 4 33 5 34 C 6 33 8 33 8 35 C 8 37 5 39 5 39 C 5 39 2 37 2 35" className="fill-foreground/40" />
                </g>
              </>
            )}
          </svg>
        </div>
        
        {/* CENTER: Weight Gauge Ring */}
        <div className="relative z-20">
          <svg viewBox="0 0 300 300" className="w-80 h-80">
            {/* Outer glow for stable state */}
            {isStable && weight > 0 && (
              <circle
                cx="150"
                cy="150"
                r={radius + 20}
                className="fill-none stroke-foreground/10 animate-stable-pulse"
                strokeWidth="25"
              />
            )}
            
            {/* Background ring */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke="hsl(var(--foreground) / 0.1)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            
            {/* Progress ring */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke="hsl(var(--foreground) / 0.7)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              transform="rotate(-90 150 150)"
              className={cn(
                "transition-all duration-500 ease-out",
                isStable && "animate-gauge-settle"
              )}
            />
            
            {/* Candy-dot tick marks */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i / 24) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const outerR = radius + 22;
              const x = 150 + outerR * Math.cos(rad);
              const y = 150 + outerR * Math.sin(rad);
              const isActive = (i / 24) * 100 <= displayPercent;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={isActive ? 4 : 3}
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "fill-foreground/70" : "fill-foreground/20"
                  )}
                />
              );
            })}
            
            {/* Moving candy droplet indicator */}
            {displayPercent > 0 && (
              <g 
                transform={`rotate(${(displayPercent / 100) * 360 - 90} 150 150)`}
                className="transition-transform duration-500"
              >
                <circle
                  cx={150 + radius}
                  cy={150}
                  r={10}
                  className="fill-foreground animate-pulse"
                />
                <circle
                  cx={150 + radius}
                  cy={150}
                  r={5}
                  className="fill-background"
                />
              </g>
            )}
          </svg>
          
          {/* Center content - Weight display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn(
              "text-numbers text-[90px] leading-none tabular-nums transition-transform duration-300",
              priceAnimating && "animate-weight-pop"
            )}>
              {weight.toFixed(0)}
            </div>
            <div className="text-display text-2xl mt-1 opacity-50 font-semibold">grams</div>
          </div>
        </div>
        
        {/* RIGHT: Price Block - positioned to overlap with gauge */}
        <div className={cn(
          "relative -ml-8 z-10 transition-all duration-300",
          priceAnimating && "animate-price-pop"
        )}>
          <div className="bg-background border-3 border-foreground rounded-3xl px-8 py-6 shadow-lg min-w-[200px]">
            <div className="text-center mb-1">
              <span className="text-body text-xs font-semibold opacity-40 uppercase tracking-wider">Total</span>
            </div>
            <div className="text-numbers text-[56px] leading-none tabular-nums text-center">
              {currencySymbol}{price}
            </div>
            <div className="text-center mt-3 pt-3 border-t-2 border-foreground/10">
              <span className="text-body text-sm opacity-50">
                {currencySymbol}{pricePerHundred} per 100g
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
