// MUMS FUTUREPLAY - Ambient Background Graphics
// Visible soft clouds with slow breathing animations

export const BackgroundGraphics = () => {
  return (
    <>
      {/* Left side clouds */}
      <div className="absolute left-0 top-0 bottom-0 w-[50%] pointer-events-none overflow-hidden">
        <div 
          className="absolute -left-[10%] top-[0%] w-full h-[45%] rounded-full bg-black/[0.18] blur-[80px] animate-breathe"
        />
        <div 
          className="absolute -left-[5%] top-[35%] w-[80%] h-[40%] rounded-full bg-black/[0.20] blur-[60px] animate-breathe-slow"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute -left-[8%] top-[65%] w-[70%] h-[35%] rounded-full bg-black/[0.15] blur-[70px] animate-breathe"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Right side clouds */}
      <div className="absolute right-0 top-0 bottom-0 w-[50%] pointer-events-none overflow-hidden">
        <div 
          className="absolute -right-[10%] top-[-5%] w-full h-[40%] rounded-full bg-black/[0.18] blur-[80px] animate-breathe-slow"
          style={{ animationDelay: '1s' }}
        />
        <div 
          className="absolute -right-[5%] top-[30%] w-[85%] h-[42%] rounded-full bg-black/[0.20] blur-[60px] animate-breathe"
          style={{ animationDelay: '3s' }}
        />
        <div 
          className="absolute -right-[8%] top-[62%] w-[75%] h-[38%] rounded-full bg-black/[0.15] blur-[70px] animate-breathe-slow"
          style={{ animationDelay: '5s' }}
        />
      </div>

      {/* Top glow */}
      <div 
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90%] h-[30%] rounded-full bg-black/[0.12] blur-[100px] animate-breathe"
        style={{ animationDelay: '2.5s' }}
      />

      {/* Bottom glow */}
      <div 
        className="absolute -bottom-[10%] left-1/2 -translate-x-1/2 w-[100%] h-[25%] rounded-full bg-black/[0.12] blur-[100px] animate-breathe-slow"
        style={{ animationDelay: '3.5s' }}
      />
    </>
  );
};
