import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

/**
 * useNetworkMonitor()
 * 
 * Watches for connectivity changes.
 * Returns a boolean: true = online, false = offline.
 * 
 * Usage:
 *   const isOnline = useNetworkMonitor();
 */
export default function useNetworkMonitor() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      // state.isConnected can be null, coerce to boolean
      setIsOnline(!!state.isConnected);
    });

    // Check immediately on mount
    NetInfo.fetch().then((state) => setIsOnline(!!state.isConnected));

    // Clean up listener
    return () => unsubscribe();
  }, []);

  return isOnline;
}