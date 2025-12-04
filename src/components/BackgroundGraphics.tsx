// MUMS FUTUREPLAY - Gen-Z Stylish Background Graphics
// Swedish Bubs-style candy silhouettes with subtle animations

export const BackgroundGraphics = () => {
  return (
    <>
      {/* Left side graphics */}
      <div className="absolute left-0 top-0 bottom-0 w-36 pointer-events-none opacity-[0.15] overflow-hidden">
        
        {/* Bubs Skull - iconic Swedish candy */}
        <svg className="absolute left-4 top-[8%] w-16 h-18 animate-float-slow" viewBox="0 0 60 70" fill="currentColor">
          <ellipse cx="30" cy="28" rx="26" ry="24" className="text-foreground"/>
          <ellipse cx="18" cy="26" rx="7" ry="9" fill="hsl(var(--background))"/>
          <ellipse cx="42" cy="26" rx="7" ry="9" fill="hsl(var(--background))"/>
          <ellipse cx="30" cy="40" rx="4" ry="5" fill="hsl(var(--background))"/>
          <rect x="14" y="52" width="8" height="14" rx="2" className="text-foreground"/>
          <rect x="26" y="52" width="8" height="14" rx="2" className="text-foreground"/>
          <rect x="38" y="52" width="8" height="14" rx="2" className="text-foreground"/>
        </svg>

        {/* Simple gummy bear silhouette */}
        <svg className="absolute -left-2 top-[28%] w-14 h-16 animate-float-medium" viewBox="0 0 50 60" fill="currentColor">
          <circle cx="25" cy="14" r="12" className="text-foreground"/>
          <circle cx="14" cy="6" r="5" className="text-foreground"/>
          <circle cx="36" cy="6" r="5" className="text-foreground"/>
          <ellipse cx="25" cy="38" rx="16" ry="18" className="text-foreground"/>
          <ellipse cx="8" cy="35" rx="6" ry="10" className="text-foreground"/>
          <ellipse cx="42" cy="35" rx="6" ry="10" className="text-foreground"/>
        </svg>

        {/* Cola bottle - chunky Bubs style */}
        <svg className="absolute left-6 top-[48%] w-10 h-20 animate-wiggle" viewBox="0 0 40 80" fill="currentColor">
          <rect x="12" y="0" width="16" height="10" rx="3" className="text-foreground"/>
          <path d="M14 10 L14 22 Q8 28 8 45 Q8 75 20 78 Q32 75 32 45 Q32 28 26 22 L26 10" className="text-foreground"/>
        </svg>

        {/* Simple round gummy */}
        <div className="absolute left-8 top-[70%] w-12 h-12 rounded-full bg-foreground animate-float-reverse"/>
        
        {/* Small oval gummy */}
        <div className="absolute left-2 top-[85%] w-10 h-7 rounded-full bg-foreground animate-float-slow" style={{ animationDelay: '1s' }}/>

        {/* Floating dots */}
        <div className="absolute left-12 top-[22%] w-4 h-4 rounded-full bg-foreground animate-float-slow" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute left-4 top-[42%] w-3 h-3 rounded-full bg-foreground animate-float-medium" style={{ animationDelay: '1.5s' }}/>
        <div className="absolute left-16 top-[62%] w-3 h-3 rounded-full bg-foreground animate-wiggle" style={{ animationDelay: '2s' }}/>
      </div>

      {/* Right side graphics */}
      <div className="absolute right-0 top-0 bottom-0 w-36 pointer-events-none opacity-[0.15] overflow-hidden">
        
        {/* Heart candy - Bubs style solid */}
        <svg className="absolute right-4 top-[10%] w-14 h-14 animate-float-medium" viewBox="0 0 60 55" fill="currentColor">
          <path d="M30 50 Q5 30 5 18 Q5 5 18 5 Q30 5 30 18 Q30 5 42 5 Q55 5 55 18 Q55 30 30 50" className="text-foreground"/>
        </svg>

        {/* Raspberry/berry - bumpy surface */}
        <svg className="absolute -right-2 top-[30%] w-14 h-16 animate-float-slow" viewBox="0 0 50 60" fill="currentColor">
          <circle cx="25" cy="30" r="6" className="text-foreground"/>
          <circle cx="16" cy="24" r="6" className="text-foreground"/>
          <circle cx="34" cy="24" r="6" className="text-foreground"/>
          <circle cx="13" cy="34" r="6" className="text-foreground"/>
          <circle cx="37" cy="34" r="6" className="text-foreground"/>
          <circle cx="18" cy="42" r="6" className="text-foreground"/>
          <circle cx="32" cy="42" r="6" className="text-foreground"/>
          <circle cx="25" cy="48" r="5" className="text-foreground"/>
          <rect x="22" y="8" width="6" height="12" rx="2" className="text-foreground"/>
        </svg>

        {/* Worm/sour snake - wavy */}
        <svg className="absolute right-6 top-[52%] w-20 h-10 animate-wiggle" viewBox="0 0 80 40" fill="currentColor">
          <path d="M8 20 Q18 5 28 20 Q38 35 48 20 Q58 5 68 20 Q73 27 72 32 Q68 38 62 32 Q52 15 42 30 Q32 45 22 30 Q12 15 6 28 Q4 32 8 20" className="text-foreground"/>
        </svg>

        {/* Simple skull - smaller */}
        <svg className="absolute right-2 top-[72%] w-12 h-14 animate-float-reverse" viewBox="0 0 50 60" fill="currentColor">
          <ellipse cx="25" cy="22" rx="22" ry="20" className="text-foreground"/>
          <ellipse cx="16" cy="20" rx="5" ry="7" fill="hsl(var(--background))"/>
          <ellipse cx="34" cy="20" rx="5" ry="7" fill="hsl(var(--background))"/>
          <ellipse cx="25" cy="32" rx="3" ry="4" fill="hsl(var(--background))"/>
          <rect x="12" y="42" width="6" height="12" rx="2" className="text-foreground"/>
          <rect x="22" y="42" width="6" height="12" rx="2" className="text-foreground"/>
          <rect x="32" y="42" width="6" height="12" rx="2" className="text-foreground"/>
        </svg>

        {/* Floating gummies */}
        <div className="absolute right-10 top-[18%] w-5 h-5 rounded-full bg-foreground animate-float-reverse" style={{ animationDelay: '0.8s' }}/>
        <div className="absolute right-16 top-[45%] w-4 h-4 rounded-full bg-foreground animate-float-slow" style={{ animationDelay: '1.2s' }}/>
        <div className="absolute right-6 top-[88%] w-8 h-6 rounded-full bg-foreground animate-float-medium" style={{ animationDelay: '0.3s' }}/>
      </div>
    </>
  );
};
