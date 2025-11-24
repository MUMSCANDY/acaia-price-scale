import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { BleClient, numbersToDataView, numberToUUID } from '@capacitor-community/bluetooth-le';

// Acaia BLE Service and Characteristic UUIDs (from reverse engineering)
const ACAIA_SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";
const ACAIA_CHAR_WRITE_UUID = "49535343-6daa-4d02-abf6-19569aca69fe";
const ACAIA_CHAR_NOTIFY_UUID = "49535343-aca3-481c-91ec-d85e28a60318";

interface ConnectionDiagnostics {
  connectionStartTime: number;
  connectionDuration: number;
  totalWrites: number;
  totalNotifications: number;
  lastDisconnectReason: string;
  sessionHistory: Array<{
    duration: number;
    writes: number;
    notifications: number;
    timestamp: string;
  }>;
}

interface UseAcaiaScaleReturn {
  weight: number;
  isConnected: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected";
  battery: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  tare: () => void;
  diagnostics: ConnectionDiagnostics;
}

export const useAcaiaScale = (): UseAcaiaScaleReturn => {
  const [weight, setWeight] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [battery, setBattery] = useState(85);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [writeCharUuid, setWriteCharUuid] = useState<string | null>(null);
  
  // Connection diagnostics state
  const [connectionDiagnostics, setConnectionDiagnostics] = useState<ConnectionDiagnostics>({
    connectionStartTime: 0,
    connectionDuration: 0,
    totalWrites: 0,
    totalNotifications: 0,
    lastDisconnectReason: '',
    sessionHistory: []
  });
  
  // Use refs for buffer, reconnect, and auto-reconnect flag
  const dataBufferRef = useRef<number[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoReconnectEnabledRef = useRef(false); // Use ref to avoid closure issues
  const connectFunctionRef = useRef<(() => Promise<void>) | null>(null);
  
  // Diagnostic refs for tracking without causing re-renders
  const diagnosticsRef = useRef({
    connectionStartTime: 0,
    writeCount: 0,
    notificationCount: 0,
    lastHeartbeatTime: 0
  });
  const diagnosticsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Diagnostic logging function
  const logConnectionDiagnostics = useCallback(() => {
    const now = Date.now();
    const duration = (now - diagnosticsRef.current.connectionStartTime) / 1000;
    
    console.log("═══════════════════════════════════════════════");
    console.log("📊 CONNECTION DIAGNOSTICS");
    console.log(`⏱️  Duration: ${duration.toFixed(1)}s`);
    console.log(`✍️  Total Writes: ${diagnosticsRef.current.writeCount}`);
    console.log(`📬 Total Notifications: ${diagnosticsRef.current.notificationCount}`);
    console.log(`💓 Last Heartbeat: ${((now - diagnosticsRef.current.lastHeartbeatTime) / 1000).toFixed(1)}s ago`);
    console.log(`📈 Avg Notifications/sec: ${(diagnosticsRef.current.notificationCount / duration).toFixed(2)}`);
    console.log("═══════════════════════════════════════════════");
  }, []);

  // Parse weight data from Acaia scale with proper buffering
  const parseWeightData = useCallback((dataView: DataView) => {
    try {
      // Increment notification counter
      diagnosticsRef.current.notificationCount++;
      
      // Convert to byte array and add to buffer
      const newBytes = Array.from(new Uint8Array(dataView.buffer));
      console.log(`📥 RAW DATA RECEIVED (notification #${diagnosticsRef.current.notificationCount}):`, newBytes.map(b => b.toString(16).padStart(2, '0')).join(' '));
      dataBufferRef.current = [...dataBufferRef.current, ...newBytes];
      
      // Process complete messages from buffer
      while (dataBufferRef.current.length >= 4) {
        // Look for message header (0xef 0xdd)
        const headerIndex = dataBufferRef.current.findIndex((byte, i) => 
          byte === 0xef && dataBufferRef.current[i + 1] === 0xdd
        );
        
        if (headerIndex === -1) {
          // No valid header found, clear buffer
          console.log("⚠️ No valid header found, clearing buffer");
          dataBufferRef.current = [];
          break;
        }
        
        // Remove any bytes before the header
        if (headerIndex > 0) {
          dataBufferRef.current = dataBufferRef.current.slice(headerIndex);
        }
        
        // Check if we have enough bytes for header
        if (dataBufferRef.current.length < 4) {
          break;
        }
        
        const msgType = dataBufferRef.current[2];
        const msgLength = dataBufferRef.current[3];
        const totalLength = 4 + msgLength;
        
        console.log(`📦 Message type: 0x${msgType.toString(16).padStart(2, '0')}, length: ${msgLength}, total: ${totalLength}`);
        
        // Check if we have complete message
        if (dataBufferRef.current.length < totalLength) {
          // Wait for more data
          console.log("⏳ Waiting for more data...");
          break;
        }
        
        // Extract complete message
        const message = dataBufferRef.current.slice(0, totalLength);
        console.log("📦 Complete message:", message.map(b => b.toString(16).padStart(2, '0')).join(' '));
        
        // Process the message
        if ((msgType === 0x07 || msgType === 0x05) && message.length >= 11) {
          // For Acaia Pearl S (type 0x07), weight is in bytes 6-7 (little-endian)
          // Message structure: ef dd 07 07 [4] [5] [6] [7] [8] [9] [10]
          // Example: ef dd 07 07 03 5c 01 00 05 01 64 -> weight at bytes 6-7
          const weightLow = message[6];
          const weightHigh = message[7];
          const weightRaw = (weightHigh << 8) | weightLow;
          const weightGrams = weightRaw / 10.0;
          
          console.log(`⚖️ Weight parsed: ${weightGrams}g (raw: ${weightRaw}, bytes: ${weightLow.toString(16)} ${weightHigh.toString(16)})`);
          
          if (weightGrams >= 0 && weightGrams < 10000) {
            setWeight(weightGrams);
          }
        } else if (msgType === 0x08 && message.length >= 5) {
          // Battery data
          const batteryLevel = message[4];
          console.log(`🔋 Battery: ${batteryLevel}%`);
          setBattery(batteryLevel);
        } else if (msgType === 0x0c) {
          // Heartbeat/status message
          console.log("💓 Heartbeat/status message received");
        } else {
          console.log(`❓ Unknown message type: 0x${msgType.toString(16).padStart(2, '0')}`);
        }
        
        // Remove processed message from buffer
        dataBufferRef.current = dataBufferRef.current.slice(totalLength);
      }
    } catch (error) {
      console.error("❌ Error parsing data:", error);
      dataBufferRef.current = []; // Clear buffer on error
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
    
    // Reset diagnostics at connection start
    diagnosticsRef.current = {
      connectionStartTime: Date.now(),
      writeCount: 0,
      notificationCount: 0,
      lastHeartbeatTime: Date.now()
    };
    console.log("🔬 Diagnostics reset - tracking started at", new Date().toISOString());
    
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

      // Connect to device with auto-reconnect handler
      console.log("Connecting to device...");
      await BleClient.connect(device.deviceId, (disconnectedDeviceId) => {
        const duration = (Date.now() - diagnosticsRef.current.connectionStartTime) / 1000;
        console.log(`⚠️ DISCONNECTED from ${disconnectedDeviceId} after ${duration.toFixed(1)}s`);
        
        // Log full diagnostics
        logConnectionDiagnostics();
        
        // Save session to history
        setConnectionDiagnostics(prev => ({
          ...prev,
          lastDisconnectReason: 'Connection lost',
          sessionHistory: [...prev.sessionHistory, {
            duration,
            writes: diagnosticsRef.current.writeCount,
            notifications: diagnosticsRef.current.notificationCount,
            timestamp: new Date().toISOString()
          }]
        }));
        
        // Clear diagnostic interval
        if (diagnosticsIntervalRef.current) {
          clearInterval(diagnosticsIntervalRef.current);
          diagnosticsIntervalRef.current = null;
        }
        
        setIsConnected(false);
        setConnectionStatus("disconnected");
        setDeviceId(null);
        
        // Auto-reconnect if enabled (use ref to avoid closure issues)
        if (autoReconnectEnabledRef.current && connectFunctionRef.current) {
          console.log("🔄 Auto-reconnect enabled - will reconnect in 2s");
          toast.info("Scale disconnected - reconnecting...");
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("🔄 Attempting auto-reconnect...");
            connectFunctionRef.current?.();
          }, 2000);
        } else {
          toast.info("Scale disconnected");
        }
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
      
      // Find the write characteristic - must be different from notify characteristic
      // Look for one with writeWithoutResponse or write that is NOT the notify characteristic
      const writeChar = acaiaService.characteristics.find(c => 
        c.uuid !== notifyChar.uuid && (c.properties.write || c.properties.writeWithoutResponse)
      );
      if (!writeChar) {
        toast.error("No write characteristic found");
        setConnectionStatus("disconnected");
        return;
      }
      
      console.log("Using notify characteristic:", notifyChar.uuid);
      console.log("Using write characteristic:", writeChar.uuid);
      setWriteCharUuid(writeChar.uuid);

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
      
      // === VERSION 11.0: REF-BASED HEARTBEAT ===
      console.log("🚀 V11.0 - REF-BASED HEARTBEAT (CLOSURE FIX)");
      
      // Just send timer start
      const timerStartCommand = new Uint8Array([0xef, 0xdd, 0x0d, 0x00]);
      diagnosticsRef.current.writeCount++;
      console.log(`✍️  Write #${diagnosticsRef.current.writeCount}: Timer start`);
      await BleClient.write(device.deviceId, ACAIA_SERVICE_UUID, writeChar.uuid, numbersToDataView(Array.from(timerStartCommand)));
      console.log("✅ Timer started");

      setDeviceId(device.deviceId);
      setIsConnected(true);
      setConnectionStatus("connected");
      setWeight(0);
      setBattery(85);
      autoReconnectEnabledRef.current = true; // Keep auto-reconnect as backup
      
      // Start periodic diagnostics logging every 10 seconds
      diagnosticsIntervalRef.current = setInterval(() => {
        logConnectionDiagnostics();
      }, 10000);
      
      toast.success("Connected - heartbeat enabled");
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnected(false);
      setConnectionStatus("disconnected");
      setDeviceId(null);
      autoReconnectEnabledRef.current = false; // Disable auto-reconnect on failure
    }
  }, [parseWeightData]);

  // Store connect function ref
  useEffect(() => {
    connectFunctionRef.current = connect;
  }, [connect]);

  // Disconnect from scale
  const disconnect = useCallback(async () => {
    // Log final diagnostics before disconnect
    if (isConnected) {
      const duration = (Date.now() - diagnosticsRef.current.connectionStartTime) / 1000;
      console.log(`🔌 Manual disconnect after ${duration.toFixed(1)}s`);
      logConnectionDiagnostics();
    }
    
    // Disable auto-reconnect
    autoReconnectEnabledRef.current = false;
    
    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Clear heartbeat interval
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    
    // Clear diagnostics interval
    if (diagnosticsIntervalRef.current) {
      clearInterval(diagnosticsIntervalRef.current);
      diagnosticsIntervalRef.current = null;
    }
    
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
  }, [deviceId, isConnected, logConnectionDiagnostics]);

  // Send tare command to scale
  const tare = useCallback(async () => {
    if (!deviceId || !writeCharUuid) {
      toast.error("Scale not connected");
      return;
    }
    
    try {
      // Acaia tare command: 0xef 0xdd 0x04 0x00
      const tareCommand = new Uint8Array([0xef, 0xdd, 0x04, 0x00]);
      diagnosticsRef.current.writeCount++;
      console.log(`✍️  Write #${diagnosticsRef.current.writeCount}: Tare`);
      await BleClient.write(deviceId, ACAIA_SERVICE_UUID, writeCharUuid, numbersToDataView(Array.from(tareCommand)));
      toast.success("Scale tared");
      setWeight(0);
    } catch (error) {
      console.error("Tare error:", error);
      toast.error("Failed to tare scale");
    }
  }, [deviceId, writeCharUuid]);

  // Ref-based heartbeat every 4 seconds (avoids closure issues!)
  useEffect(() => {
    if (!isConnected || !deviceId || !writeCharUuid) {
      return;
    }

    console.log("🔧 Starting ref-based 4s heartbeat");
    
    const sendHeartbeat = async () => {
      try {
        diagnosticsRef.current.lastHeartbeatTime = Date.now();
        diagnosticsRef.current.writeCount++;
        const heartbeat = new Uint8Array([0xef, 0xdd, 0x0d, 0x00]);
        await BleClient.write(deviceId, ACAIA_SERVICE_UUID, writeCharUuid, numbersToDataView(Array.from(heartbeat)));
        console.log(`💓 Heartbeat #${diagnosticsRef.current.writeCount}`);
      } catch (error) {
        console.error("❌ HB failed:", error);
      }
    };
    
    // Send immediately
    sendHeartbeat();
    
    // Then every 4 seconds
    const intervalId = setInterval(sendHeartbeat, 4000);

    return () => {
      console.log("🧹 Stopping heartbeat");
      clearInterval(intervalId);
    };
  }, [isConnected, deviceId, writeCharUuid]); // Dependencies ensure we get latest values
  
  // V9.0: NO HEARTBEAT - let scale's data flow maintain connection naturally
  
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
    diagnostics: connectionDiagnostics,
  };
};
