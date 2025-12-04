import { useState, useEffect } from "react";
import { Settings, Wifi, WifiOff, Battery, HelpCircle, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsPanel } from "./SettingsPanel";
import { PinDialog } from "./PinDialog";
import { ConnectionHelpDialog } from "./ConnectionHelpDialog";
import { getCurrencyByCode } from "@/lib/currencies";
import { HumorText } from "./HumorText";
import { UnifiedCandyCluster } from "./UnifiedCandyCluster";
import { getPriceTier, getTierFillPercent } from "@/lib/humorMessages";
import { BackgroundGraphics } from "./BackgroundGraphics";

interface ScaleDisplayProps {
  weight: number;
  isConnected: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected";
  battery: number;
  onTare: () => void;
  onToggleConnection: () => void;
  debugLog?: string[];
}

// Demo weight sequence
const DEMO_WEIGHTS = [25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500];

export const ScaleDisplay = ({
  weight: externalWeight,
  isConnected,
  connectionStatus,
  battery,
  onTare,
  onToggleConnection,
}: ScaleDisplayProps) => {
  const [pricePerHundred, setPricePerHundred] = useState(() => {
    const saved = localStorage.getItem("pricePerHundred");
    return saved ? parseFloat(saved) : 99;
  });
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "THB");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isWeightStable, setIsWeightStable] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  // Auto-hide header after 5 seconds
  useEffect(() => {
    if (isHeaderVisible) {
      const timer = setTimeout(() => {
        setIsHeaderVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isHeaderVisible]);
  
  // Demo mode
  const [demoIndex, setDemoIndex] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(!isConnected);

  useEffect(() => {
    if (!isConnected && isDemoMode) {
      const interval = setInterval(() => {
        setDemoIndex(prev => (prev + 1) % DEMO_WEIGHTS.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isConnected, isDemoMode]);

  const weight = isConnected ? externalWeight : (isDemoMode ? DEMO_WEIGHTS[demoIndex] : 0);

  useEffect(() => {
    localStorage.setItem("pricePerHundred", pricePerHundred.toString());
  }, [pricePerHundred]);

  useEffect(() => {
    if (!isConnected || weight === 0) {
      setIsWeightStable(false);
      return;
    }

    setIsWeightStable(false);
    const timer = setTimeout(() => {
      setIsWeightStable(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [weight, isConnected]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

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

  const calculatePrice = () => {
    const pricePerGram = pricePerHundred / 100;
    const total = Math.ceil(weight * pricePerGram);
    return total;
  };

  const price = calculatePrice();
  const priceTier = getPriceTier(price);
  const fillPercent = getTierFillPercent(priceTier);
  const currencySymbol = getCurrencyByCode(currency).symbol;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col cloudy-bg grain-overlay">
      {/* Background graphics */}
      <BackgroundGraphics />
      
      {/* Tap zone to show header - only active when header is hidden */}
      {!isHeaderVisible && (
        <div 
          className="absolute top-0 left-0 right-0 h-16 z-20 cursor-pointer"
          onClick={() => setIsHeaderVisible(true)}
        />
      )}

      {/* Header - Soft, Playful, FUTUREPLAY - Hidden by default */}
      <header className={cn(
        "relative z-10 flex items-center justify-between px-6 py-4 transition-all duration-300",
        isHeaderVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        {/* Left: Status pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-foreground/5 backdrop-blur-sm rounded-full px-4 py-2.5 border border-foreground/8">
            {/* Soft connection dot */}
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-500",
              connectionStatus === "connected" 
                ? "bg-foreground shadow-[0_0_8px_rgba(0,0,0,0.3)]" 
                : connectionStatus === "connecting"
                ? "bg-foreground/50 animate-pulse"
                : "bg-foreground/25"
            )} />
            <span className="font-label text-sm text-foreground/60">
              {connectionStatus === "connected" ? "Connected" : connectionStatus === "connecting" ? "Connecting..." : "Offline"}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-foreground/5 backdrop-blur-sm rounded-full px-4 py-2.5 border border-foreground/8">
            <Battery className="w-4 h-4 text-foreground/50" strokeWidth={1.5} />
            <span className="font-label text-sm text-foreground/50">{battery}%</span>
          </div>
        </div>

        {/* Right: Action buttons - soft, bubbly */}
        <div className="flex items-center gap-2">
          <button 
            onClick={isConnected ? onTare : undefined} 
            disabled={!isConnected}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
              "bg-foreground/5 backdrop-blur-sm border border-foreground/8",
              "hover:scale-105 active:scale-95",
              isConnected 
                ? "text-foreground/60 hover:text-foreground/80 hover:bg-foreground/10 cursor-pointer" 
                : "text-foreground/25 cursor-not-allowed"
            )}
            title="Tare"
          >
            <Scale className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <button 
            onClick={onToggleConnection}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
              "hover:scale-105 active:scale-95",
              !isConnected 
                ? "bg-foreground text-background shadow-[0_4px_20px_rgba(0,0,0,0.2)]" 
                : "bg-foreground/5 backdrop-blur-sm border border-foreground/8 text-foreground/60 hover:text-foreground/80 hover:bg-foreground/10"
            )}
            title={isConnected ? "Disconnect" : "Connect"}
          >
            {connectionStatus === "connected" ? (
              <Wifi className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <WifiOff className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>

          <button 
            onClick={() => setIsHelpDialogOpen(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-foreground/5 backdrop-blur-sm border border-foreground/8 text-foreground/50 hover:text-foreground/70 hover:bg-foreground/10 hover:scale-105 active:scale-95 transition-all duration-300"
            title="Help"
          >
            <HelpCircle className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <button 
            onClick={handleSettingsClick} 
            className="w-12 h-12 rounded-full flex items-center justify-center bg-foreground/5 backdrop-blur-sm border border-foreground/8 text-foreground/50 hover:text-foreground/70 hover:bg-foreground/10 hover:scale-105 active:scale-95 transition-all duration-300"
            title="Settings"
          >
            <Settings className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Main Content - Compact for landscape */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-4">
        {/* Unified Typography Cluster */}
        <UnifiedCandyCluster 
          weight={weight}
          price={price}
          currencySymbol={currencySymbol}
          pricePerHundred={pricePerHundred}
          tier={priceTier}
          fillPercent={fillPercent}
          isStable={isWeightStable}
          maxWeight={1500}
        />

        {/* Humor Line - Centered, elegant */}
        <div className="mt-4">
          <HumorText 
            tier={priceTier}
            price={price}
            isStable={isWeightStable}
          />
        </div>
      </main>

      {/* PIN Dialog */}
      <PinDialog 
        isOpen={isPinDialogOpen} 
        onClose={() => setIsPinDialogOpen(false)} 
        onSuccess={handlePinSuccess} 
      />

      {/* Connection Help Dialog */}
      <ConnectionHelpDialog 
        open={isHelpDialogOpen} 
        onOpenChange={setIsHelpDialogOpen} 
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        pricePerHundred={pricePerHundred} 
        onPriceChange={setPricePerHundred} 
        currency={currency} 
        onCurrencyChange={setCurrency} 
      />
    </div>
  );
};
