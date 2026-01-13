import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
<<<<<<< HEAD
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
=======
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './delivery/(tabs)/config/queryClient';
>>>>>>> 5250b6530a7a1dabfdba8b438226f4dad449c8aa

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Stack screenOptions={{ headerShown: false }}>
<<<<<<< HEAD
          <Stack.Screen name="login" />
=======
          <Stack.Screen name="index" />
>>>>>>> 5250b6530a7a1dabfdba8b438226f4dad449c8aa
          <Stack.Screen name="delivery" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </QueryClientProvider>
  );
<<<<<<< HEAD
}


=======
}
>>>>>>> 5250b6530a7a1dabfdba8b438226f4dad449c8aa
