import { Stack } from 'expo-router';

export default function DeliveryLayout() {
  console.log('[DeliveryLayout] render');
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
