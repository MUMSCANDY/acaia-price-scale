import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Acaia BLE Service and Characteristic UUIDs (from reverse engineering)
const ACAIA_SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";
const ACAIA_CHAR_WRITE_UUID = "49535343-6daa-4d02-abf6-19569aca69fe";
const ACAIA_CHAR_NOTIFY_UUID = "49535343-1023-4bd4-bba4-00e6539e5aa7";

interface UseAcaiaScaleReturn {
  weight: number;
  isConnected: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected";
  battery: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  tare: () => void;
}

export const useAcaiaScale = (): UseAcaiaScaleReturn => {
  const [weight, setWeight] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [battery, setBattery] = useState(85);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);

  // Parse weight data from Acaia scale
  const parseWeightData = useCallback((dataView: DataView) => {
    // Based on Acaia protocol: weight data comes in specific byte format
    // This is a simplified parser - actual implementation would follow the full protocol
    try {
      // Acaia sends weight in grams as a float or integer depending on protocol version
      // Byte 0-3: weight value (may need adjustment based on actual protocol)
      const weightValue = dataView.getFloat32(0, true); // little-endian
      setWeight(Math.max(0, weightValue));
    } catch (error) {
      console.error("Error parsing weight data:", error);
    }
  }, []);

  // Handle incoming data from scale
  const handleNotification = useCallback(
    (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const value = target.value;
      if (value) {
        parseWeightData(value);
      }
    },
    [parseWeightData]
  );

  // Connect to Acaia scale via Web Bluetooth API
  const connect = useCallback(async () => {
    setConnectionStatus("connecting");
    try {
      console.log("Starting connection to Acaia scale...");
      
      // Check if Web Bluetooth is available
      if (!navigator.bluetooth) {
        toast.error("Web Bluetooth not supported. Please use a compatible browser or native app.");
        return;
      }

      // Request device - Pearl S uses "PEARLS-" prefix
      console.log("Requesting device...");
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: "PEARLS-" },
          { namePrefix: "ACAIA" },
        ],
        optionalServices: [ACAIA_SERVICE_UUID],
      });
      console.log("Device selected:", device.name);

      if (!device.gatt) {
        throw new Error("GATT not available");
      }

      // Connect to GATT server with retry logic and timeout per attempt
      console.log("Connecting to GATT server...");
      let server: BluetoothRemoteGATTServer | null = null;
      let retries = 3;
      
      while (retries > 0 && !server) {
        try {
          server = await Promise.race([
            device.gatt!.connect(),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Connection timeout')), 5000)
            )
          ]);
          console.log("Connected to GATT server");
        } catch (err) {
          retries--;
          if (retries === 0) {
            throw new Error('Failed to connect after multiple attempts. Make sure the scale is on and not connected to another device.');
          }
          console.log(`Connection attempt failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!server) {
        throw new Error('Failed to establish GATT connection');
      }
      
      console.log("Getting service:", ACAIA_SERVICE_UUID);
      const service = await server.getPrimaryService(ACAIA_SERVICE_UUID);
      console.log("Got service");
      
      console.log("Getting notify characteristic:", ACAIA_CHAR_NOTIFY_UUID);
      const notifyChar = await service.getCharacteristic(ACAIA_CHAR_NOTIFY_UUID);
      console.log("Got notify characteristic");
      
      console.log("Getting write characteristic:", ACAIA_CHAR_WRITE_UUID);
      const writeChar = await service.getCharacteristic(ACAIA_CHAR_WRITE_UUID);
      console.log("Got write characteristic");

      // Start notifications
      console.log("Starting notifications...");
      await notifyChar.startNotifications();
      notifyChar.addEventListener("characteristicvaluechanged", handleNotification);
      console.log("Notifications started");

      setDevice(device);
      setCharacteristic(writeChar);
      setIsConnected(true);
      setConnectionStatus("connected");
      setBattery(85); // Would be read from actual device

      console.log("Connection complete!");
      toast.success("Connected to Acaia scale!");
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnected(false);
      setConnectionStatus("disconnected");
    }
  }, [handleNotification]);

  // Disconnect from scale
  const disconnect = useCallback(() => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    }
    if (characteristic) {
      characteristic.removeEventListener("characteristicvaluechanged", handleNotification);
    }
    setDevice(null);
    setCharacteristic(null);
    setIsConnected(false);
    setConnectionStatus("disconnected");
    toast.info("Disconnected from scale");
  }, [device, characteristic, handleNotification]);

  // Send tare command to scale
  const tare = useCallback(async () => {
    if (!characteristic || !isConnected) {
      toast.error("Not connected to scale");
      return;
    }

    try {
      // Acaia tare command (simplified - actual command from protocol doc)
      // Command format based on Acaia protocol
      const tareCommand = new Uint8Array([0xef, 0xdd, 0x04, 0x00, 0x00, 0x00, 0x00]);
      await characteristic.writeValue(tareCommand);
      toast.success("Scale tared");
    } catch (error) {
      console.error("Tare error:", error);
      toast.error("Failed to tare scale");
    }
  }, [characteristic, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Simulate weight changes for demo purposes (remove in production)
  useEffect(() => {
    if (!isConnected) {
      // Simulate some weight for demo
      const interval = setInterval(() => {
        setWeight((prev) => Math.max(0, prev + (Math.random() - 0.5) * 10));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return {
    weight,
    isConnected,
    connectionStatus,
    battery,
    connect,
    disconnect,
    tare,
  };
};
