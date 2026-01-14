import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to monitor network status and automatically handle React Query behavior
 * For production, install: npm install @react-native-community/netinfo
 * Then uncomment the NetInfo imports below
 */

// Uncomment when NetInfo is installed:
// import NetInfo from '@react-native-community/netinfo';

/**
 * Hook to monitor network status and automatically handle React Query behavior
 * Pauses queries when offline and resumes when back online
 * This is essential for mobile apps where connectivity is unreliable
 */
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const queryClient = useQueryClient();

  useEffect(() => {
    // Monitor online/offline events
    const handleOnline = () => {
      setIsConnected(true);
      setConnectionType('online');
      console.log('[Network Status] Back online');

      // Resume all paused queries when reconnected
      queryClient.resumePausedMutations?.().then(() => {
        queryClient.invalidateQueries();
      });
    };

    const handleOffline = () => {
      setIsConnected(false);
      setConnectionType('offline');
      console.log('[Network Status] Went offline');

      // Note: pauseMutations is handled via networkMode in QueryClient config
      // No need to manually pause - React Query handles this automatically
    };

    // Listen to online/offline events (works in both Expo and native)
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Optional: Check initial network status with NetInfo if available
    // Uncomment when NetInfo is installed:
    // const checkNetworkStatus = async () => {
    //   const state = await NetInfo.fetch();
    //   setIsConnected(state.isConnected ?? true);
    //   setConnectionType(state.type || 'unknown');
    // };
    // checkNetworkStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  return {
    isConnected,
    connectionType,
    isOnline: isConnected,
    isOffline: !isConnected,
  };
};

/**
 * Hook to show network status UI
 * Returns whether to show offline indicator
 */
export const useShowOfflineIndicator = () => {
  const { isConnected } = useNetworkStatus();
  return !isConnected;
};
