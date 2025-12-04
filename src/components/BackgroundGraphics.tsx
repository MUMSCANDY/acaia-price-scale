// MUMS FUTUREPLAY - Abstract Ambient Background
// Soft light clouds with breathing animations

export const BackgroundGraphics = () => {
  return (
    <>
      {/* Left side - soft white/light pink abstract shapes */}
      <div className="absolute left-0 top-0 bottom-0 w-[55%] pointer-events-none overflow-hidden">
        <div 
          className="absolute -left-[20%] top-[-10%] w-[100%] h-[50%] rounded-full blur-[120px] animate-breathe"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute -left-[15%] top-[30%] w-[80%] h-[45%] rounded-full blur-[100px] animate-breathe-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,220,230,0.4) 0%, transparent 70%)', animationDelay: '2s' }}
        />
        <div 
          className="absolute -left-[10%] top-[60%] w-[70%] h-[40%] rounded-full blur-[90px] animate-breathe"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)', animationDelay: '4s' }}
        />
      </div>

      {/* Right side - soft white/light pink abstract shapes */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none overflow-hidden">
        <div 
          className="absolute -right-[20%] top-[-5%] w-[100%] h-[45%] rounded-full blur-[120px] animate-breathe-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)', animationDelay: '1s' }}
        />
        <div 
          className="absolute -right-[15%] top-[35%] w-[85%] h-[50%] rounded-full blur-[100px] animate-breathe"
          style={{ background: 'radial-gradient(circle, rgba(255,220,230,0.4) 0%, transparent 70%)', animationDelay: '3s' }}
        />
        <div 
          className="absolute -right-[10%] top-[65%] w-[75%] h-[35%] rounded-full blur-[90px] animate-breathe-slow"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)', animationDelay: '5s' }}
        />
      </div>

      {/* Center top glow */}
      <div 
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[80%] h-[35%] rounded-full blur-[150px] animate-breathe"
        style={{ background: 'radial-gradient(circle, rgba(255,240,245,0.5) 0%, transparent 70%)', animationDelay: '2.5s' }}
      />

      {/* Center bottom glow */}
      <div 
        className="absolute -bottom-[15%] left-1/2 -translate-x-1/2 w-[90%] h-[30%] rounded-full blur-[150px] animate-breathe-slow"
        style={{ background: 'radial-gradient(circle, rgba(255,230,240,0.4) 0%, transparent 70%)', animationDelay: '3.5s' }}
      />
    </>
  );
};
