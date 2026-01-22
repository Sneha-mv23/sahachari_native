import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const show = async () => {
      // Prevent the native splash from auto-hiding while we wait
      try {
        await ExpoSplashScreen.preventAutoHideAsync();
      } catch (e) {
        // log for debugging — some environments (web/dev) may not support this
        // eslint-disable-next-line no-console
        console.warn('[Splash] preventAutoHideAsync failed', e);
      }

      // Safety fallback: if hideAsync never runs, force navigation after 5s
      fallbackTimer = setTimeout(async () => {
        // eslint-disable-next-line no-console
        console.warn('[Splash] fallback triggered');
        try {
          await ExpoSplashScreen.hideAsync();
        } catch (_) { }
        if (mounted) router.replace('/delivery/login');
      }, 5000);

      // Wait 2 seconds to show the splash
      await new Promise((r) => setTimeout(r, 2000));

      try {
        await ExpoSplashScreen.hideAsync();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[Splash] hideAsync failed', e);
      }

      if (fallbackTimer) clearTimeout(fallbackTimer);

      if (mounted) {
        router.replace('/delivery/login');
      }
    };

    show();

    return () => {
      mounted = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name="bicycle" size={48} color="#FF5722" />
        </View>

        <Text style={styles.title}>Sahachari</Text>
        <Text style={styles.subtitle}>Delivery Partner</Text>

        <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 30 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D84315',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFE0B2',
  },
});
