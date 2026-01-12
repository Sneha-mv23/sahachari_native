import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { api } from '../../services/api';

export default function DeliverySignup() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [currentPincode, setCurrentPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const addPincode = () => {
    console.log('[Signup] addPincode called - currentPincode:', currentPincode);

    if (currentPincode.trim().length === 6) {
      const updated = [...pincodes, currentPincode.trim()];
      setPincodes(updated);
      setCurrentPincode('');
      setStatusMessage('Pincode added');
      console.log('[Signup] pincode added, pincodes now:', updated);
      setTimeout(() => setStatusMessage(null), 2500);
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      setStatusMessage('Invalid pincode');
      setTimeout(() => setStatusMessage(null), 2500);
    }
  };

  const removePincode = (index: number) => {
    console.log('[Signup] removePincode called - index:', index);
    const updated = pincodes.filter((_, i) => i !== index);
    setPincodes(updated);
    setStatusMessage('Pincode removed');
    setTimeout(() => setStatusMessage(null), 2000);
  };

  const handleSignup = async () => {
    console.log('[Signup] handleSignup called', { name, email, password: password ? '***' : '', pincodes });
    setStatusMessage('Create Account pressed');
    setTimeout(() => setStatusMessage(null), 2000);

    if (!name || !email || !password) {
      console.log('[Signup] validation failed: missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      setStatusMessage('Missing required fields');
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }

    if (pincodes.length === 0) {
      console.log('[Signup] validation failed: no pincodes');
      Alert.alert('Error', 'Please add at least one serviceable pincode');
      setStatusMessage('Add at least one pincode');
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }

    try {
      setLoading(true);
      setStatusMessage('Calling API...');
      console.log('[Signup] calling API...');

      const payload = {
        name,
        email,
        password,
        pincodes,
      };

      console.log('[Signup] payload:', payload);

      const res = await api.signup(payload);

      console.log('[Signup] api response:', res);

      // Save server response (includes _id etc)
      await AsyncStorage.setItem('deliveryUser', JSON.stringify(res));
      Alert.alert('Success', 'Account created successfully');
      setStatusMessage('Signup success');
      setTimeout(() => setStatusMessage(null), 2000);
      router.back();
    } catch (error: any) {
      console.error('[Signup] error:', error);
      const msg = error?.message || String(error) || 'Signup failed. Please try again.';
      Alert.alert('Error', msg);
      setStatusMessage(`Error: ${msg}`);
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setLoading(false);
      console.log('[Signup] finished (loading false)');
    }
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
        {/* 🔶 TOP GRADIENT HEADER */}
        <LinearGradient colors={['#FF8A65', '#FF7043']} style={styles.header}>

          <Ionicons name="bicycle" size={56} color="#FFF" />
          <Text style={styles.headerTitle}>Delivery Partner</Text>
          <Text style={styles.headerSubtitle}>Start earning with deliveries</Text>
        </LinearGradient>

        {/* White Card Overlapping Gradient */}
        <View style={styles.card}>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tab} onPress={() => router.back()}>
              <Text style={styles.tabText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Debug status banner (temporary) */}
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
              onChangeText={setName}
              placeholder="Enter your full name"
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
              keyboardType="email-address"
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
              placeholder="Create a password"
              secureTextEntry
            />
          </View>

          <Text style={styles.label}>Serviceable Pincodes</Text>
          <View style={styles.pincodeRow}>
            <TextInput
              style={styles.pincodeInput}
              value={currentPincode}
              onChangeText={setCurrentPincode}
              placeholder="6-digit pincode"
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity style={styles.addButton} onPress={addPincode}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {pincodes.length > 0 && (
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
          )}

          <TouchableOpacity
            style={[styles.signupButton, loading && { opacity: 0.6 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>
              {loading ? 'Creating...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6dbdbff' },

  scrollContent: {
    flexGrow: 1,
  },

  /* Header */
  header: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFEFE8',
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginTop: -20, // overlaps the gradient
    marginBottom: 40,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android shadow
    elevation: 5,
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: { backgroundColor: Colors.white },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: '#FF6B35', fontWeight: '600' },

  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  input: { flex: 1, paddingVertical: 14, paddingLeft: 10 },

  pincodeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  pincodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
  },
  addButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: { color: Colors.white, fontWeight: '700' },

  pincodeList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusBanner: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  statusText: { color: '#8A4B00', fontWeight: '600' },
  pincodeChip: {
    backgroundColor: '#FFE0B2',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pincodeText: { color: '#F57C00', fontWeight: '600' },

  signupButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});