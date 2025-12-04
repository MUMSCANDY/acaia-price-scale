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
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-foreground/3 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-foreground/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4">
        {/* Left: Connection & Battery */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground/30 transition-all duration-300",
            connectionStatus === "connected" && "border-foreground"
          )}>
            {connectionStatus === "connected" ? (
              <Wifi className="w-4 h-4" />
            ) : connectionStatus === "connecting" ? (
              <Wifi className="w-4 h-4 animate-pulse" />
            ) : (
              <WifiOff className="w-4 h-4 opacity-50" />
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground/30">
            <Battery className="w-4 h-4" />
            <span className="font-body text-sm font-semibold">{battery}%</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={isConnected ? onTare : undefined} 
            disabled={!isConnected}
            className={cn(
              "w-12 h-12 rounded-full border-2 border-foreground/30 flex items-center justify-center transition-all duration-300",
              isConnected 
                ? "hover:bg-foreground/10 active:scale-95 cursor-pointer" 
                : "opacity-30 cursor-not-allowed"
            )}
            title="Tare"
          >
            <Scale className="w-5 h-5" />
          </button>

          {!isConnected ? (
            <button 
              onClick={onToggleConnection}
              className="w-12 h-12 rounded-full border-2 border-foreground bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 active:scale-95 transition-all duration-300"
              title="Connect"
            >
              <Wifi className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={onToggleConnection}
              className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center hover:bg-foreground/10 active:scale-95 transition-all duration-300"
              title="Disconnect"
            >
              <Wifi className="w-5 h-5" />
            </button>
          )}

          <button 
            onClick={() => setIsHelpDialogOpen(true)}
            className="w-12 h-12 rounded-full border-2 border-foreground/30 flex items-center justify-center hover:bg-foreground/10 transition-all duration-300"
            title="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSettingsClick} 
            className="rounded-full w-12 h-12 border-2 border-foreground/30 hover:bg-foreground/10"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content - Unified Cluster Layout */}
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
        <div className="mt-4 h-8 flex items-center justify-center">
          {isWeightStable && weight > 0 && (
            <div className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-foreground animate-scale-in animate-stable-pulse">
              <div className="w-2 h-2 bg-foreground rounded-full" />
              <span className="font-display text-sm font-bold tracking-wide">STABLE</span>
            </div>
          )}
        </div>

        {/* Humor Text - centered below cluster */}
        <div className="mt-4">
          <HumorText 
            tier={priceTier}
            price={price}
          />
        </div>
      </main>

      {/* No footer - humor text moved inline */}

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
