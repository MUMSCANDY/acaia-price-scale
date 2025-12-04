// MUMS FUTUREPLAY - Gen-Z Stylish Background Graphics
// Swedish candy silhouettes with subtle animations

export const BackgroundGraphics = () => {
  return (
    <>
      {/* Left side graphics */}
      <div className="absolute left-0 top-0 bottom-0 w-40 pointer-events-none opacity-[0.15] overflow-hidden">
        
        {/* Bubs Skull - iconic Swedish candy */}
        <svg className="absolute left-4 top-[5%] w-14 h-16 animate-float-slow" viewBox="0 0 60 70" fill="currentColor">
          <ellipse cx="30" cy="28" rx="26" ry="24" className="text-foreground"/>
          <ellipse cx="18" cy="26" rx="7" ry="9" fill="hsl(var(--background))"/>
          <ellipse cx="42" cy="26" rx="7" ry="9" fill="hsl(var(--background))"/>
          <ellipse cx="30" cy="40" rx="4" ry="5" fill="hsl(var(--background))"/>
          <rect x="14" y="52" width="8" height="14" rx="2" className="text-foreground"/>
          <rect x="26" y="52" width="8" height="14" rx="2" className="text-foreground"/>
          <rect x="38" y="52" width="8" height="14" rx="2" className="text-foreground"/>
        </svg>

        {/* Cherry - twin cherries */}
        <svg className="absolute -left-1 top-[22%] w-16 h-18 animate-float-medium" viewBox="0 0 60 70" fill="currentColor">
          {/* Stem */}
          <path d="M30 8 Q38 15 34 30 M30 8 Q22 18 26 32" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground"/>
          {/* Leaf */}
          <ellipse cx="36" cy="10" rx="8" ry="5" className="text-foreground" transform="rotate(25 36 10)"/>
          {/* Cherries */}
          <circle cx="22" cy="48" r="16" className="text-foreground"/>
          <circle cx="42" cy="52" r="14" className="text-foreground"/>
        </svg>

        {/* Banana */}
        <svg className="absolute left-6 top-[40%] w-18 h-12 animate-wiggle" viewBox="0 0 70 45" fill="currentColor">
          <path d="M8 35 Q5 20 15 12 Q30 2 55 8 Q65 12 62 18 Q58 24 45 22 Q25 18 15 28 Q10 35 8 35 Z" className="text-foreground"/>
        </svg>

        {/* Soother/Pacifier - Swedish napp candy */}
        <svg className="absolute left-2 top-[55%] w-14 h-14 animate-float-reverse" viewBox="0 0 55 55" fill="currentColor">
          {/* Shield/guard */}
          <ellipse cx="28" cy="30" rx="22" ry="18" className="text-foreground"/>
          <ellipse cx="28" cy="30" rx="12" ry="10" fill="hsl(var(--background))"/>
          {/* Nipple */}
          <ellipse cx="28" cy="48" rx="8" ry="6" className="text-foreground"/>
          {/* Ring */}
          <circle cx="28" cy="10" r="8" stroke="currentColor" strokeWidth="4" fill="hsl(var(--background))" className="text-foreground"/>
        </svg>

        {/* Cola Bottle */}
        <svg className="absolute left-8 top-[72%] w-10 h-18 animate-float-slow" style={{ animationDelay: '1s' }} viewBox="0 0 40 75" fill="currentColor">
          <rect x="14" y="2" width="12" height="10" rx="2" className="text-foreground"/>
          <path d="M15 12 L15 20 Q10 26 10 40 Q10 68 20 72 Q30 68 30 40 Q30 26 25 20 L25 12" className="text-foreground"/>
        </svg>

        {/* Floating gummies */}
        <div className="absolute left-14 top-[18%] w-4 h-4 rounded-full bg-foreground animate-float-slow" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute left-4 top-[36%] w-3 h-3 rounded-full bg-foreground animate-float-medium" style={{ animationDelay: '1.5s' }}/>
        <div className="absolute left-18 top-[66%] w-3 h-3 rounded-full bg-foreground animate-wiggle" style={{ animationDelay: '2s' }}/>
        <div className="absolute left-6 top-[90%] w-5 h-5 rounded-full bg-foreground animate-float-reverse" style={{ animationDelay: '0.8s' }}/>
      </div>

      {/* Right side graphics */}
      <div className="absolute right-0 top-0 bottom-0 w-40 pointer-events-none opacity-[0.15] overflow-hidden">
        
        {/* Heart candy */}
        <svg className="absolute right-4 top-[6%] w-14 h-13 animate-float-medium" viewBox="0 0 60 55" fill="currentColor">
          <path d="M30 50 Q5 30 5 18 Q5 5 18 5 Q30 5 30 18 Q30 5 42 5 Q55 5 55 18 Q55 30 30 50" className="text-foreground"/>
        </svg>

        {/* Swedish Fish - upgraded */}
        <svg className="absolute -right-2 top-[22%] w-20 h-12 animate-float-slow" viewBox="0 0 80 50" fill="currentColor">
          {/* Body */}
          <ellipse cx="35" cy="25" rx="28" ry="16" className="text-foreground"/>
          {/* Tail */}
          <path d="M63 25 L78 10 L78 40 Z" className="text-foreground"/>
          {/* Eye */}
          <circle cx="18" cy="22" r="4" fill="hsl(var(--background))"/>
          {/* Top fin */}
          <path d="M35 9 Q42 2 48 9" className="text-foreground"/>
        </svg>

        {/* Raspberry */}
        <svg className="absolute right-6 top-[38%] w-12 h-14 animate-wiggle" viewBox="0 0 45 55" fill="currentColor">
          <circle cx="22" cy="28" r="5" className="text-foreground"/>
          <circle cx="14" cy="23" r="5" className="text-foreground"/>
          <circle cx="30" cy="23" r="5" className="text-foreground"/>
          <circle cx="11" cy="32" r="5" className="text-foreground"/>
          <circle cx="33" cy="32" r="5" className="text-foreground"/>
          <circle cx="16" cy="40" r="5" className="text-foreground"/>
          <circle cx="28" cy="40" r="5" className="text-foreground"/>
          <circle cx="22" cy="46" r="4" className="text-foreground"/>
          {/* Stem */}
          <rect x="19" y="6" width="6" height="10" rx="2" className="text-foreground"/>
        </svg>

        {/* Lips/Mouth candy */}
        <svg className="absolute right-2 top-[54%] w-16 h-10 animate-float-reverse" viewBox="0 0 60 38" fill="currentColor">
          <path d="M5 20 Q15 8 30 8 Q45 8 55 20 Q45 35 30 35 Q15 35 5 20 Z" className="text-foreground"/>
          <path d="M12 20 Q30 28 48 20" stroke="hsl(var(--background))" strokeWidth="3" fill="none"/>
        </svg>

        {/* Sour Worm */}
        <svg className="absolute right-8 top-[68%] w-18 h-10 animate-wiggle" style={{ animationDelay: '0.5s' }} viewBox="0 0 70 40" fill="currentColor">
          <path d="M6 20 Q14 6 24 20 Q34 34 44 20 Q54 6 64 16 Q68 22 64 26 Q56 18 46 30 Q36 42 26 28 Q16 14 8 26 Q4 30 6 20 Z" className="text-foreground"/>
        </svg>

        {/* Car candy (Ahlgrens bilar) */}
        <svg className="absolute -right-1 top-[82%] w-16 h-10 animate-float-slow" style={{ animationDelay: '1.2s' }} viewBox="0 0 65 40" fill="currentColor">
          {/* Body */}
          <path d="M8 28 L8 20 L18 20 L22 12 L48 12 L52 20 L58 20 L58 28 Z" className="text-foreground"/>
          {/* Wheels */}
          <circle cx="18" cy="30" r="6" className="text-foreground"/>
          <circle cx="48" cy="30" r="6" className="text-foreground"/>
          <circle cx="18" cy="30" r="3" fill="hsl(var(--background))"/>
          <circle cx="48" cy="30" r="3" fill="hsl(var(--background))"/>
          {/* Window */}
          <path d="M24 14 L26 20 L44 20 L46 14 Z" fill="hsl(var(--background))"/>
        </svg>

        {/* Floating gummies */}
        <div className="absolute right-12 top-[15%] w-4 h-4 rounded-full bg-foreground animate-float-reverse" style={{ animationDelay: '0.8s' }}/>
        <div className="absolute right-18 top-[48%] w-3 h-3 rounded-full bg-foreground animate-float-slow" style={{ animationDelay: '1.2s' }}/>
        <div className="absolute right-6 top-[78%] w-3 h-3 rounded-full bg-foreground animate-float-medium" style={{ animationDelay: '0.3s' }}/>
      </div>
    </>
  );
};
