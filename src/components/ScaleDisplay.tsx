import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Wifi, WifiOff, Battery } from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsPanel } from "./SettingsPanel";
import { PinDialog } from "./PinDialog";
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
  onToggleConnection,
}: ScaleDisplayProps) => {
  const [pricePerHundred, setPricePerHundred] = useState(89);
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "THB");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);

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
        totalPrice: calculatePrice(),
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

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-12 pt-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          MUMS SCALE
        </h1>
        
        <div className="flex items-center gap-6">
          {/* Connection Status */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all",
            connectionStatus === "connected"
              ? "bg-primary/10 text-foreground" 
              : connectionStatus === "connecting"
              ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
              : "bg-muted/50 text-muted-foreground"
          )}>
            {connectionStatus === "connected" ? (
              <>
                <Wifi className="w-5 h-5" />
                <span className="font-semibold text-sm">Acaia Pearl S</span>
              </>
            ) : connectionStatus === "connecting" ? (
              <>
                <Wifi className="w-5 h-5 animate-pulse" />
                <span className="font-semibold text-sm">Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5" />
                <span className="font-semibold text-sm">Disconnected</span>
              </>
            )}
          </div>

          {/* Battery */}
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full">
            <Battery className="w-5 h-5 text-foreground" />
            <span className="font-semibold text-sm text-foreground">{battery}%</span>
          </div>

          {/* Settings Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleSettingsClick}
            className="rounded-full w-12 h-12 border-2 border-foreground/20 hover:border-foreground hover:bg-foreground/10"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Main Display */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-12 py-16">
        {/* Weight Display */}
        <div className="mb-8 text-center">
          <div className="text-display text-[160px] leading-none mb-2 drop-shadow-lg">
            {weight.toFixed(1)}
            <span className="text-[120px] ml-4 text-muted-foreground">g</span>
          </div>
        </div>

        {/* Price Display */}
        <div className="mb-12 text-center bg-foreground/10 backdrop-blur-md rounded-3xl px-16 py-10 shadow-bold">
          <div className="text-display text-[180px] leading-none text-foreground">
            {getCurrencyByCode(currency).symbol} {calculatePrice()}
          </div>
          <p className="text-2xl text-foreground/70 mt-4 font-semibold">
            Price per 100 g: {pricePerHundred} {getCurrencyByCode(currency).symbol}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-6">
          <Button
            size="lg"
            onClick={onTare}
            disabled={!isConnected}
            className="px-12 py-8 text-2xl font-bold rounded-2xl shadow-soft hover:shadow-bold transition-all disabled:opacity-50"
          >
            TARE
          </Button>

          <Button
            size="lg"
            variant={isConnected ? "outline" : "default"}
            onClick={onToggleConnection}
            className="px-12 py-8 text-2xl font-bold rounded-2xl shadow-soft hover:shadow-bold transition-all"
          >
            {isConnected ? "DISCONNECT" : "CONNECT"}
          </Button>
        </div>
      </main>

      {/* PIN Dialog */}
      <PinDialog
        isOpen={isPinDialogOpen}
        onClose={() => setIsPinDialogOpen(false)}
        onSuccess={handlePinSuccess}
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
