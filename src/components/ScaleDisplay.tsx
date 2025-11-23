import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Wifi, WifiOff, Battery, HelpCircle, Scale, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsPanel } from "./SettingsPanel";
import { PinDialog } from "./PinDialog";
import { ConnectionHelpDialog } from "./ConnectionHelpDialog";
import { getCurrencyByCode } from "@/lib/currencies";
interface ScaleDisplayProps {
  weight: number;
  isConnected: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected";
  battery: number;
  onTare: () => void;
  onToggleConnection: () => void;
}
export const ScaleDisplay = ({
  weight,
  isConnected,
  connectionStatus,
  battery,
  onTare,
  onToggleConnection
}: ScaleDisplayProps) => {
  const [pricePerHundred, setPricePerHundred] = useState(89);
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "THB");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  // Save transaction history
  useEffect(() => {
    if (weight > 0 && isConnected) {
      const transaction = {
        timestamp: new Date().toISOString(),
        weight,
        pricePerHundred,
        totalPrice: calculatePrice()
      };
      const history = JSON.parse(localStorage.getItem("transactionHistory") || "[]");
      history.push(transaction);

      // Keep only last 1000 transactions
      if (history.length > 1000) {
        history.shift();
      }
      localStorage.setItem("transactionHistory", JSON.stringify(history));
    }
  }, [weight, isConnected]);
  const handleSettingsClick = () => {
    setIsPinDialogOpen(true);
  };
  const handlePinSuccess = () => {
    setIsPinDialogOpen(false);
    setIsSettingsOpen(true);
  };

  // Calculate total price
  const calculatePrice = () => {
    const pricePerGram = pricePerHundred / 100;
    const total = Math.ceil(weight * pricePerGram);
    return total;
  };
  return <div className="min-h-screen gradient-mesh-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-foreground/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-foreground/5 rounded-full blur-3xl animate-float" style={{
        animationDelay: '3s'
      }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-foreground/3 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-12 pt-10 animate-slide-up">
        <h1 className="text-brand text-5xl tracking-tighter">
          MUMS
        </h1>
        
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className={cn("flex items-center gap-3 px-5 py-3 rounded-full glass-effect border-2 border-foreground transition-all duration-300", connectionStatus === "connected" && "shadow-glow")}>
            {connectionStatus === "connected" ? <>
                <Wifi className="w-5 h-5" />
                <span className="font-bold text-sm">Connected</span>
              </> : connectionStatus === "connecting" ? <>
                <Wifi className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm">Connecting...</span>
              </> : <>
                <WifiOff className="w-5 h-5" />
                <span className="font-bold text-sm">Offline</span>
              </>}
          </div>

          {/* Battery */}
          <div className="flex items-center gap-3 px-5 py-3 glass-effect rounded-full border-2 border-foreground">
            <Battery className="w-5 h-5 text-foreground" />
            <span className="font-bold text-sm text-foreground">{battery}%</span>
          </div>

          {/* Settings Button */}
          <Button variant="ghost" size="icon" onClick={handleSettingsClick} className="rounded-full w-14 h-14 glass-effect border-2 border-foreground hover:bg-foreground/10 hover:scale-110">
            <Settings className="w-7 h-7" />
          </Button>
        </div>
      </header>

      {/* Main Display */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-12 py-20">
        {/* Weight Display */}
        <div className="mb-12 text-center animate-scale-in">
          <div className="text-display text-[200px] leading-none mb-4 drop-shadow-2xl">
            {weight.toFixed(1)}
            <span className="text-[140px] ml-6 font-bold">g</span>
          </div>
        </div>

        {/* Price Display - Receipt Style */}
        <div className="mb-8 bg-background/40 backdrop-blur-sm rounded-xl border-[3px] border-foreground hover-lift animate-slide-up relative overflow-hidden w-[600px]" style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, transparent 100%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)
          `
        }}>
          <div className="px-8 py-5">
            {/* Total Section - Centered, Large */}
            <div className="text-center mb-3" key={`${calculatePrice()}-${currency}`}>
              <div className="text-sm font-bold text-foreground/70 tracking-widest mb-1">TOTAL</div>
              <div className="text-display text-[100px] leading-none text-foreground animate-fade-in">
                {getCurrencyByCode(currency).symbol}{calculatePrice()}
              </div>
            </div>
            
            {/* Dotted separator */}
            <div className="border-t border-dotted border-foreground/40 my-3" />
            
            {/* Per 100g info */}
            <div className="text-center font-mono text-base text-foreground/70 mb-3">
              (Price per 100 g: {getCurrencyByCode(currency).symbol}{pricePerHundred})
            </div>
            
            {/* Footer - Barcode */}
            <div className="flex justify-center gap-0.5 mb-1">
              {Array.from({length: 40}).map((_, i) => (
                <div key={i} className="w-0.5 h-3 bg-foreground/40" />
              ))}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-5 items-center justify-center animate-slide-up" style={{
        animationDelay: '0.1s'
      }}>
          <button onClick={isConnected ? onTare : undefined} disabled={!isConnected} className={cn("flex items-center gap-3 px-8 py-3 rounded-full glass-effect border-2 border-foreground transition-all duration-300 font-bold text-base", isConnected ? "hover:bg-foreground/10 hover:scale-110 cursor-pointer" : "cursor-not-allowed")}>
            <Scale className="w-5 h-5" />
            <span>TARE</span>
          </button>

          <Button size="lg" variant={isConnected ? "outline" : "default"} onClick={onToggleConnection} className="px-8 py-6 text-base font-bold rounded-full">
            <Power className="w-5 h-5" />
            {isConnected ? "DISCONNECT" : "CONNECT"}
          </Button>
        </div>
      </main>

      {/* Help Button - Fixed to bottom right */}
      <div className="fixed bottom-8 right-8 z-20 animate-scale-in" style={{
      animationDelay: '0.2s'
    }}>
        <Button size="lg" variant="ghost" onClick={() => setIsHelpDialogOpen(true)} className="w-16 h-16 rounded-full glass-effect border-2 border-foreground hover:bg-foreground/10 hover:scale-110" title="Need Help?">
          <HelpCircle className="w-8 h-8" />
        </Button>
      </div>

      {/* PIN Dialog */}
      <PinDialog isOpen={isPinDialogOpen} onClose={() => setIsPinDialogOpen(false)} onSuccess={handlePinSuccess} />

      {/* Connection Help Dialog */}
      <ConnectionHelpDialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} pricePerHundred={pricePerHundred} onPriceChange={setPricePerHundred} currency={currency} onCurrencyChange={setCurrency} />
    </div>;
};