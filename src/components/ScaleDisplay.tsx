import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

// Demo weight sequence: 25, 50, 100, 150, 200... up to 1500
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

  // Demo mode cycling
  useEffect(() => {
    if (!isConnected && isDemoMode) {
      const interval = setInterval(() => {
        setDemoIndex(prev => (prev + 1) % DEMO_WEIGHTS.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isConnected, isDemoMode]);

  // Use external weight when connected, demo weight otherwise
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
      {/* Subtle ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-foreground/[0.02] rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-foreground/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Header - Refined */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        {/* Left: Status pills */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "glass-pill flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300",
            connectionStatus === "connected" && "border-foreground/30"
          )}>
            {connectionStatus === "connected" ? (
              <Wifi className="w-4 h-4 opacity-80" />
            ) : connectionStatus === "connecting" ? (
              <Wifi className="w-4 h-4 animate-pulse opacity-60" />
            ) : (
              <WifiOff className="w-4 h-4 opacity-40" />
            )}
            <span className="text-body text-sm font-semibold opacity-70">
              {connectionStatus === "connected" ? "Connected" : connectionStatus === "connecting" ? "Connecting..." : "Offline"}
            </span>
          </div>

          <div className="glass-pill flex items-center gap-2.5 px-5 py-2.5 rounded-full">
            <Battery className="w-4 h-4 opacity-60" />
            <span className="text-body text-sm font-semibold opacity-70">{battery}%</span>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={isConnected ? onTare : undefined} 
            disabled={!isConnected}
            className={cn(
              "glass-pill w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
              isConnected 
                ? "hover:bg-foreground/10 active:scale-95 cursor-pointer" 
                : "opacity-30 cursor-not-allowed"
            )}
            title="Tare"
          >
            <Scale className="w-5 h-5 opacity-70" />
          </button>

          <button 
            onClick={onToggleConnection}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95",
              !isConnected 
                ? "bg-foreground text-background hover:bg-foreground/90" 
                : "glass-pill hover:bg-foreground/10"
            )}
            title={isConnected ? "Disconnect" : "Connect"}
          >
            <Wifi className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setIsHelpDialogOpen(true)}
            className="glass-pill w-12 h-12 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-all duration-300"
            title="Help"
          >
            <HelpCircle className="w-5 h-5 opacity-70" />
          </button>

          <button 
            onClick={handleSettingsClick} 
            className="glass-pill w-12 h-12 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-all duration-300"
            title="Settings"
          >
            <Settings className="w-5 h-5 opacity-70" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        {/* Unified Candy Cluster */}
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

        {/* Stable indicator */}
        <div className="mt-6 h-10 flex items-center justify-center">
          {isWeightStable && weight > 0 && (
            <div className="glass-pill flex items-center gap-2.5 px-6 py-2.5 rounded-full animate-scale-in">
              <div className="w-2 h-2 bg-foreground/60 rounded-full animate-pulse" />
              <span className="text-body text-sm font-bold tracking-wider opacity-60">STABLE</span>
            </div>
          )}
        </div>

        {/* Humor Text */}
        <div className="mt-4">
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