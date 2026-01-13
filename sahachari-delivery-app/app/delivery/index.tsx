import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/loginStyles';

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

    try {
      const savedUser = await AsyncStorage.getItem('deliveryUser');
      console.log('Saved user:', savedUser);
      
      if (!savedUser) {
        Alert.alert('Error', 'No account found. Please signup first.');
        return;
      }

      const user = JSON.parse(savedUser);
      console.log('Parsed user:', user);
      console.log('Email match:', user.email === email);
      console.log('Password match:', user.password === password);

      if (user.email === email && user.password === password) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        console.log('Login successful, navigating...');
        
        router.push('/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={['#FF6B35', '#FF8E53', '#FFA07A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <Ionicons name="bicycle" size={56} color="#FFF" />
        <Text style={styles.headerTitle}>Delivery Partner</Text>
        <Text style={styles.headerSubtitle}>Start earning with deliveries</Text>
      </LinearGradient>

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={styles.card}>

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
              style={styles.tab}
              onPress={() => router.push('/delivery/signup')}
            >
              <Text style={styles.tabText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
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

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink}>Terms</Text> and{' '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
 