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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function DeliverySignup() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [currentPincode, setCurrentPincode] = useState('');

  const addPincode = () => {
    if (currentPincode.length === 6) {
      setPincodes([...pincodes, currentPincode]);
      setCurrentPincode('');
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
    }
  };

  const removePincode = (index: number) => {
    setPincodes(pincodes.filter((_, i) => i !== index));
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (pincodes.length === 0) {
      Alert.alert('Error', 'Please add at least one serviceable pincode');
      return;
    }

    const userData = {
      name,
      email,
      password,
      pincodes,
      totalDeliveries: 0,
      totalEarnings: 0,
    };

    await AsyncStorage.setItem('deliveryUser', JSON.stringify(userData));
    Alert.alert('Success', 'Account created successfully');
    router.back();
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
          {/* 🔁 SWITCH APP */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="swap-horizontal-outline" size={18} color="#FFF" />
            <Text style={styles.switchText}>Switch App</Text>
          </TouchableOpacity>

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

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Create Account</Text>
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
  switchButton: {
    position: 'absolute',
    top: 44,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  switchText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
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