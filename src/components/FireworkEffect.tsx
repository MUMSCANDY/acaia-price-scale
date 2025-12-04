// Elegant ceremony celebration effect
import { useEffect, useState } from "react";

interface LightRay {
  id: number;
  angle: number;
  length: number;
  delay: number;
  opacity: number;
}

interface GlowBurst {
  id: number;
  x: string;
  y: string;
  size: number;
  delay: number;
}

export const FireworkEffect = ({ active }: { active: boolean }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active) {
      setShow(true);
      const timeout = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timeout);
    } else {
      setShow(false);
    }
  }, [active]);

  if (!show) return null;

  // Light rays emanating from corners
  const rays: LightRay[] = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: i * 45,
    length: 150 + Math.random() * 100,
    delay: i * 80,
    opacity: 0.4 + Math.random() * 0.3,
  }));

  // Soft glow bursts positioned at edges
  const glowBursts: GlowBurst[] = [
    { id: 0, x: '5%', y: '20%', size: 120, delay: 0 },
    { id: 1, x: '95%', y: '25%', size: 100, delay: 200 },
    { id: 2, x: '8%', y: '70%', size: 90, delay: 400 },
    { id: 3, x: '92%', y: '65%', size: 110, delay: 300 },
    { id: 4, x: '3%', y: '45%', size: 80, delay: 500 },
    { id: 5, x: '97%', y: '40%', size: 85, delay: 600 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Soft edge glow bursts */}
      {glowBursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute rounded-full ceremony-glow"
          style={{
            left: burst.x,
            top: burst.y,
            width: burst.size,
            height: burst.size,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,200,220,0.4) 40%, transparent 70%)',
            boxShadow: '0 0 60px rgba(255,200,220,0.5), 0 0 100px rgba(255,150,180,0.3)',
            animationDelay: `${burst.delay}ms`,
          }}
        />
      ))}

      {/* Top shimmer bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 ceremony-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          boxShadow: '0 0 30px rgba(255,200,220,0.6), 0 2px 40px rgba(255,150,180,0.4)',
        }}
      />

      {/* Bottom shimmer bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 ceremony-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          boxShadow: '0 0 30px rgba(255,200,220,0.6), 0 -2px 40px rgba(255,150,180,0.4)',
          animationDelay: '300ms',
        }}
      />

      {/* Left edge shine */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 ceremony-edge-glow"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
          boxShadow: '0 0 40px rgba(255,200,220,0.5), 2px 0 60px rgba(255,150,180,0.3)',
        }}
      />

      {/* Right edge shine */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-1 ceremony-edge-glow"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
          boxShadow: '0 0 40px rgba(255,200,220,0.5), -2px 0 60px rgba(255,150,180,0.3)',
          animationDelay: '200ms',
        }}
      />

      {/* Corner light rays - top left */}
      <div className="absolute top-0 left-0 w-48 h-48 overflow-hidden">
        {rays.slice(0, 3).map((ray) => (
          <div
            key={ray.id}
            className="absolute top-0 left-0 origin-top-left ceremony-ray"
            style={{
              width: 2,
              height: ray.length,
              background: `linear-gradient(180deg, rgba(255,255,255,${ray.opacity}) 0%, transparent 100%)`,
              transform: `rotate(${30 + ray.id * 20}deg)`,
              animationDelay: `${ray.delay}ms`,
            }}
          />
        ))}
      </div>

      {/* Corner light rays - top right */}
      <div className="absolute top-0 right-0 w-48 h-48 overflow-hidden">
        {rays.slice(3, 6).map((ray) => (
          <div
            key={ray.id}
            className="absolute top-0 right-0 origin-top-right ceremony-ray"
            style={{
              width: 2,
              height: ray.length,
              background: `linear-gradient(180deg, rgba(255,255,255,${ray.opacity}) 0%, transparent 100%)`,
              transform: `rotate(${-30 - (ray.id - 3) * 20}deg)`,
              animationDelay: `${ray.delay}ms`,
            }}
          />
        ))}
      </div>

      {/* Subtle center highlight - very soft, doesn't cover numbers */}
      <div 
        className="absolute inset-0 ceremony-overlay"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }}
      />
    </div>
  );
};
