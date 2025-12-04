// MUMS FUTUREPLAY - Apple-style Parallax Mesh Gradients
// Layered gradient orbs with parallax zoom effect - HIGH VISIBILITY

export const BackgroundGraphics = () => {
  return (
    <>
      {/* === BACK LAYER - Slowest zoom (60s) === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left large orb */}
        <div 
          className="absolute -top-[15%] -left-[10%] w-[60%] h-[55%] rounded-full blur-[80px] animate-parallax-zoom-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,150,180,0.7) 0%, rgba(255,120,160,0.4) 40%, transparent 70%)' }}
        />
        {/* Top-right large orb */}
        <div 
          className="absolute -top-[10%] -right-[15%] w-[55%] h-[50%] rounded-full blur-[70px] animate-parallax-zoom-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,180,200,0.65) 0%, rgba(255,140,175,0.35) 45%, transparent 70%)', animationDelay: '-20s' }}
        />
        {/* Bottom center large */}
        <div 
          className="absolute -bottom-[20%] left-[15%] w-[70%] h-[45%] rounded-full blur-[90px] animate-parallax-zoom-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,140,175,0.5) 0%, transparent 65%)', animationDelay: '-40s' }}
        />
      </div>

      {/* === MID LAYER - Medium zoom (45s) === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left side elongated */}
        <div 
          className="absolute top-[5%] -left-[5%] w-[40%] h-[65%] rounded-full blur-[60px] animate-parallax-zoom-mid"
          style={{ background: 'radial-gradient(ellipse 80% 100%, rgba(255,255,255,0.7) 0%, rgba(255,200,220,0.4) 40%, transparent 70%)' }}
        />
        {/* Right side elongated */}
        <div 
          className="absolute top-[0%] -right-[5%] w-[35%] h-[70%] rounded-full blur-[55px] animate-parallax-zoom-mid"
          style={{ background: 'radial-gradient(ellipse 75% 100%, rgba(255,255,255,0.65) 0%, rgba(255,180,210,0.35) 45%, transparent 70%)', animationDelay: '-15s' }}
        />
        {/* Top center accent */}
        <div 
          className="absolute -top-[5%] left-[20%] w-[60%] h-[35%] rounded-full blur-[70px] animate-parallax-zoom-mid animate-drift-subtle"
          style={{ background: 'radial-gradient(circle, rgba(255,220,235,0.75) 0%, rgba(255,180,200,0.3) 50%, transparent 70%)', animationDelay: '-30s' }}
        />
      </div>

      {/* === FRONT LAYER - Fastest zoom (30s) === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left highlight */}
        <div 
          className="absolute -top-[2%] -left-[3%] w-[30%] h-[28%] rounded-full blur-[40px] animate-parallax-zoom-fast"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,210,225,0.5) 50%, transparent 70%)' }}
        />
        {/* Top-right highlight */}
        <div 
          className="absolute -top-[5%] -right-[3%] w-[28%] h-[30%] rounded-full blur-[35px] animate-parallax-zoom-fast"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,200,220,0.4) 45%, transparent 70%)', animationDelay: '-10s' }}
        />
        {/* Bottom-left accent */}
        <div 
          className="absolute bottom-[8%] -left-[5%] w-[32%] h-[28%] rounded-full blur-[50px] animate-parallax-zoom-fast animate-drift-subtle"
          style={{ background: 'radial-gradient(circle, rgba(255,160,190,0.6) 0%, transparent 65%)', animationDelay: '-20s' }}
        />
        {/* Bottom-right accent */}
        <div 
          className="absolute bottom-[12%] -right-[3%] w-[28%] h-[25%] rounded-full blur-[45px] animate-parallax-zoom-fast"
          style={{ background: 'radial-gradient(circle, rgba(255,150,185,0.55) 0%, transparent 60%)', animationDelay: '-25s' }}
        />
      </div>

      {/* === BRIGHT WHITE HIGHLIGHTS === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[15%] left-[25%] w-[18%] h-[18%] rounded-full blur-[30px] animate-breathe"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-[35%] right-[20%] w-[15%] h-[15%] rounded-full blur-[25px] animate-breathe-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)', animationDelay: '-4s' }}
        />
        <div 
          className="absolute bottom-[25%] left-[40%] w-[20%] h-[16%] rounded-full blur-[35px] animate-breathe"
          style={{ background: 'radial-gradient(circle, rgba(255,240,248,0.5) 0%, transparent 65%)', animationDelay: '-6s' }}
        />
      </div>
    </>
  );
};
