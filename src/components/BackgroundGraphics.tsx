// MUMS FUTUREPLAY - Apple-style Parallax Mesh Gradients
// Layered gradient orbs - MAXIMUM IMPACT

export const BackgroundGraphics = () => {
  return (
    <>
      {/* === BACK LAYER - Large dramatic orbs === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left MASSIVE orb */}
        <div 
          className="absolute -top-[10%] -left-[5%] w-[55%] h-[50%] rounded-full blur-[50px] animate-parallax-zoom-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,100,150,0.85) 0%, rgba(255,60,120,0.5) 40%, transparent 70%)' }}
        />
        {/* Top-right MASSIVE orb */}
        <div 
          className="absolute -top-[5%] -right-[10%] w-[50%] h-[45%] rounded-full blur-[45px] animate-parallax-zoom-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,130,170,0.8) 0%, rgba(255,80,140,0.45) 45%, transparent 70%)', animationDelay: '-12s' }}
        />
        {/* Bottom sweep */}
        <div 
          className="absolute -bottom-[15%] left-[10%] w-[80%] h-[40%] rounded-full blur-[60px] animate-parallax-zoom-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,90,145,0.6) 0%, transparent 65%)', animationDelay: '-25s' }}
        />
      </div>

      {/* === MID LAYER - Moving side panels === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left side intense */}
        <div 
          className="absolute top-[0%] -left-[3%] w-[35%] h-[60%] rounded-full blur-[40px] animate-parallax-zoom-mid animate-drift-dramatic"
          style={{ background: 'radial-gradient(ellipse 80% 100%, rgba(255,255,255,0.85) 0%, rgba(255,160,195,0.5) 40%, transparent 70%)' }}
        />
        {/* Right side intense */}
        <div 
          className="absolute top-[-5%] -right-[3%] w-[32%] h-[65%] rounded-full blur-[35px] animate-parallax-zoom-mid"
          style={{ background: 'radial-gradient(ellipse 75% 100%, rgba(255,255,255,0.8) 0%, rgba(255,140,180,0.45) 45%, transparent 70%)', animationDelay: '-8s' }}
        />
        {/* Top center bright */}
        <div 
          className="absolute -top-[3%] left-[15%] w-[70%] h-[30%] rounded-full blur-[50px] animate-parallax-zoom-mid animate-drift-dramatic"
          style={{ background: 'radial-gradient(circle, rgba(255,200,220,0.9) 0%, rgba(255,150,185,0.4) 50%, transparent 70%)', animationDelay: '-18s' }}
        />
      </div>

      {/* === FRONT LAYER - Punchy highlights === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left HOT spot */}
        <div 
          className="absolute top-[0%] left-[0%] w-[28%] h-[25%] rounded-full blur-[25px] animate-parallax-zoom-fast"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,180,210,0.6) 50%, transparent 70%)' }}
        />
        {/* Top-right HOT spot */}
        <div 
          className="absolute top-[-2%] right-[0%] w-[25%] h-[28%] rounded-full blur-[22px] animate-parallax-zoom-fast"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,170,200,0.55) 45%, transparent 70%)', animationDelay: '-6s' }}
        />
        {/* Bottom-left punch */}
        <div 
          className="absolute bottom-[5%] -left-[2%] w-[30%] h-[25%] rounded-full blur-[30px] animate-parallax-zoom-fast animate-drift-dramatic"
          style={{ background: 'radial-gradient(circle, rgba(255,120,165,0.75) 0%, transparent 65%)', animationDelay: '-12s' }}
        />
        {/* Bottom-right punch */}
        <div 
          className="absolute bottom-[8%] -right-[2%] w-[28%] h-[22%] rounded-full blur-[28px] animate-parallax-zoom-fast"
          style={{ background: 'radial-gradient(circle, rgba(255,110,160,0.7) 0%, transparent 60%)', animationDelay: '-15s' }}
        />
      </div>

      {/* === SPARKLE HIGHLIGHTS - White pops === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[12%] left-[20%] w-[20%] h-[20%] rounded-full blur-[20px] animate-breathe"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-[30%] right-[15%] w-[18%] h-[18%] rounded-full blur-[18px] animate-breathe-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.75) 0%, transparent 70%)', animationDelay: '-3s' }}
        />
        <div 
          className="absolute bottom-[20%] left-[35%] w-[22%] h-[18%] rounded-full blur-[22px] animate-breathe"
          style={{ background: 'radial-gradient(circle, rgba(255,230,242,0.7) 0%, transparent 65%)', animationDelay: '-5s' }}
        />
        <div 
          className="absolute top-[50%] left-[10%] w-[15%] h-[15%] rounded-full blur-[15px] animate-breathe-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.65) 0%, transparent 70%)', animationDelay: '-7s' }}
        />
      </div>
    </>
  );
};
