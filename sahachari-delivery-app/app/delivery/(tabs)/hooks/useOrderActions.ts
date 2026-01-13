import { useCallback } from 'react';
import { Linking } from 'react-native';
import { DEFAULT_PHONE } from '../constants';

interface UseOrderActionsReturn {
  handleNavigate: (address: string) => void;
  handleCall: (phone?: string) => void;
}

export const useOrderActions = (): UseOrderActionsReturn => {
  const handleNavigate = useCallback((address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  }, []);

  const handleCall = useCallback((phone: string = DEFAULT_PHONE) => {
    Linking.openURL(`tel:${phone}`);
  }, []);

  return {
    handleNavigate,
    handleCall,
  };
};
