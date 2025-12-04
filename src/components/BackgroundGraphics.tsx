// MUMS FUTUREPLAY - Gen-Z Stylish Background Graphics
// Abstract candy-themed decorative elements

export const BackgroundGraphics = () => {
  return (
    <>
      {/* Left side graphics */}
      <div className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none opacity-[0.08] overflow-hidden">
        {/* Abstract candy shapes */}
        <svg className="absolute -left-8 top-[10%] w-24 h-24 rotate-12" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
        </svg>
        
        <svg className="absolute left-4 top-[30%] w-16 h-16 -rotate-6" viewBox="0 0 100 100" fill="none">
          <rect x="15" y="15" width="70" height="70" rx="20" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
        </svg>
        
        <svg className="absolute -left-4 top-[50%] w-20 h-20 rotate-45" viewBox="0 0 100 100" fill="none">
          <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
        </svg>
        
        <svg className="absolute left-6 top-[70%] w-14 h-14 -rotate-12" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="25" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
        </svg>
        
        {/* Candy wrapper shape */}
        <svg className="absolute -left-2 bottom-[15%] w-28 h-16 rotate-6" viewBox="0 0 120 60" fill="none">
          <ellipse cx="60" cy="30" rx="30" ry="20" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          <path d="M30 30 L5 15 M30 30 L5 45" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
          <path d="M90 30 L115 15 M90 30 L115 45" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
        </svg>
        
        {/* Dots */}
        <div className="absolute left-8 top-[25%] w-3 h-3 rounded-full bg-foreground"/>
        <div className="absolute left-12 top-[45%] w-2 h-2 rounded-full bg-foreground"/>
        <div className="absolute left-4 top-[65%] w-4 h-4 rounded-full bg-foreground"/>
        <div className="absolute left-16 top-[85%] w-2.5 h-2.5 rounded-full bg-foreground"/>
      </div>

      {/* Right side graphics */}
      <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none opacity-[0.08] overflow-hidden">
        {/* Abstract candy shapes - mirrored/varied */}
        <svg className="absolute -right-6 top-[15%] w-20 h-20 -rotate-12" viewBox="0 0 100 100" fill="none">
          <path d="M50 10 Q90 50 50 90 Q10 50 50 10" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
        </svg>
        
        <svg className="absolute right-2 top-[35%] w-18 h-18 rotate-6" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" strokeDasharray="15 10" className="text-foreground"/>
        </svg>
        
        {/* Lollipop shape */}
        <svg className="absolute -right-4 top-[55%] w-16 h-28 -rotate-6" viewBox="0 0 60 100" fill="none">
          <circle cx="30" cy="25" r="20" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
          <line x1="30" y1="45" x2="30" y2="95" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
        </svg>
        
        <svg className="absolute right-8 top-[75%] w-14 h-14 rotate-45" viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" rx="15" stroke="currentColor" strokeWidth="3" className="text-foreground"/>
        </svg>
        
        {/* Star shape */}
        <svg className="absolute right-4 bottom-[10%] w-16 h-16 rotate-12" viewBox="0 0 100 100" fill="none">
          <path d="M50 5 L61 40 L98 40 L68 61 L79 96 L50 75 L21 96 L32 61 L2 40 L39 40 Z" stroke="currentColor" strokeWidth="2" className="text-foreground"/>
        </svg>
        
        {/* Dots */}
        <div className="absolute right-10 top-[20%] w-2.5 h-2.5 rounded-full bg-foreground"/>
        <div className="absolute right-6 top-[48%] w-3 h-3 rounded-full bg-foreground"/>
        <div className="absolute right-14 top-[68%] w-2 h-2 rounded-full bg-foreground"/>
        <div className="absolute right-8 top-[90%] w-3.5 h-3.5 rounded-full bg-foreground"/>
      </div>

      {/* Subtle corner accents */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-foreground/[0.06] rounded-tl-3xl pointer-events-none"/>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-foreground/[0.06] rounded-tr-3xl pointer-events-none"/>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-foreground/[0.06] rounded-bl-3xl pointer-events-none"/>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-foreground/[0.06] rounded-br-3xl pointer-events-none"/>
    </>
  );
};
