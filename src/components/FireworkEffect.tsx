// Celebratory firework effect for high weights
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  color: string;
  size: number;
  tx: number; // target X offset
  ty: number; // target Y offset
  delay: number;
}

interface Burst {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

const COLORS = [
  'rgba(255,100,150,0.9)',
  'rgba(255,180,200,0.9)',
  'rgba(255,255,255,0.95)',
  'rgba(255,220,230,0.9)',
  'rgba(255,140,180,0.9)',
  'rgba(255,80,130,0.85)',
];

const createBurst = (id: number): Burst => {
  const x = 15 + Math.random() * 70; // 15-85% of screen width
  const y = 15 + Math.random() * 50; // 15-65% of screen height
  
  const particles: Particle[] = [];
  const particleCount = 14 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (360 / particleCount) * i + Math.random() * 15;
    const speed = 80 + Math.random() * 100;
    const rad = (angle * Math.PI) / 180;
    
    particles.push({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 5 + Math.random() * 8,
      tx: Math.cos(rad) * speed,
      ty: Math.sin(rad) * speed,
      delay: Math.random() * 80,
    });
  }
  
  return { id, x, y, particles };
};

export const FireworkEffect = ({ active }: { active: boolean }) => {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    if (!active) {
      setBursts([]);
      return;
    }

    // Create initial bursts
    const initialBursts = [
      createBurst(0),
      createBurst(1),
      createBurst(2),
    ];
    setBursts(initialBursts);

    // Add more bursts over time
    let burstCount = 3;
    const interval = setInterval(() => {
      if (burstCount >= 8) {
        clearInterval(interval);
        return;
      }
      setBursts(prev => [...prev, createBurst(burstCount)]);
      burstCount++;
    }, 350);

    // Clear after animation
    const timeout = setTimeout(() => {
      setBursts([]);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [active]);

  if (!active || bursts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{
            left: `${burst.x}%`,
            top: `${burst.y}%`,
          }}
        >
          {burst.particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                animation: `firework-fly 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                animationDelay: `${particle.delay}ms`,
                '--tx': `${particle.tx}px`,
                '--ty': `${particle.ty}px`,
              } as React.CSSProperties}
            />
          ))}
          {/* Center flash */}
          <div 
            className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full"
            style={{ 
              background: 'rgba(255,255,255,0.95)',
              boxShadow: '0 0 40px rgba(255,200,220,0.9), 0 0 80px rgba(255,150,180,0.6)',
              animation: 'firework-flash 0.7s ease-out forwards',
            }}
          />
        </div>
      ))}
    </div>
  );
};
