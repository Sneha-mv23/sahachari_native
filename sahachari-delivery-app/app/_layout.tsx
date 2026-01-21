import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SnackbarProvider } from 'src/components/ui/Snackbar';

const queryClient = new QueryClient();

export default function RootLayout() {
  console.log('[RootLayout] render');
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


