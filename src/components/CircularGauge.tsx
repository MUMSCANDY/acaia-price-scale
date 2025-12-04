import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface CircularGaugeProps {
  weight: number;
  maxWeight?: number;
  isStable: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CircularGauge = ({ 
  weight, 
  maxWeight = 2000, 
  isStable, 
  className,
  children 
}: CircularGaugeProps) => {
  const [displayPercent, setDisplayPercent] = useState(0);
  const [shouldBounce, setShouldBounce] = useState(false);
  const prevWeightRef = useRef(weight);
  
  // Smooth animation for gauge fill
  useEffect(() => {
    const targetPercent = Math.min((weight / maxWeight) * 100, 100);
    setDisplayPercent(targetPercent);
    
    // Trigger bounce on significant weight change
    if (Math.abs(weight - prevWeightRef.current) > 5) {
      setShouldBounce(true);
      setTimeout(() => setShouldBounce(false), 500);
    }
    prevWeightRef.current = weight;
  }, [weight, maxWeight]);

  // SVG circle parameters
  const size = 300;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayPercent / 100) * circumference;

  // Candy dot tick marks
  const numTicks = 24;
  const tickMarks = [...Array(numTicks)].map((_, i) => {
    const angle = (i * (360 / numTicks) - 90) * (Math.PI / 180);
    const isFilled = (i / numTicks) * 100 <= displayPercent;
    const outerR = radius + 2;
    const x = size / 2 + outerR * Math.cos(angle);
    const y = size / 2 + outerR * Math.sin(angle);
    return { x, y, isFilled, angle: i * (360 / numTicks) };
  });

  // Moving candy droplet position
  const dropletAngle = ((displayPercent / 100) * 360 - 90) * (Math.PI / 180);
  const dropletX = size / 2 + radius * Math.cos(dropletAngle);
  const dropletY = size / 2 + radius * Math.sin(dropletAngle);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg 
        width={size} 
        height={size} 
        className={cn(
          "transform -rotate-90 transition-transform duration-300",
          isStable && weight > 0 && "animate-gauge-settle",
          shouldBounce && "animate-gauge-bounce"
        )}
      >
        {/* Outer glow when stable */}
        {isStable && weight > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius + 15}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="text-foreground/10 animate-glow-pulse"
          />
        )}
        
        {/* Background circle - dotted style */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className="text-foreground/10"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "text-foreground transition-all duration-700 ease-out",
            isStable && weight > 0 && "drop-shadow-[0_0_12px_rgba(0,0,0,0.25)]"
          )}
        />
        
        {/* Candy dot tick marks */}
        {tickMarks.map((tick, i) => (
          <circle
            key={i}
            cx={tick.x}
            cy={tick.y}
            r={tick.isFilled ? 4 : 3}
            className={cn(
              "transition-all duration-300",
              tick.isFilled ? "fill-foreground" : "fill-foreground/20"
            )}
          />
        ))}
        
        {/* Moving candy droplet indicator */}
        {weight > 0 && (
          <g className="animate-pulse">
            <circle
              cx={dropletX}
              cy={dropletY}
              r={8}
              className="fill-foreground"
            />
            <circle
              cx={dropletX - 2}
              cy={dropletY - 2}
              r={2}
              className="fill-background/50"
            />
          </g>
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
