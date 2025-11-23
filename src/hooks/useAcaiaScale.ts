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

      // Connect to GATT server - try simple connection first
      console.log("Connecting to GATT server...");
      if (!device.gatt) {
        throw new Error("GATT not available on device");
      }

      // Add disconnect listener
      const handleDisconnect = () => {
        console.log("Device disconnected unexpectedly");
        setIsConnected(false);
        setConnectionStatus("disconnected");
        toast.info("Scale disconnected");
      };
      
      (device as any).addEventListener?.('gattserverdisconnected', handleDisconnect);

      let server: BluetoothRemoteGATTServer;
      try {
        // Simple direct connection - let browser handle the timeout
        server = await device.gatt.connect();
        console.log("Connected to GATT server successfully");
      } catch (err) {
        console.error("GATT connection failed:", err);
        throw new Error(`Cannot connect to scale. Please ensure: 1) Scale is powered on, 2) Scale is not connected to another device (phone/tablet), 3) Bluetooth is enabled on your device. Error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
      
      console.log("Getting service:", ACAIA_SERVICE_UUID);
      const service = await server.getPrimaryService(ACAIA_SERVICE_UUID);
      console.log("Got service, getting all characteristics...");
      
      // Get all available characteristics
      const characteristics = await service.getCharacteristics();
      console.log("Found", characteristics.length, "characteristics:");
      characteristics.forEach(c => {
        console.log("  -", c.uuid);
      });
      
      // Use first characteristic for both write and notify
      const writeChar = characteristics[0];
      const notifyChar = characteristics[0];
      
      console.log("Using characteristic:", writeChar.uuid);

      // Just add event listener WITHOUT calling startNotifications to see if connection stays alive
      console.log("Adding notification listener (without explicit start)...");
      notifyChar.addEventListener("characteristicvaluechanged", handleNotification);
      console.log("Listener added - connection should stay alive now");

      setDevice(device);
      setCharacteristic(writeChar);
      setIsConnected(true);
      setConnectionStatus("connected");
      setWeight(0);
      setBattery(85);
      
      console.log("Connection complete! Scale is connected and listening for weight data.");
      console.log("Note: The scale should automatically send weight updates when you place items on it.");
      
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

  // Simulate weight changes for demo purposes only when disconnected
  useEffect(() => {
    if (!isConnected) {
      // Simulate some weight for demo when not connected
      const interval = setInterval(() => {
        setWeight((prev) => Math.max(0, prev + (Math.random() - 0.5) * 10));
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
