import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../src/features/delivery/styles/signup.styles';
import { api } from '../../src/services/api';

export default function DeliverySignup() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [currentPincode, setCurrentPincode] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // 🔹 TanStack mutation
  const signupMutation = useMutation({
    mutationFn: (payload: any) => api.signup(payload),
    onSuccess: async (res) => {
      await AsyncStorage.setItem('deliveryUser', JSON.stringify(res));
      Alert.alert('Success', 'Account created successfully');
      setStatusMessage('Signup success');
      setTimeout(() => setStatusMessage(null), 2000);
      router.back();
    },
    onError: (error: any) => {
      console.error('[Signup] mutation error:', error);
      const msg = error?.message || 'Signup failed. Please try again.';
      Alert.alert('Error', msg);
      setStatusMessage(msg);
      setTimeout(() => setStatusMessage(null), 3000);
    },
  });

  const addPincode = () => {
    if (currentPincode.trim().length === 6) {
      setPincodes([...pincodes, currentPincode.trim()]);
      setCurrentPincode('');
      setStatusMessage('Pincode added');
      setTimeout(() => setStatusMessage(null), 2000);
    } else {
      Alert.alert('Error', 'Enter a valid 6-digit pincode');
    }
  };

  const removePincode = (index: number) => {
    setPincodes(pincodes.filter((_, i) => i !== index));
  };

  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // if (pincodes.length === 0) {
    //   Alert.alert('Error', 'Add at least one pincode');
    //   return;
    // }

    signupMutation.mutate({
      name,
      email,
      password,
      // pincode: pincodes,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
            <TouchableOpacity style={styles.tab} onPress={() => router.replace('/delivery/login')}>
              <Text style={styles.tabText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Status */}
          {statusMessage && (
            <View style={styles.statusBanner}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          )}

          {/* Form */}
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#999" />
            <TextInput
              style={styles.input}
              value={name}
              placeholder="Enter your full name"
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#999" />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          <Text style={styles.label}>Serviceable Pincodes</Text>
          <View style={styles.pincodeRow}>
            <Ionicons name="location-outline" size={30} color="#999" />
            <TextInput
              style={styles.pincodeInput}
              value={currentPincode}
              onChangeText={setCurrentPincode}
              keyboardType="number-pad"
              placeholder="Enter pincode"
              maxLength={6}
            />
            <TouchableOpacity style={styles.addButton} onPress={addPincode}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pincodeList}>
            {pincodes.map((pin, index) => (
              <TouchableOpacity
                key={index}
                style={styles.pincodeChip}
                onPress={() => removePincode(index)}
              >
                <Text style={styles.pincodeText}>{pin} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.signupButton,
              signupMutation.isPending && { opacity: 0.6 },
            ]}
            onPress={handleSignup}
            disabled={signupMutation.isPending}
          >
            <Text style={styles.signupButtonText}>
              {signupMutation.isPending ? 'Creating...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}