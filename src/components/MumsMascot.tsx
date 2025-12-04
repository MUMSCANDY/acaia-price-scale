import { cn } from "@/lib/utils";
import { PriceTier } from "@/lib/humorMessages";
import mumsMascot from "@/assets/mums-mascot.png";

interface MumsMascotProps {
  tier: PriceTier;
  className?: string;
}

export const MumsMascot = ({ tier, className }: MumsMascotProps) => {
  return (
    <div 
      className={cn(
        "relative transition-all duration-500",
        tier === 'tiny' && "opacity-80 scale-95",
        tier === 'nice' && "opacity-90 scale-100 animate-float-gentle",
        tier === 'hype' && "opacity-100 scale-105 animate-bounce-slow",
        tier === 'legendary' && "opacity-100 scale-110 animate-wiggle",
        className
      )}
    >
      <img 
        src={mumsMascot} 
        alt="MUMS Mascot" 
        className="w-full h-full object-contain rounded-3xl shadow-lg"
      />
      
      {/* Sparkles for hype and legendary tiers */}
      {(tier === 'hype' || tier === 'legendary') && (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-0 right-0 text-2xl animate-sparkle">✨</span>
          <span className="absolute bottom-1/4 left-0 text-xl animate-sparkle" style={{ animationDelay: '0.3s' }}>✨</span>
        </div>
      )}
      
      {/* Hearts for legendary tier */}
      {tier === 'legendary' && (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-0 left-1/4 text-xl animate-float-hearts">💕</span>
          <span className="absolute top-1/4 right-0 text-lg animate-float-hearts" style={{ animationDelay: '0.5s' }}>💖</span>
        </div>
      )}
    </div>
  );
};
