import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { BleClient, numbersToDataView, numberToUUID } from '@capacitor-community/bluetooth-le';

// Acaia BLE Service and Characteristic UUIDs
const ACAIA_SERVICE_UUID = "49535343-fe7d-4ae5-8fa9-9fafd205e455";
// UUIDs from aioacaia library (for Pearl S)
const ACAIA_CHAR_WRITE_UUID = "49535343-8841-43f4-a8d4-ecbe34729bb3"; // DEFAULT_CHAR_ID 
const ACAIA_CHAR_NOTIFY_UUID = "49535343-1e4d-4bd9-ba61-23c647249616"; // NOTIFY_CHAR_ID

// Helper function to encode Acaia protocol messages (from pyacaia)
function encodeAcaiaMessage(msgType: number, payload: number[]): Uint8Array {
  const bytes = new Uint8Array(5 + payload.length);
  bytes[0] = 0xef; // HEADER1
  bytes[1] = 0xdd; // HEADER2
  bytes[2] = msgType;
  
  let cksum1 = 0;
  let cksum2 = 0;
  
  for (let i = 0; i < payload.length; i++) {
    const val = payload[i] & 0xff;
    bytes[3 + i] = val;
    if (i % 2 === 0) {
      cksum1 += val;
    } else {
      cksum2 += val;
    }
  }
  
  bytes[payload.length + 3] = cksum1 & 0xff;
  bytes[payload.length + 4] = cksum2 & 0xff;
  
  return bytes;
}

// Encode event data for notification request
function encodeEventData(payload: number[]): Uint8Array {
  const wrappedPayload = [payload.length + 1, ...payload];
  return encodeAcaiaMessage(12, wrappedPayload);
}

// Acaia Protocol Commands (from pyacaia library)
// IDENTIFY: Required handshake command - for Pearl S (PEARLS- prefix)
const ACAIA_CMD_IDENTIFY = encodeAcaiaMessage(11, [
  0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x30, 0x31, 0x32, 0x33, 0x34
]);

// NOTIFICATION_REQUEST: Enables weight, battery, timer, key, setting notifications
// For Pearl S (new_style_data): payload = [0, 5, 0, 1, 1, 2, 2, 5, 3, 4]
// Format: [request_type=0, event_count=5, then pairs of (weight_event_type, enable)]
const ACAIA_CMD_NOTIFICATION_REQUEST = encodeEventData([0, 5, 0, 1, 1, 2, 2, 5, 3, 4]);

// HEARTBEAT: Keep-alive command
const ACAIA_CMD_HEARTBEAT = encodeAcaiaMessage(0, [2, 0]);

// TARE: Zero the scale
const ACAIA_CMD_TARE = encodeAcaiaMessage(4, [0]);

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
  debugLog: string[];
}

