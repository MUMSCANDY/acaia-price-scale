import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  
  // Smooth animation for gauge fill
  useEffect(() => {
    const targetPercent = Math.min((weight / maxWeight) * 100, 100);
    setDisplayPercent(targetPercent);
  }, [weight, maxWeight]);

  // SVG circle parameters
  const size = 320;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayPercent / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg 
        width={size} 
        height={size} 
        className={cn(
          "transform -rotate-90 transition-transform duration-300",
          isStable && weight > 0 && "animate-gauge-settle"
        )}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
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
            isStable && weight > 0 && "drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]"
          )}
        />
        
        {/* Tick marks */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = size / 2 + (radius - 15) * Math.cos(angle);
          const y1 = size / 2 + (radius - 15) * Math.sin(angle);
          const x2 = size / 2 + (radius - 8) * Math.cos(angle);
          const y2 = size / 2 + (radius - 8) * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={2}
              className="text-foreground/20"
            />
          );
        })}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
