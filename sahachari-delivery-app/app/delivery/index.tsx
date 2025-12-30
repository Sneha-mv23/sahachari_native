import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';

export default function DeliveryLogin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simple validation for demo
    const savedUser = await AsyncStorage.getItem('deliveryUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.email === email && user.password === password) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        router.replace('/delivery/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } else {
      Alert.alert('Error', 'No account found. Please signup first.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.switchButton}>
          <Text style={styles.switchButtonText}>Switch App</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Delivery Partner Portal</Text>
        <Text style={styles.subtitle}>Start earning with deliveries</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
            onPress={() => setActiveTab('login')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'login' && styles.activeTabText,
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
            onPress={() => router.push('/delivery/signup')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'signup' && styles.activeTabText,
              ]}
            >
              Signup
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder=""
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    alignItems: 'flex-end',
    padding: 16,
    paddingTop: 50,
  },
  switchButton: {
    backgroundColor: '#9E9E9E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  switchButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: Colors.white,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});