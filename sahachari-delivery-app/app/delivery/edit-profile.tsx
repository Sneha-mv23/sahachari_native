import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { styles } from '../../src/features/delivery/styles/EditProfile.styles';
import { api } from '../../src/services/api';

interface UserData {
  _id: string;
  name: string;
  email: string;
  pincodes: string[];
  totalDeliveries: number;
  totalEarnings: number;
  photo?: string | null;
}

export default function EditProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [currentPincode, setCurrentPincode] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    requestPermissions();
  }, []);

  const loadUserData = async () => {
    try {
      const stored = await AsyncStorage.getItem('deliveryUser');
      if (stored) {
        const u: UserData = JSON.parse(stored);
        setUserId(u._id);
        setName(u.name);
        setEmail(u.email);
        setPincodes(u.pincodes || []);
        setPhotoUri((u as any).photo || null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access media library was denied');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Image picker error', err);
      Alert.alert('Error', 'Could not pick image');
    }
  };

  const handleAddPincode = () => {
    if (currentPincode.trim().length === 6) {
      if (pincodes.includes(currentPincode.trim())) {
        Alert.alert('Error', 'Pincode already added');
        return;
      }
      setPincodes([...pincodes, currentPincode.trim()]);
      setCurrentPincode('');
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
    }
  };

  const handleRemovePincode = (index: number) => {
    setPincodes(pincodes.filter((_, i) => i !== index));
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: {
      name: string;
      email: string;
      pincodes: string[];
      photo?: string | null;
    }) => {
      return await api.updateProfile(userId, profileData);
    },
    onSuccess: async (updatedData) => {
      // Update AsyncStorage with new data
      await AsyncStorage.setItem('deliveryUser', JSON.stringify(updatedData));

      // Invalidate profile query to refresh data
      queryClient.invalidateQueries(['profile', userId]);

      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Failed to update profile';
      console.error('Update profile error:', error);
      Alert.alert('Error', errorMessage);
    },
  });

  const saveProfile = async () => {
    if (!name.trim()) {
      return Alert.alert('Validation', 'Name is required');
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Validation', 'Enter a valid email');
    }

    if (pincodes.length === 0) {
      return Alert.alert('Validation', 'Add at least one pincode');
    }

    // Call API to update profile
    updateProfileMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      pincodes,
      photo: photoUri,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 12, fontSize: 14, color: Colors.text.secondary }}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#FF6B35', '#FF8E53', '#FFA07A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* Avatar Card */}
            <View style={styles.avatarCard}>
              <View style={styles.avatarContainer}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.avatarImage} />
                ) : (
                  <LinearGradient
                    colors={['#FF6B35', '#FF8E53']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                  >
                    <Ionicons name="person" size={36} color="#FFF" />
                  </LinearGradient>
                )}

                {/* Camera Icon Button */}
                <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                  <Ionicons name="camera" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.avatarText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.field}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>

            {/* Pincodes Card */}
            <View style={styles.pincodesCard}>
              <View style={styles.pincodeHeader}>
                <Ionicons
                  name="location"
                  size={20}
                  color={Colors.primary}
                  style={styles.pincodeHeaderIcon}
                />
                <Text style={styles.pincodeHeaderText}>Serviceable Pincodes</Text>
              </View>

              <View style={styles.pincodeRow}>
                <TextInput
                  style={styles.pincodeInput}
                  value={currentPincode}
                  onChangeText={setCurrentPincode}
                  placeholder="6-digit pincode"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddPincode}>
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>

              {pincodes.length > 0 && (
                <View style={styles.pincodeList}>
                  {pincodes.map((pin, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.pincodeChip}
                      onPress={() => handleRemovePincode(index)}
                    >
                      <Text style={styles.pincodeChipText}>{pin}</Text>
                      <Ionicons name="close-circle" size={16} color="#F57C00" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn}
              onPress={saveProfile}
            // TODO: Uncomment for API integration
            // disabled={updateProfileMutation.isPending}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E53']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnSaveGradient}
              >
                {updateProfileMutation.isPending ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.btnSaveText}>Save Changes</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}