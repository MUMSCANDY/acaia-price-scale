import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinDialog = ({ isOpen, onClose, onSuccess }: PinDialogProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const storedPin = localStorage.getItem("settingsPin") || "1616";
    
    if (pin === storedPin) {
      setError(false);
      setPin("");
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Dialog */}
        <div
          className="bg-card rounded-3xl p-12 shadow-2xl w-[500px]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center">
            🔒 Enter PIN
          </h2>
          <p className="text-xl text-foreground/70 mb-8 text-center">
            Staff access only
          </p>

          <Input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ""));
              setError(false);
            }}
            onKeyPress={handleKeyPress}
            className={cn(
              "text-4xl font-bold h-20 text-center tracking-widest rounded-2xl mb-6",
              error && "border-destructive border-2 shake"
            )}
            placeholder="••••"
            autoFocus
          />

          {error && (
            <p className="text-destructive text-center mb-4 font-semibold text-lg">
              Incorrect PIN. Please try again.
            </p>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 text-xl text-digital rounded-xl"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 h-14 text-xl text-digital rounded-xl"
              disabled={pin.length !== 4}
            >
              UNLOCK
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};