import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { SnackbarProvider } from 'src/components/ui/Snackbar';
import { subscribeLogout } from 'src/services/authEvents';

const queryClient = new QueryClient();

export default function RootLayout() {
  console.log('[RootLayout] render');
  const router = useRouter();

  useEffect(() => {
    const unsub = subscribeLogout(() => {
      // Show a message and navigate to login
      try {
        Alert.alert('Session expired', 'Please login again.');
      } catch (e) {
        // ignore
      }
      router.replace('/delivery/login');
    });

    return () => unsub();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <>
        {/* SnackbarProvider provides a global show() toasts */}
        <SnackbarProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="delivery" />
          </Stack>
          <StatusBar style="auto" />
        </SnackbarProvider>
      </>
    </QueryClientProvider>
  );
}


