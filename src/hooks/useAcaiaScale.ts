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
  const [dataBuffer, setDataBuffer] = useState<number[]>([]);

  // Parse weight data from Acaia scale
  const parseWeightData = useCallback((dataView: DataView) => {
    try {
      // Convert to byte array and add to buffer
      const newBytes = Array.from(new Uint8Array(dataView.buffer));
      
      setDataBuffer(prevBuffer => {
        const buffer = [...prevBuffer, ...newBytes];
        
        // Process complete messages from buffer
        let processedBytes = 0;
        
        while (buffer.length - processedBytes >= 4) {
          const offset = processedBytes;
          
          // Look for message header (0xef 0xdd)
          if (buffer[offset] !== 0xef || buffer[offset + 1] !== 0xdd) {
            // Invalid header, skip this byte and continue searching
            processedBytes++;
            continue;
          }
          
          const msgType = buffer[offset + 2];
          const msgLength = buffer[offset + 3];
          const totalLength = 4 + msgLength; // header(2) + type(1) + length(1) + payload(msgLength)
          
          // Check if we have complete message
          if (buffer.length - offset < totalLength) {
            // Incomplete message, keep remaining bytes in buffer
            break;
          }
          
          // Process complete message
          const message = buffer.slice(offset, offset + totalLength);
          
          // Type 0x07 = weight data (Pearl S)
          // Type 0x05 = weight data (older models)
          // Type 0x08 = battery
          if ((msgType === 0x07 || msgType === 0x05) && message.length >= 8) {
            // For type 0x07 (Pearl S): weight appears to be in bytes 4-7
            // For type 0x05: weight is in bytes 4-7 as well
            // Format: big-endian integer representing grams * 10
            const weightRaw = (message[4] << 24) | 
                             (message[5] << 16) | 
                             (message[6] << 8) | 
                             message[7];
            const weightGrams = weightRaw / 10.0;
            
            if (weightGrams >= 0 && weightGrams < 10000) { // Sanity check
              console.log("Weight:", weightGrams, "g");
              setWeight(weightGrams);
            }
          } else if (msgType === 0x08 && message.length >= 5) {
            // Battery level in byte 4
            const batteryLevel = message[4];
            console.log("Battery:", batteryLevel, "%");
            setBattery(batteryLevel);
          }
          
          processedBytes = offset + totalLength;
        }
        
        // Keep unprocessed bytes in buffer
        return buffer.slice(processedBytes);
      });
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

      // Scan for PEARLS device only  
      console.log("Scanning for Acaia Pearl S scale...");
      const devices: any[] = [];
      
      await BleClient.requestLEScan({}, (result) => {
        // Only collect PEARLS devices
        if (result.localName?.startsWith('PEARLS') || result.device.name?.startsWith('PEARLS')) {
          if (!devices.find(d => d.device.deviceId === result.device.deviceId)) {
            devices.push(result);
            console.log('Found Acaia scale:', result.device.name || result.localName);
          }
        }
      });
      
      // Scan for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
      await BleClient.stopLEScan();
      
      console.log(`Scan complete. Found ${devices.length} Acaia scale(s)`);
      
      if (devices.length === 0) {
        toast.error("No Acaia scale found. Make sure it's turned on.");
        setConnectionStatus("disconnected");
        return;
      }
      
      // Use the first PEARLS device found
      const device = devices[0].device;
      console.log("Connecting to Acaia scale:", device.deviceId, device.name);

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

      // Get services to verify connection and discover characteristics
      console.log("Getting services...");
      const services = await BleClient.getServices(device.deviceId);
      console.log("Services discovered:", services.length);
      
      // Log all services and characteristics
      services.forEach((service, idx) => {
        console.log(`Service ${idx}:`, service.uuid);
        service.characteristics.forEach((char, charIdx) => {
          console.log(`  Characteristic ${charIdx}:`, char.uuid, 'Properties:', char.properties);
        });
      });
      
      // Find the Acaia service
      const acaiaService = services.find(s => s.uuid === ACAIA_SERVICE_UUID);
      if (!acaiaService) {
        toast.error("Acaia service not found on this device");
        setConnectionStatus("disconnected");
        return;
      }
      
      console.log("Acaia service found with", acaiaService.characteristics.length, "characteristics");
      
      // Find the notify characteristic (should have 'notify' property)
      const notifyChar = acaiaService.characteristics.find(c => c.properties.notify);
      if (!notifyChar) {
        toast.error("No notify characteristic found");
        setConnectionStatus("disconnected");
        return;
      }
      
      console.log("Using notify characteristic:", notifyChar.uuid);

      // Start notifications for weight data
      console.log("Starting notifications...");
      await BleClient.startNotifications(
        device.deviceId,
        ACAIA_SERVICE_UUID,
        notifyChar.uuid,
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
