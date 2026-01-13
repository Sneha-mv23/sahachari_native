import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './delivery/(tabs)/config/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="delivery" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </QueryClientProvider>
  );
}