export const useAcaiaScale = (): UseAcaiaScaleReturn => {
  // ALL useState hooks must come first
  const [weight, setWeight] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [battery, setBattery] = useState(85);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [writeCharUuid, setWriteCharUuid] = useState<string | null>(null);
  
  // ALL useRef hooks must come after all useState hooks
  const dataBufferRef = useRef<number[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoReconnectEnabledRef = useRef(false);
  const connectFunctionRef = useRef<(() => Promise<void>) | null>(null);
  const parseWeightDataRef = useRef<((dataView: DataView) => void) | null>(null);
  
  // Helper to add debug messages (keeps last 20) - defined after all hooks
  const addDebug = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev.slice(-19), `${time}: ${msg}`]);
    console.log(msg);
  }, []);
  
  // Diagnostic refs for tracking without causing re-renders
  const diagnosticsRef = useRef({
    connectionStartTime: 0,
    writeCount: 0,
    notificationCount: 0,
    lastHeartbeatTime: 0
  });
  const diagnosticsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Diagnostic state object built from refs (computed, not stored in useState)
  const connectionDiagnostics: ConnectionDiagnostics = {
    connectionStartTime: diagnosticsRef.current.connectionStartTime,
    connectionDuration: diagnosticsRef.current.connectionStartTime ? 
      (Date.now() - diagnosticsRef.current.connectionStartTime) / 1000 : 0,
    totalWrites: diagnosticsRef.current.writeCount,
    totalNotifications: diagnosticsRef.current.notificationCount,
    lastDisconnectReason: '',
    sessionHistory: []
  };

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
      const hexStr = newBytes.map(b => b.toString(16).padStart(2, '0')).join(' ');
      addDebug(`RX #${diagnosticsRef.current.notificationCount}: ${hexStr}`);
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
        
        // Decode weight from payload according to pyacaia protocol
        const decodeWeight = (payload: number[]): number | null => {
          if (payload.length < 6) return null;
          
          // Little-endian: low byte first, high byte second
          const rawValue = (payload[1] << 8) | payload[0];
          const unit = payload[4] & 0xff;
          
          let value = rawValue;
          if (unit === 1) value = rawValue / 10.0;
          else if (unit === 2) value = rawValue / 100.0;
          else if (unit === 3) value = rawValue / 1000.0;
          else if (unit === 4) value = rawValue / 10000.0;
          
          // Check for negative (sign bit at payload[5])
          if ((payload[5] & 0x02) === 0x02) {
            value *= -1;
          }
          
          console.log(`  Weight decode: raw=${rawValue}, unit=${unit}, value=${value}g`);
          return value;
        };

        // Command 0x0c (12) is event notification - actual msgType is at byte[4]
        if (msgType === 0x0c && message.length >= 6) {
          const eventType = message[4];
          const payload = message.slice(5);
          console.log(`🔍 Event notification: type=${eventType}, payload length=${payload.length}`);
          
          if (eventType === 5 && payload.length >= 6) {
            // Direct weight message
            const weight = decodeWeight(payload);
            if (weight !== null && weight >= -1000 && weight < 10000) {
              setWeight(weight);
              console.log(`✅ Weight updated to ${weight}g`);
            }
          } else if (eventType === 11 && payload.length >= 4) {
            // Heartbeat response - may contain weight
            if (payload[2] === 5 && payload.length >= 9) {
              const weight = decodeWeight(payload.slice(3));
              if (weight !== null && weight >= -1000 && weight < 10000) {
                setWeight(weight);
                console.log(`✅ Weight from heartbeat: ${weight}g`);
              }
            }
          } else if (eventType === 8 && payload.length >= 2) {
            // Button event (tare, start, stop, reset)
            if (payload[0] === 0 && payload[1] === 5 && payload.length >= 8) {
              // Tare button - contains weight
              const weight = decodeWeight(payload.slice(2));
              if (weight !== null) {
                setWeight(weight);
                console.log(`✅ Weight after tare: ${weight}g`);
              }
            }
          }
        } else if (msgType === 0x05 && message.length >= 10) {
          // Direct weight message (msgType 5)
          const payload = message.slice(4);
          const weight = decodeWeight(payload);
          if (weight !== null && weight >= -1000 && weight < 10000) {
            setWeight(weight);
            console.log(`✅ Direct weight: ${weight}g`);
          }
        } else if (msgType === 0x08 && message.length >= 6) {
          // Settings/Battery data (cmd 8)
          // Battery is at payload[1] & 0x7F where payload starts at length byte (message[3])
          const batteryLevel = message[4] & 0x7f;
          console.log(`🔋 Battery: ${batteryLevel}%`);
          if (batteryLevel > 0 && batteryLevel <= 100) {
            setBattery(batteryLevel);
          }
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
  }, [addDebug]);

  // Keep ref updated with latest parseWeightData
  useEffect(() => {
    parseWeightDataRef.current = parseWeightData;
  }, [parseWeightData]);

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

      // === Get MTU for diagnostics (Acaia recommends 247) ===
      let mtuValue = 0;
      try {
        mtuValue = await BleClient.getMtu(device.deviceId);
        console.log(`📏 MTU negotiated: ${mtuValue} (Acaia recommends 247)`);
        addDebug(`MTU: ${mtuValue}`);
      } catch (mtuError) {
        console.log("MTU check not supported on this platform");
      }
      
      addDebug(`Notify char: ${notifyChar.uuid.slice(-8)}`);
      addDebug(`Write char: ${writeChar.uuid.slice(-8)}`);
      
      // Start notifications for weight data BEFORE sending commands
      console.log("Starting notifications...");
      await BleClient.startNotifications(
        device.deviceId,
        ACAIA_SERVICE_UUID,
        notifyChar.uuid,
        (value) => {
          console.log(`🔔 NOTIFY callback - ${value.byteLength} bytes`);
          // Use ref to always get latest parseWeightData function
          if (parseWeightDataRef.current) {
            parseWeightDataRef.current(value);
          }
        }
      );
      addDebug("Notifications started");
      console.log("✅ Notifications started on characteristic:", notifyChar.uuid);
      
      // Small delay to ensure notifications are ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // === ACAIA HANDSHAKE PROTOCOL (REQUIRED) ===
      console.log("🤝 V12.0 - IMPLEMENTING PROPER ACAIA HANDSHAKE PROTOCOL");
      
      // Step 1: Send IDENTIFY command (required for handshake)
      diagnosticsRef.current.writeCount++;
      console.log(`✍️  Write #${diagnosticsRef.current.writeCount}: IDENTIFY (handshake)`);
      await BleClient.write(device.deviceId, ACAIA_SERVICE_UUID, writeChar.uuid, numbersToDataView(Array.from(ACAIA_CMD_IDENTIFY)));
      console.log("✅ IDENTIFY sent");
      
      // Small delay between commands
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Step 2: Send NOTIFICATION_REQUEST to enable weight data
      diagnosticsRef.current.writeCount++;
      console.log(`✍️  Write #${diagnosticsRef.current.writeCount}: NOTIFICATION_REQUEST`);
      await BleClient.write(device.deviceId, ACAIA_SERVICE_UUID, writeChar.uuid, numbersToDataView(Array.from(ACAIA_CMD_NOTIFICATION_REQUEST)));
      console.log("✅ NOTIFICATION_REQUEST sent");
      
      // Small delay before heartbeat
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Step 3: Send initial HEARTBEAT
      diagnosticsRef.current.writeCount++;
      diagnosticsRef.current.lastHeartbeatTime = Date.now();
      console.log(`✍️  Write #${diagnosticsRef.current.writeCount}: Initial HEARTBEAT`);
      await BleClient.write(device.deviceId, ACAIA_SERVICE_UUID, writeChar.uuid, numbersToDataView(Array.from(ACAIA_CMD_HEARTBEAT)));
      console.log("✅ Initial HEARTBEAT sent");

      setDeviceId(device.deviceId);
      setWriteCharUuid(writeChar.uuid);
      setIsConnected(true);
      setConnectionStatus("connected");
      setWeight(0);
      setBattery(85);
      autoReconnectEnabledRef.current = true;
      
      // Start periodic diagnostics logging every 10 seconds
      diagnosticsIntervalRef.current = setInterval(() => {
        logConnectionDiagnostics();
      }, 10000);
      
      toast.success(`Connected with proper handshake (MTU: ${mtuValue || 'default'})`);
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnected(false);
      setConnectionStatus("disconnected");
      setDeviceId(null);
      autoReconnectEnabledRef.current = false; // Disable auto-reconnect on failure
    }
  }, [addDebug, logConnectionDiagnostics]);

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
      // Use proper Acaia tare command (6 bytes)
      diagnosticsRef.current.writeCount++;
      console.log(`✍️  Write #${diagnosticsRef.current.writeCount}: Tare`);
      await BleClient.write(deviceId, ACAIA_SERVICE_UUID, writeCharUuid, numbersToDataView(Array.from(ACAIA_CMD_TARE)));
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
        // Use proper Acaia heartbeat command (7 bytes)
        await BleClient.write(deviceId, ACAIA_SERVICE_UUID, writeCharUuid, numbersToDataView(Array.from(ACAIA_CMD_HEARTBEAT)));
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
    debugLog,
  };
};
