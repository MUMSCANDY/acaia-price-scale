import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BleClient, numbersToDataView, numberToUUID } from '@capacitor-community/bluetooth-le';

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
  const [deviceId, setDeviceId] = useState<string | null>(null);

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

  // Initialize BLE client on mount
  useEffect(() => {
    const initializeBle = async () => {
      try {
        await BleClient.initialize();
        console.log("BLE Client initialized");
      } catch (error) {
        console.error("BLE initialization error:", error);
        toast.error("Failed to initialize Bluetooth");
      }
    };

    initializeBle();
  }, []);

  // Connect to Acaia scale via Native Bluetooth
  const connect = useCallback(async () => {
    setConnectionStatus("connecting");
    try {
      console.log("Starting connection to Acaia scale...");

      // Initialize BLE Client first
      console.log("Initializing BLE Client...");
      try {
        await BleClient.initialize();
        console.log("BLE Client initialized successfully");
      } catch (initError) {
        console.error("BLE initialization failed:", initError);
        toast.error("Failed to initialize Bluetooth");
        setConnectionStatus("disconnected");
        return;
      }

      // Check if Bluetooth is enabled
      console.log("Checking if Bluetooth is enabled...");
      const isEnabled = await BleClient.isEnabled();
      console.log("Bluetooth enabled:", isEnabled);
      
      if (!isEnabled) {
        console.log("Bluetooth is disabled - requesting to enable");
        toast.error("Please enable Bluetooth on your device");
        await BleClient.openBluetoothSettings();
        setConnectionStatus("disconnected");
        return;
      }

      // Check if location is enabled (required for BLE scanning on Android)
      console.log("Checking if location is enabled...");
      const isLocationEnabled = await BleClient.isLocationEnabled();
      console.log("Location enabled:", isLocationEnabled);
      
      if (!isLocationEnabled) {
        console.log("Location is not enabled");
        toast.error("Please enable location services for Bluetooth scanning");
        await BleClient.openLocationSettings();
        setConnectionStatus("disconnected");
        return;
      }
      
      console.log("All checks passed, starting BLE scan...");
      console.log("This should show ALL nearby BLE devices...");

      // Request device - Remove ALL filters to see every BLE device nearby
      console.log("Calling BleClient.requestDevice with NO filters...");
      const device = await BleClient.requestDevice();
      console.log("Device selected:", device);
      
      console.log("Device selected:", device.deviceId);

      // Connect to device
      console.log("Connecting to device...");
      await BleClient.connect(device.deviceId, (disconnectedDeviceId) => {
        console.log(`Disconnected from ${disconnectedDeviceId}`);
        setIsConnected(false);
        setConnectionStatus("disconnected");
        setDeviceId(null);
        toast.info("Scale disconnected");
      });
      
      console.log("Connected successfully");

      // Get services to verify connection
      console.log("Getting services...");
      const services = await BleClient.getServices(device.deviceId);
      console.log("Services discovered:", services.length);

      // Start notifications for weight data
      console.log("Starting notifications...");
      await BleClient.startNotifications(
        device.deviceId,
        ACAIA_SERVICE_UUID,
        ACAIA_CHAR_NOTIFY_UUID,
        (value) => {
          parseWeightData(value);
        }
      );
      
      console.log("Notifications started");

      setDeviceId(device.deviceId);
      setIsConnected(true);
      setConnectionStatus("connected");
      setWeight(0);
      setBattery(85);
      
      toast.success("Connected to Acaia scale!");
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnected(false);
      setConnectionStatus("disconnected");
      setDeviceId(null);
    }
  }, [parseWeightData]);

  // Disconnect from scale
  const disconnect = useCallback(async () => {
    if (deviceId) {
      try {
        await BleClient.disconnect(deviceId);
        console.log("Disconnected from scale");
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    }
    setDeviceId(null);
    setIsConnected(false);
    setConnectionStatus("disconnected");
    toast.info("Disconnected from scale");
  }, [deviceId]);

  // Send tare command to scale
  const tare = useCallback(async () => {
    if (!deviceId || !isConnected) {
      toast.error("Not connected to scale");
      return;
    }

    try {
      // Acaia tare command (simplified - actual command from protocol doc)
      const tareCommand = new Uint8Array([0xef, 0xdd, 0x04, 0x00, 0x00, 0x00, 0x00]);
      const dataView = numbersToDataView(Array.from(tareCommand));
      
      await BleClient.write(
        deviceId,
        ACAIA_SERVICE_UUID,
        ACAIA_CHAR_WRITE_UUID,
        dataView
      );
      
      toast.success("Scale tared");
    } catch (error) {
      console.error("Tare error:", error);
      toast.error("Failed to tare scale");
    }
  }, [deviceId, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (deviceId) {
        BleClient.disconnect(deviceId).catch(console.error);
      }
    };
  }, [deviceId]);

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
