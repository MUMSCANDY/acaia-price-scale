// MUMS FUTUREPLAY - Gen-Z Stylish Background Graphics
// Bubs-style Swedish candy shapes with subtle animations

export const BackgroundGraphics = () => {
  return (
    <>
      {/* Left side graphics */}
      <div className="absolute left-0 top-0 bottom-0 w-40 pointer-events-none opacity-[0.12] overflow-hidden">
        
        {/* Gummy Bear shape */}
        <svg className="absolute left-2 top-[8%] w-20 h-24 animate-float-slow" viewBox="0 0 80 100" fill="none">
          {/* Head */}
          <circle cx="40" cy="22" r="18" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          {/* Ears */}
          <circle cx="26" cy="10" r="8" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <circle cx="54" cy="10" r="8" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          {/* Body */}
          <ellipse cx="40" cy="58" rx="22" ry="28" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          {/* Arms */}
          <ellipse cx="14" cy="52" rx="8" ry="14" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <ellipse cx="66" cy="52" rx="8" ry="14" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          {/* Legs */}
          <ellipse cx="28" cy="88" rx="10" ry="10" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <ellipse cx="52" cy="88" rx="10" ry="10" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
        </svg>

        {/* Cola Bottle shape */}
        <svg className="absolute -left-2 top-[30%] w-16 h-28 animate-float-medium" viewBox="0 0 60 110" fill="none">
          {/* Cap */}
          <rect x="20" y="2" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          {/* Neck */}
          <path d="M22 14 L22 28 Q22 32 26 34 L34 34 Q38 32 38 28 L38 14" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-foreground"/>
          {/* Body */}
          <path d="M26 34 Q10 50 10 70 Q10 100 30 105 Q50 100 50 70 Q50 50 34 34" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground"/>
        </svg>

        {/* Skull shape (Bubs style) */}
        <svg className="absolute left-6 top-[52%] w-18 h-20 animate-wiggle" viewBox="0 0 80 90" fill="none">
          {/* Skull top */}
          <ellipse cx="40" cy="35" rx="32" ry="30" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          {/* Eye sockets */}
          <ellipse cx="28" cy="35" rx="10" ry="12" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <ellipse cx="52" cy="35" rx="10" ry="12" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          {/* Nose */}
          <path d="M40 45 L36 55 L44 55 Z" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
          {/* Jaw/teeth area */}
          <path d="M20 60 Q40 75 60 60" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-foreground"/>
          <line x1="30" y1="62" x2="30" y2="70" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
          <line x1="40" y1="65" x2="40" y2="73" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
          <line x1="50" y1="62" x2="50" y2="70" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
        </svg>

        {/* Cherry shape */}
        <svg className="absolute -left-1 top-[75%] w-20 h-24 animate-float-reverse" viewBox="0 0 80 100" fill="none">
          {/* Stem */}
          <path d="M40 5 Q50 20 45 40 M40 5 Q30 25 35 45" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
          {/* Cherries */}
          <circle cx="28" cy="60" r="18" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          <circle cx="52" cy="65" r="16" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          {/* Leaf */}
          <ellipse cx="48" cy="12" rx="12" ry="6" stroke="currentColor" strokeWidth="2" className="text-foreground" transform="rotate(30 48 12)"/>
        </svg>

        {/* Floating dots */}
        <div className="absolute left-10 top-[22%] w-4 h-4 rounded-full bg-foreground animate-float-slow" style={{ animationDelay: '1s' }}/>
        <div className="absolute left-16 top-[45%] w-3 h-3 rounded-full bg-foreground animate-float-medium" style={{ animationDelay: '2s' }}/>
        <div className="absolute left-4 top-[68%] w-5 h-5 rounded-full bg-foreground animate-float-reverse" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute left-20 top-[88%] w-3 h-3 rounded-full bg-foreground animate-wiggle" style={{ animationDelay: '1.5s' }}/>
      </div>

      {/* Right side graphics */}
      <div className="absolute right-0 top-0 bottom-0 w-40 pointer-events-none opacity-[0.12] overflow-hidden">
        
        {/* Raspberry/Berry shape */}
        <svg className="absolute right-4 top-[10%] w-20 h-24 animate-float-medium" viewBox="0 0 80 100" fill="none">
          {/* Berry bumps */}
          <circle cx="40" cy="50" r="8" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <circle cx="28" cy="42" r="8" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <circle cx="52" cy="42" r="8" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <circle cx="24" cy="55" r="8" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <circle cx="56" cy="55" r="8" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <circle cx="32" cy="65" r="8" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <circle cx="48" cy="65" r="8" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          <circle cx="40" cy="75" r="7" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
          {/* Stem */}
          <path d="M40 28 L40 18" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          {/* Leaves */}
          <path d="M40 20 Q32 15 28 22 M40 20 Q48 15 52 22" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
        </svg>

        {/* Heart shape */}
        <svg className="absolute -right-2 top-[32%] w-18 h-18 animate-float-slow" viewBox="0 0 80 80" fill="none">
          <path d="M40 70 Q10 45 10 28 Q10 10 28 10 Q40 10 40 25 Q40 10 52 10 Q70 10 70 28 Q70 45 40 70" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground"/>
        </svg>

        {/* Worm/Snake candy */}
        <svg className="absolute right-6 top-[50%] w-24 h-16 animate-wiggle" viewBox="0 0 100 60" fill="none">
          <path d="M10 30 Q25 10 40 30 Q55 50 70 30 Q85 10 95 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" className="text-foreground"/>
          {/* Eyes */}
          <circle cx="12" cy="30" r="4" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
        </svg>

        {/* Ring/Donut candy */}
        <svg className="absolute right-2 top-[70%] w-20 h-20 animate-spin-slow" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="4" className="text-foreground"/>
          <circle cx="40" cy="40" r="14" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
        </svg>

        {/* Fish shape (Swedish fish style) */}
        <svg className="absolute -right-4 bottom-[8%] w-24 h-16 animate-float-reverse" viewBox="0 0 100 60" fill="none">
          {/* Body */}
          <ellipse cx="45" cy="30" rx="35" ry="20" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          {/* Tail */}
          <path d="M80 30 L100 15 L100 45 Z" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground"/>
          {/* Eye */}
          <circle cx="25" cy="25" r="5" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
          {/* Fin */}
          <path d="M45 10 Q55 0 60 10" stroke="currentColor" strokeWidth="2" fill="none" className="text-foreground"/>
        </svg>

        {/* Floating dots */}
        <div className="absolute right-12 top-[18%] w-3.5 h-3.5 rounded-full bg-foreground animate-float-reverse" style={{ animationDelay: '0.8s' }}/>
        <div className="absolute right-8 top-[42%] w-4 h-4 rounded-full bg-foreground animate-float-slow" style={{ animationDelay: '1.2s' }}/>
        <div className="absolute right-18 top-[62%] w-3 h-3 rounded-full bg-foreground animate-float-medium" style={{ animationDelay: '2.5s' }}/>
        <div className="absolute right-10 top-[85%] w-4.5 h-4.5 rounded-full bg-foreground animate-wiggle" style={{ animationDelay: '0.3s' }}/>
      </div>

      {/* Subtle corner accents */}
      <div className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-foreground/[0.08] rounded-tl-3xl pointer-events-none"/>
      <div className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-foreground/[0.08] rounded-tr-3xl pointer-events-none"/>
      <div className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-foreground/[0.08] rounded-bl-3xl pointer-events-none"/>
      <div className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-foreground/[0.08] rounded-br-3xl pointer-events-none"/>
    </>
  );
};
