import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Acaia BLE Service and Characteristic UUIDs (from reverse engineering)
const ACAIA_SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";
const ACAIA_CHAR_WRITE_UUID = "49535343-6daa-4d02-abf6-19569aca69fe";
const ACAIA_CHAR_NOTIFY_UUID = "49535343-aca3-481c-91ec-d85e28a60318";

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
    try {
      // Log raw data for debugging
      const bytes = Array.from(new Uint8Array(dataView.buffer));
      console.log("Received data:", bytes.map(b => b.toString(16).padStart(2, '0')).join(' '));
      
      // Acaia protocol: messages start with 0xef 0xdd
      if (dataView.byteLength < 4) {
        console.log("Message too short");
        return;
      }
      
      const header1 = dataView.getUint8(0);
      const header2 = dataView.getUint8(1);
      
      if (header1 !== 0xef || header2 !== 0xdd) {
        console.log("Invalid header");
        return;
      }
      
      const msgType = dataView.getUint8(2);
      console.log("Message type:", msgType.toString(16));
      
      // Type 0x05 = weight data
      // Type 0x08 = battery
      if (msgType === 0x05 && dataView.byteLength >= 9) {
        // Weight is in bytes 4-8 as big-endian integer (grams * 10)
        const weightRaw = (dataView.getUint8(4) << 24) | 
                         (dataView.getUint8(5) << 16) | 
                         (dataView.getUint8(6) << 8) | 
                         dataView.getUint8(7);
        const weightGrams = weightRaw / 10.0;
        console.log("Weight:", weightGrams, "g");
        setWeight(Math.max(0, weightGrams));
      } else if (msgType === 0x08 && dataView.byteLength >= 5) {
        // Battery level in byte 4
        const batteryLevel = dataView.getUint8(4);
        console.log("Battery:", batteryLevel, "%");
        setBattery(batteryLevel);
      }
    } catch (error) {
      console.error("Error parsing data:", error);
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

      // Connect to GATT server
      console.log("Connecting to GATT server...");
      if (!device.gatt) {
        throw new Error("GATT not available on device");
      }

      let server: BluetoothRemoteGATTServer;
      try {
        server = await device.gatt.connect();
        console.log("GATT server connected successfully");
      } catch (err) {
        console.error("GATT connection failed:", err);
        throw new Error(`Cannot connect to scale. Error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
      
      // MINIMAL CONNECTION TEST - just save device and set state
      // Don't get services, don't get characteristics, don't do ANYTHING
      console.log("Minimal connection established - testing if it stays alive...");
      
      setDevice(device);
      setCharacteristic(null); // No characteristic yet
      setIsConnected(true);
      setConnectionStatus("connected");
      setWeight(0);
      setBattery(85);
      
      console.log("Connection test complete. If this stays connected, we can proceed to get characteristics.");
      toast.success("Connected! Testing connection stability...");
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

  // Simulate weight changes for demo purposes only when disconnected
  useEffect(() => {
    if (!isConnected) {
      // Start with 500g for demo
      setWeight(500 + Math.random() * 50);
      
      // Simulate some weight variation for demo when not connected
      const interval = setInterval(() => {
        setWeight((prev) => Math.max(450, Math.min(550, prev + (Math.random() - 0.5) * 20)));
      }, 500);
      return () => clearInterval(interval);
    } else {
      // When connected, stop simulation - real data will come from notifications
      console.log("Connected - waiting for real weight data from scale");
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
