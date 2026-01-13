import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';

import { api } from '../../services/api';
import { styles } from './styles/login.styles';

export default function DeliveryLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: async (user) => {
      await AsyncStorage.multiSet([
        ['deliveryUser', JSON.stringify(user)],
        ['isLoggedIn', 'true'],
      ]);
      router.replace('/delivery/(tabs)');
    },
    onError: (error: any) => {
      Alert.alert('Login Failed', error?.message || 'Invalid email or password');
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <LinearGradient colors={['#FF8A65', '#FF7043']} style={styles.header}>
          <Ionicons name="bicycle" size={60} color="#FFF" />
          <Text style={styles.headerTitle}>Delivery Partner</Text>
          <Text style={styles.headerSubtitle}>Start earning with deliveries</Text>
        </LinearGradient>

        {/* Card */}
        <View style={styles.card}>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <View style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Login</Text>
            </View>
            <TouchableOpacity style={styles.tab} onPress={() => router.push('/delivery/signup')}>
              <Text style={styles.tabText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loginMutation.isPending && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink}>Terms</Text> and{' '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
