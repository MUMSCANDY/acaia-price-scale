import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Acaia BLE Service and Characteristic UUIDs (from reverse engineering)
const ACAIA_SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";
const ACAIA_CHAR_WRITE_UUID = "49535343-6daa-4d02-abf6-19569aca69fe";
const ACAIA_CHAR_NOTIFY_UUID = "49535343-1023-4bd4-bba4-00e6539e5aa7";

interface UseAcaiaScaleReturn {
  weight: number;
  isConnected: boolean;
  battery: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  tare: () => void;
}

export const useAcaiaScale = (): UseAcaiaScaleReturn => {
  const [weight, setWeight] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
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
    try {
      // Check if Web Bluetooth is available
      if (!navigator.bluetooth) {
        toast.error("Web Bluetooth not supported. Please use a compatible browser or native app.");
        return;
      }

      // Request device
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: "ACAIA" },
          { namePrefix: "PEARL" },
          { services: [ACAIA_SERVICE_UUID] },
        ],
        optionalServices: [ACAIA_SERVICE_UUID],
      });

      if (!device.gatt) {
        throw new Error("GATT not available");
      }

      // Connect to GATT server
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(ACAIA_SERVICE_UUID);
      const notifyChar = await service.getCharacteristic(ACAIA_CHAR_NOTIFY_UUID);
      const writeChar = await service.getCharacteristic(ACAIA_CHAR_WRITE_UUID);

      // Start notifications
      await notifyChar.startNotifications();
      notifyChar.addEventListener("characteristicvaluechanged", handleNotification);

      setDevice(device);
      setCharacteristic(writeChar);
      setIsConnected(true);
      setBattery(85); // Would be read from actual device

      toast.success("Connected to Acaia scale!");
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      toast.error("Failed to connect to scale. Make sure Bluetooth is enabled.");
      setIsConnected(false);
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
    battery,
    connect,
    disconnect,
    tare,
  };
};
