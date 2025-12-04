// Elegant corner glow ceremony effect
import { useEffect, useState } from "react";

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

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* TOP LEFT CORNER */}
      <div className="absolute top-0 left-0 w-[30%] h-[35%]">
        <div 
          className="absolute -top-[20%] -left-[20%] w-full h-full rounded-full ceremony-corner-glow"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,200,220,0.5) 30%, transparent 60%)',
            boxShadow: '0 0 80px rgba(255,200,220,0.6), 0 0 120px rgba(255,150,180,0.4)',
          }}
        />
        {/* Light rays */}
        <div className="absolute top-0 left-0 ceremony-ray" style={{ width: 3, height: 120, background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)', transform: 'rotate(35deg)', transformOrigin: 'top left' }} />
        <div className="absolute top-0 left-0 ceremony-ray" style={{ width: 2, height: 100, background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)', transform: 'rotate(55deg)', transformOrigin: 'top left', animationDelay: '100ms' }} />
        <div className="absolute top-0 left-0 ceremony-ray" style={{ width: 2, height: 80, background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)', transform: 'rotate(15deg)', transformOrigin: 'top left', animationDelay: '200ms' }} />
      </div>

      {/* TOP RIGHT CORNER */}
      <div className="absolute top-0 right-0 w-[30%] h-[35%]">
        <div 
          className="absolute -top-[20%] -right-[20%] w-full h-full rounded-full ceremony-corner-glow"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,200,220,0.5) 30%, transparent 60%)',
            boxShadow: '0 0 80px rgba(255,200,220,0.6), 0 0 120px rgba(255,150,180,0.4)',
            animationDelay: '150ms',
          }}
        />
        {/* Light rays */}
        <div className="absolute top-0 right-0 ceremony-ray" style={{ width: 3, height: 120, background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)', transform: 'rotate(-35deg)', transformOrigin: 'top right', animationDelay: '150ms' }} />
        <div className="absolute top-0 right-0 ceremony-ray" style={{ width: 2, height: 100, background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)', transform: 'rotate(-55deg)', transformOrigin: 'top right', animationDelay: '250ms' }} />
        <div className="absolute top-0 right-0 ceremony-ray" style={{ width: 2, height: 80, background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)', transform: 'rotate(-15deg)', transformOrigin: 'top right', animationDelay: '350ms' }} />
      </div>

      {/* BOTTOM LEFT CORNER */}
      <div className="absolute bottom-0 left-0 w-[30%] h-[35%]">
        <div 
          className="absolute -bottom-[20%] -left-[20%] w-full h-full rounded-full ceremony-corner-glow"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,200,220,0.45) 30%, transparent 60%)',
            boxShadow: '0 0 70px rgba(255,200,220,0.5), 0 0 100px rgba(255,150,180,0.3)',
            animationDelay: '300ms',
          }}
        />
        {/* Light rays */}
        <div className="absolute bottom-0 left-0 ceremony-ray" style={{ width: 3, height: 100, background: 'linear-gradient(0deg, rgba(255,255,255,0.7) 0%, transparent 100%)', transform: 'rotate(-35deg)', transformOrigin: 'bottom left', animationDelay: '300ms' }} />
        <div className="absolute bottom-0 left-0 ceremony-ray" style={{ width: 2, height: 80, background: 'linear-gradient(0deg, rgba(255,255,255,0.5) 0%, transparent 100%)', transform: 'rotate(-55deg)', transformOrigin: 'bottom left', animationDelay: '400ms' }} />
      </div>

      {/* BOTTOM RIGHT CORNER */}
      <div className="absolute bottom-0 right-0 w-[30%] h-[35%]">
        <div 
          className="absolute -bottom-[20%] -right-[20%] w-full h-full rounded-full ceremony-corner-glow"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,200,220,0.45) 30%, transparent 60%)',
            boxShadow: '0 0 70px rgba(255,200,220,0.5), 0 0 100px rgba(255,150,180,0.3)',
            animationDelay: '450ms',
          }}
        />
        {/* Light rays */}
        <div className="absolute bottom-0 right-0 ceremony-ray" style={{ width: 3, height: 100, background: 'linear-gradient(0deg, rgba(255,255,255,0.7) 0%, transparent 100%)', transform: 'rotate(35deg)', transformOrigin: 'bottom right', animationDelay: '450ms' }} />
        <div className="absolute bottom-0 right-0 ceremony-ray" style={{ width: 2, height: 80, background: 'linear-gradient(0deg, rgba(255,255,255,0.5) 0%, transparent 100%)', transform: 'rotate(55deg)', transformOrigin: 'bottom right', animationDelay: '550ms' }} />
      </div>
    </div>
  );
};
