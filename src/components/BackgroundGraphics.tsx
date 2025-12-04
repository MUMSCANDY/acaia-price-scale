// MUMS FUTUREPLAY - Ambient Background Graphics
// Soft clouds and gradients with slow breathing animations

export const BackgroundGraphics = () => {
  return (
    <>
      {/* Left side clouds/gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-[40%] pointer-events-none overflow-hidden">
        {/* Large soft cloud blob */}
        <div 
          className="absolute -left-[20%] top-[10%] w-[80%] h-[35%] rounded-full bg-foreground/[0.04] blur-3xl animate-breathe"
          style={{ animationDelay: '0s' }}
        />
        
        {/* Medium cloud */}
        <div 
          className="absolute -left-[15%] top-[45%] w-[60%] h-[25%] rounded-full bg-foreground/[0.05] blur-2xl animate-breathe-slow"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Small accent cloud */}
        <div 
          className="absolute -left-[10%] top-[75%] w-[50%] h-[20%] rounded-full bg-foreground/[0.03] blur-3xl animate-breathe"
          style={{ animationDelay: '4s' }}
        />

        {/* Subtle gradient overlay */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-full opacity-30"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--foreground) / 0.06) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Right side clouds/gradients */}
      <div className="absolute right-0 top-0 bottom-0 w-[40%] pointer-events-none overflow-hidden">
        {/* Large soft cloud blob */}
        <div 
          className="absolute -right-[20%] top-[5%] w-[80%] h-[30%] rounded-full bg-foreground/[0.04] blur-3xl animate-breathe-slow"
          style={{ animationDelay: '1s' }}
        />
        
        {/* Medium cloud */}
        <div 
          className="absolute -right-[15%] top-[40%] w-[65%] h-[28%] rounded-full bg-foreground/[0.05] blur-2xl animate-breathe"
          style={{ animationDelay: '3s' }}
        />
        
        {/* Small accent cloud */}
        <div 
          className="absolute -right-[10%] top-[72%] w-[55%] h-[22%] rounded-full bg-foreground/[0.03] blur-3xl animate-breathe-slow"
          style={{ animationDelay: '5s' }}
        />

        {/* Subtle gradient overlay */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-full opacity-30"
          style={{
            background: 'linear-gradient(270deg, hsl(var(--foreground) / 0.06) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Top ambient glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[15%] rounded-full bg-foreground/[0.02] blur-3xl animate-breathe"
        style={{ animationDelay: '2.5s' }}
      />

      {/* Bottom ambient glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[12%] rounded-full bg-foreground/[0.02] blur-3xl animate-breathe-slow"
        style={{ animationDelay: '3.5s' }}
      />
    </>
  );
};
