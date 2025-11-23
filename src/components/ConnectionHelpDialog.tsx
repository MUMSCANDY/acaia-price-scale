import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConnectionHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConnectionHelpDialog = ({ open, onOpenChange }: ConnectionHelpDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">Acaia Pearl S Connection Guide</AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-4 text-base">
            <p className="font-semibold text-foreground">Follow these steps to connect your Acaia Pearl S scale:</p>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  1
                </div>
                <div>
                  <p className="font-semibold text-foreground">Power on your scale</p>
                  <p className="text-sm text-muted-foreground">Press the power button on your Acaia Pearl S scale.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">Disconnect from other devices</p>
                  <p className="text-sm text-muted-foreground">
                    Make sure your scale is NOT connected to any other device (phone, tablet, or app). 
                    Close any Acaia apps on your phone if running.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">Enable Bluetooth on your computer</p>
                  <p className="text-sm text-muted-foreground">
                    Make sure Bluetooth is turned on in your computer's settings.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  4
                </div>
                <div>
                  <p className="font-semibold text-foreground">Use Chrome or Edge browser</p>
                  <p className="text-sm text-muted-foreground">
                    Web Bluetooth only works on Chrome, Edge, or Opera browsers. Safari is not supported.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  5
                </div>
                <div>
                  <p className="font-semibold text-foreground">Click CONNECT and select your scale</p>
                  <p className="text-sm text-muted-foreground">
                    Your scale will appear as "PEARLS-" followed by a serial number. Select it from the list.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold text-foreground mb-2">Still having issues?</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Try turning your scale off and on again</li>
                <li>Move closer to the scale (within 3 feet)</li>
                <li>Remove the scale from your system's Bluetooth settings and pair fresh</li>
                <li>Restart your browser</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="text-digital">Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
