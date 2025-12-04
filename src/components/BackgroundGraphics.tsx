// MUMS FUTUREPLAY - Ambient Background Graphics
// Soft clouds and gradients with slow breathing animations

export const BackgroundGraphics = () => {
  return (
    <>
      {/* Left side clouds/gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-[45%] pointer-events-none overflow-hidden">
        {/* Large soft cloud blob */}
        <div 
          className="absolute -left-[15%] top-[5%] w-[90%] h-[40%] rounded-full bg-foreground/[0.12] blur-3xl animate-breathe"
          style={{ animationDelay: '0s' }}
        />
        
        {/* Medium cloud */}
        <div 
          className="absolute -left-[10%] top-[40%] w-[70%] h-[30%] rounded-full bg-foreground/[0.15] blur-2xl animate-breathe-slow"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Small accent cloud */}
        <div 
          className="absolute -left-[5%] top-[70%] w-[60%] h-[25%] rounded-full bg-foreground/[0.10] blur-3xl animate-breathe"
          style={{ animationDelay: '4s' }}
        />

        {/* Subtle gradient overlay */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-full"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--foreground) / 0.08) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Right side clouds/gradients */}
      <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none overflow-hidden">
        {/* Large soft cloud blob */}
        <div 
          className="absolute -right-[15%] top-[0%] w-[90%] h-[35%] rounded-full bg-foreground/[0.12] blur-3xl animate-breathe-slow"
          style={{ animationDelay: '1s' }}
        />
        
        {/* Medium cloud */}
        <div 
          className="absolute -right-[10%] top-[35%] w-[75%] h-[32%] rounded-full bg-foreground/[0.15] blur-2xl animate-breathe"
          style={{ animationDelay: '3s' }}
        />
        
        {/* Small accent cloud */}
        <div 
          className="absolute -right-[5%] top-[68%] w-[65%] h-[28%] rounded-full bg-foreground/[0.10] blur-3xl animate-breathe-slow"
          style={{ animationDelay: '5s' }}
        />

        {/* Subtle gradient overlay */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-full"
          style={{
            background: 'linear-gradient(270deg, hsl(var(--foreground) / 0.08) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Top ambient glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[20%] rounded-full bg-foreground/[0.08] blur-3xl animate-breathe"
        style={{ animationDelay: '2.5s' }}
      />

      {/* Bottom ambient glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[18%] rounded-full bg-foreground/[0.08] blur-3xl animate-breathe-slow"
        style={{ animationDelay: '3.5s' }}
      />
    </>
  );
};
