import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pricePerHundred: number;
  onPriceChange: (price: number) => void;
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  pricePerHundred,
  onPriceChange,
}: SettingsPanelProps) => {
  const [tempPrice, setTempPrice] = useState(pricePerHundred.toString());

  const handleSave = () => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      onPriceChange(newPrice);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-[500px] bg-card shadow-2xl z-50 transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-border">
            <h2 className="text-3xl font-bold text-foreground">⚙ Settings</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 space-y-8 overflow-y-auto">
            {/* Price per 100g */}
            <div className="space-y-3">
              <Label htmlFor="price" className="text-xl font-semibold text-foreground">
                Price per 100 g
              </Label>
              <div className="flex gap-3">
                <Input
                  id="price"
                  type="number"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="text-2xl font-bold h-14 px-4 rounded-xl"
                  placeholder="89"
                  step="0.01"
                  min="0"
                />
                <div className="flex items-center justify-center w-14 h-14 bg-muted rounded-xl text-2xl font-bold">
                  ฿
                </div>
              </div>
            </div>

            {/* Currency Display */}
            <div className="space-y-3">
              <Label className="text-xl font-semibold text-foreground">Currency</Label>
              <div className="h-14 px-4 bg-muted rounded-xl flex items-center text-xl font-semibold text-muted-foreground">
                Thai Baht (฿)
              </div>
            </div>

            {/* Unit Display */}
            <div className="space-y-3">
              <Label className="text-xl font-semibold text-foreground">Weight Unit</Label>
              <div className="h-14 px-4 bg-muted rounded-xl flex items-center text-xl font-semibold text-muted-foreground">
                Grams (g)
              </div>
            </div>

            {/* Rounding */}
            <div className="space-y-3">
              <Label className="text-xl font-semibold text-foreground">Price Rounding</Label>
              <div className="h-14 px-4 bg-muted rounded-xl flex items-center text-xl font-semibold text-muted-foreground">
                Round up to nearest 1 ฿
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 p-6 bg-primary/10 rounded-2xl border-2 border-primary/20">
              <h3 className="font-bold text-lg text-foreground mb-2">
                Calculation Formula
              </h3>
              <code className="text-sm text-muted-foreground block font-mono">
                Total Price = Weight (g) × (Price per 100g ÷ 100)
                <br />
                Rounded up to nearest 1 ฿
              </code>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-border">
            <Button
              onClick={handleSave}
              className="w-full h-14 text-xl font-bold rounded-xl shadow-soft hover:shadow-bold"
              size="lg"
            >
              SAVE SETTINGS
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
