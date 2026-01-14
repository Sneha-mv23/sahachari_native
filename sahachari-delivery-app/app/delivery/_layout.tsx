import { Stack } from 'expo-router';

export default function DeliveryLayout() {
  console.log('[DeliveryLayout] render');
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
