import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sahachari Platform</Text>
        <Text style={styles.subtitle}>Select an app to explore</Text>
        <Text style={styles.info}>37 screens • 3 mobile apps</Text>

        {/* Storekeeper App */}
        <TouchableOpacity style={styles.appCard}>
          <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="storefront" size={32} color="#FFF" />
          </View>
          <View style={styles.appInfo}>
            <Text style={styles.appTitle}>Storekeeper App</Text>
            <Text style={styles.appDescription}>Manage products, orders & offers</Text>
            <Text style={styles.screenCount}>16 screens</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9E9E9E" />
        </TouchableOpacity>

        {/* Customer App */}
        <TouchableOpacity style={styles.appCard}>
          <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="cart" size={32} color="#FFF" />
          </View>
          <View style={styles.appInfo}>
            <Text style={styles.appTitle}>Customer App</Text>
            <Text style={styles.appDescription}>Shop from local stores</Text>
            <Text style={styles.screenCount}>14 screens</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9E9E9E" />
        </TouchableOpacity>

        {/* Delivery Partner App */}
        <TouchableOpacity 
          style={styles.appCard}
          onPress={() => router.push('/delivery')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#FF5722' }]}>
            <Ionicons name="bicycle" size={32} color="#FFF" />
          </View>
          <View style={styles.appInfo}>
            <Text style={styles.appTitle}>Delivery Partner App</Text>
            <Text style={styles.appDescription}>Earn by delivering orders</Text>
            <Text style={styles.screenCount}>7 screens</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9E9E9E" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 32,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  screenCount: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
});