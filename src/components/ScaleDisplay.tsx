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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Subtle Pixel Grid Background */}
      <div className="absolute inset-0 pixel-grid opacity-50 pointer-events-none" />
      
      {/* Header - Minimal Pixel-Modern */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        {/* Left: Status with pixel dot indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Pixel-style connection dot */}
            <div className={cn(
              "w-2.5 h-2.5 transition-all duration-300",
              connectionStatus === "connected" 
                ? "bg-foreground" 
                : connectionStatus === "connecting"
                ? "bg-foreground/40 animate-pulse"
                : "bg-foreground/20"
            )} />
            <span className="text-label text-sm opacity-50">
              {connectionStatus === "connected" ? "Connected" : connectionStatus === "connecting" ? "Connecting" : "Offline"}
            </span>
          </div>

          <div className="futureplay-pill flex items-center gap-2 px-4 py-2">
            <Battery className="w-3.5 h-3.5 opacity-40" strokeWidth={2} />
            <span className="text-micro text-sm opacity-40">{battery}%</span>
          </div>
        </div>

        {/* Right: Action buttons - circular pixel-modern */}
        <div className="flex items-center gap-2">
          <button 
            onClick={isConnected ? onTare : undefined} 
            disabled={!isConnected}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-foreground/10",
              isConnected 
                ? "hover:bg-foreground/5 active:scale-95 cursor-pointer opacity-50 hover:opacity-70" 
                : "opacity-20 cursor-not-allowed"
            )}
            title="Tare"
          >
            <Scale className="w-4 h-4" strokeWidth={2} />
          </button>

          <button 
            onClick={onToggleConnection}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95",
              !isConnected 
                ? "bg-foreground text-background" 
                : "border-2 border-foreground/10 opacity-50 hover:opacity-70 hover:bg-foreground/5"
            )}
            title={isConnected ? "Disconnect" : "Connect"}
          >
            {connectionStatus === "connected" ? (
              <Wifi className="w-4 h-4" strokeWidth={2} />
            ) : (
              <WifiOff className="w-4 h-4" strokeWidth={2} />
            )}
          </button>

          <button 
            onClick={() => setIsHelpDialogOpen(true)}
            className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-foreground/10 opacity-40 hover:opacity-60 hover:bg-foreground/5 transition-all duration-300"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" strokeWidth={2} />
          </button>

          <button 
            onClick={handleSettingsClick} 
            className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-foreground/10 opacity-40 hover:opacity-60 hover:bg-foreground/5 transition-all duration-300"
            title="Settings"
          >
            <Settings className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 -mt-8">
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
        <div className="mt-12">
          <HumorText 
            tier={priceTier}
            price={price}
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
