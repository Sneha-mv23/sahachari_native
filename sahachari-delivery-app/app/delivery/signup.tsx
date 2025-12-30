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

export default function DeliverySignup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [currentPincode, setCurrentPincode] = useState('');

  const addPincode = () => {
    if (currentPincode && currentPincode.length === 6) {
      setPincodes([...pincodes, currentPincode]);
      setCurrentPincode('');
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
    }
  };

  const removePincode = (index: number) => {
    const newPincodes = pincodes.filter((_, i) => i !== index);
    setPincodes(newPincodes);
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

    // Save user data
    const userData = {
      name,
      email,
      password,
      pincodes,
      totalDeliveries: 0,
      totalEarnings: 0,
    };

    await AsyncStorage.setItem('deliveryUser', JSON.stringify(userData));
    Alert.alert('Success', 'Account created successfully!', [
      {
        text: 'OK',
        onPress: () => router.replace('/delivery'),
      },
    ]);
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Delivery Partner Portal</Text>
        <Text style={styles.subtitle}>Start earning with deliveries</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => router.back()}
          >
            <Text style={styles.tabText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Signup</Text>
          </TouchableOpacity>
        </View>

        {/* Signup Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder=""
          />

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

          <Text style={styles.label}>Serviceable Pincodes</Text>
          <View style={styles.pincodeContainer}>
            <TextInput
              style={styles.pincodeInput}
              value={currentPincode}
              onChangeText={setCurrentPincode}
              placeholder="Enter pincode"
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity style={styles.addButton} onPress={addPincode}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Display added pincodes */}
          <View style={styles.pincodeList}>
            {pincodes.map((pincode, index) => (
              <TouchableOpacity
                key={index}
                style={styles.pincodeChip}
                onPress={() => removePincode(index)}
              >
                <Text style={styles.pincodeChipText}>{pincode}</Text>
                <Text style={styles.removeText}> ×</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 32,
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
  pincodeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  pincodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  pincodeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  pincodeChip: {
    backgroundColor: Colors.earned,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pincodeChipText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  removeText: {
    color: Colors.primary,
    fontSize: 18,
    marginLeft: 4,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});