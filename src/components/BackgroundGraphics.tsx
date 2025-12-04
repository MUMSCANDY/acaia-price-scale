// MUMS FUTUREPLAY - Apple-style Parallax Mesh Gradients
// Layered gradient orbs with parallax zoom effect

export const BackgroundGraphics = () => {
  return (
    <>
      {/* === BACK LAYER - Slowest zoom (60s) === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left large orb */}
        <div 
          className="absolute -top-[20%] -left-[15%] w-[70%] h-[60%] rounded-full blur-[120px] animate-parallax-zoom-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,200,220,0.6) 0%, rgba(255,180,200,0.3) 40%, transparent 70%)' }}
        />
        {/* Top-right large orb */}
        <div 
          className="absolute -top-[15%] -right-[20%] w-[65%] h-[55%] rounded-full blur-[100px] animate-parallax-zoom-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,220,230,0.5) 0%, rgba(255,200,215,0.25) 45%, transparent 70%)', animationDelay: '-20s' }}
        />
        {/* Bottom center large */}
        <div 
          className="absolute -bottom-[25%] left-[10%] w-[80%] h-[50%] rounded-full blur-[130px] animate-parallax-zoom-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,190,210,0.4) 0%, transparent 65%)', animationDelay: '-40s' }}
        />
      </div>

      {/* === MID LAYER - Medium zoom (45s) === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left side elongated */}
        <div 
          className="absolute top-[10%] -left-[10%] w-[45%] h-[70%] rounded-full blur-[90px] animate-parallax-zoom-mid"
          style={{ background: 'radial-gradient(ellipse 80% 100%, rgba(255,255,255,0.5) 0%, rgba(255,220,235,0.3) 40%, transparent 70%)' }}
        />
        {/* Right side elongated */}
        <div 
          className="absolute top-[5%] -right-[8%] w-[40%] h-[75%] rounded-full blur-[80px] animate-parallax-zoom-mid"
          style={{ background: 'radial-gradient(ellipse 75% 100%, rgba(255,255,255,0.45) 0%, rgba(255,210,225,0.25) 45%, transparent 70%)', animationDelay: '-15s' }}
        />
        {/* Top center accent */}
        <div 
          className="absolute -top-[10%] left-[25%] w-[50%] h-[40%] rounded-full blur-[100px] animate-parallax-zoom-mid animate-drift-subtle"
          style={{ background: 'radial-gradient(circle, rgba(255,240,245,0.6) 0%, rgba(255,200,220,0.2) 50%, transparent 70%)', animationDelay: '-30s' }}
        />
      </div>

      {/* === FRONT LAYER - Fastest zoom (30s) === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left highlight */}
        <div 
          className="absolute -top-[5%] -left-[5%] w-[35%] h-[30%] rounded-full blur-[60px] animate-parallax-zoom-fast"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,230,240,0.3) 50%, transparent 70%)' }}
        />
        {/* Top-right highlight */}
        <div 
          className="absolute -top-[8%] -right-[5%] w-[30%] h-[35%] rounded-full blur-[50px] animate-parallax-zoom-fast"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,220,235,0.25) 45%, transparent 70%)', animationDelay: '-10s' }}
        />
        {/* Bottom-left accent */}
        <div 
          className="absolute bottom-[5%] -left-[8%] w-[35%] h-[30%] rounded-full blur-[70px] animate-parallax-zoom-fast animate-drift-subtle"
          style={{ background: 'radial-gradient(circle, rgba(255,210,225,0.5) 0%, transparent 65%)', animationDelay: '-20s' }}
        />
        {/* Bottom-right accent */}
        <div 
          className="absolute bottom-[10%] -right-[5%] w-[30%] h-[25%] rounded-full blur-[60px] animate-parallax-zoom-fast"
          style={{ background: 'radial-gradient(circle, rgba(255,200,220,0.45) 0%, transparent 60%)', animationDelay: '-25s' }}
        />
      </div>

      {/* === SUBTLE WHITE HIGHLIGHTS === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[20%] left-[30%] w-[15%] h-[15%] rounded-full blur-[40px] animate-breathe"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-[40%] right-[25%] w-[12%] h-[12%] rounded-full blur-[35px] animate-breathe-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)', animationDelay: '-4s' }}
        />
      </div>
    </>
  );
};
