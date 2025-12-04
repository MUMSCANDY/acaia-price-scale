import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Wifi, WifiOff, Battery, HelpCircle, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsPanel } from "./SettingsPanel";
import { PinDialog } from "./PinDialog";
import { ConnectionHelpDialog } from "./ConnectionHelpDialog";
import { getCurrencyByCode } from "@/lib/currencies";
import { CandyBucket } from "./CandyBucket";
import { CircularGauge } from "./CircularGauge";
import { HumorText } from "./HumorText";
import { MascotBubble } from "./MascotBubble";
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

export const ScaleDisplay = ({
  weight,
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
  const [priceAnimating, setPriceAnimating] = useState(false);
  
  const prevPriceRef = useRef(0);

  // Save price to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("pricePerHundred", pricePerHundred.toString());
  }, [pricePerHundred]);

  // Detect weight stabilization
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

      if (history.length > 1000) {
        history.shift();
      }
      localStorage.setItem("transactionHistory", JSON.stringify(history));
    }
  }, [weight, isConnected]);

  // Price pop animation trigger
  useEffect(() => {
    const currentPrice = calculatePrice();
    if (currentPrice !== prevPriceRef.current && currentPrice > 0) {
      setPriceAnimating(true);
      setTimeout(() => setPriceAnimating(false), 400);
    }
    prevPriceRef.current = currentPrice;
  }, [weight, pricePerHundred]);

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
          {/* Connection Status */}
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

          {/* Battery */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground/30">
            <Battery className="w-4 h-4" />
            <span className="font-digital text-sm">{battery}%</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {/* Tare Button */}
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

          {/* Connect Button */}
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

          {/* Help Button */}
          <button 
            onClick={() => setIsHelpDialogOpen(true)}
            className="w-12 h-12 rounded-full border-2 border-foreground/30 flex items-center justify-center hover:bg-foreground/10 transition-all duration-300"
            title="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Settings Button */}
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

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-8">
        <div className="flex items-center gap-16">
          {/* Left: Candy Bucket with Mascot - Fixed width */}
          <div className="flex flex-col items-center gap-4 w-44">
            {/* Mascot Bubble */}
            <MascotBubble 
              tier={priceTier}
              isStable={isWeightStable}
              weight={weight}
              className="w-24 h-20"
            />
            
            {/* Candy Bucket */}
            <CandyBucket 
              tier={priceTier}
              fillPercent={weight > 0 ? fillPercent : 0}
              className="w-40 h-44"
            />
          </div>

          {/* Center: Weight Display with Gauge - Fixed dimensions */}
          <div className="flex flex-col items-center w-[340px]">
            <CircularGauge 
              weight={weight} 
              isStable={isWeightStable}
              maxWeight={1500}
            >
              <div className="text-center w-[200px]">
                <div className="text-digital text-[120px] leading-none tabular-nums">
                  {weight.toFixed(0)}
                </div>
                <div className="text-digital text-3xl mt-1 opacity-70">g</div>
              </div>
            </CircularGauge>

            {/* Stable indicator - fixed height container */}
            <div className="mt-4 h-10 flex items-center justify-center">
              {isWeightStable && weight > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground animate-scale-in">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" />
                  <span className="font-digital text-xs tracking-widest">STABLE</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Price Display - Fixed width */}
          <div className="flex flex-col items-center w-64">
            {/* Big Price */}
            <div className="text-center">
              <div className="text-digital text-[100px] leading-none tabular-nums min-w-[200px]">
                {currencySymbol}{price}
              </div>
              <div className="text-digital text-lg mt-2 opacity-50">
                {currencySymbol}{pricePerHundred} per 100g
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-6">
        {/* Humor Text */}
        <HumorText 
          tier={priceTier}
          price={price}
        />
      </footer>

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
