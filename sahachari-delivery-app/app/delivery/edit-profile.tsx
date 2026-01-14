import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pincodesText, setPincodesText] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('deliveryUser');
      if (stored) {
        const u: UserData = JSON.parse(stored);
        setName(u.name);
        setEmail(u.email);
        setPincodesText((u.pincodes || []).join(', '));
        setPhotoUri((u as any).photo || null);
      }

      // Ask media permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access media library was denied');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      // result may have `cancelled` or `assets` depending on SDK
      const uri = (result as any)?.assets?.[0]?.uri || (result as any)?.uri;
      if (uri) setPhotoUri(uri);
    } catch (err) {
      console.error('Image picker error', err);
      Alert.alert('Error', 'Could not pick image');
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) return Alert.alert('Validation', 'Name is required');
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return Alert.alert('Validation', 'Enter a valid email');

    const pincodes = pincodesText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    try {
      const existing = await AsyncStorage.getItem('deliveryUser');
      let base: Partial<UserData> = {};
      if (existing) {
        base = JSON.parse(existing);
      }

      const updated: UserData = {
        _id: (base as any)._id || 'USER_DEMO_ID',
        name: name.trim(),
        email: email.trim(),
        pincodes,
        totalDeliveries: (base as any).totalDeliveries || 0,
        totalEarnings: (base as any).totalEarnings || 0,
        photo: photoUri || null,
      };

      await AsyncStorage.setItem('deliveryUser', JSON.stringify(updated));
      Alert.alert('Saved', 'Profile updated successfully');
      router.back();
    } catch (err) {
      console.error('Failed to save profile', err);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.avatarPicker} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="camera" size={28} color={Colors.primary} />
              <Text style={styles.avatarText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pincodes (comma separated)</Text>
          <TextInput
            style={[styles.input, { minHeight: 44 }]}
            value={pincodesText}
            onChangeText={setPincodesText}
            placeholder="682001, 682002"
          />
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => router.back()}>
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={saveProfile}>
            <Text style={styles.btnSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600' },
  content: { padding: 16, paddingBottom: 120 },
  avatarPicker: { alignItems: 'center', marginBottom: 16 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: { marginTop: 6, fontSize: 12, color: Colors.text.secondary },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  field: { marginBottom: 12 },
  label: { fontSize: 14, color: Colors.text.primary, marginBottom: 6 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  btn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  btnCancel: { backgroundColor: '#FFF', marginRight: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  btnSave: { backgroundColor: Colors.primary, marginLeft: 8 },
  btnCancelText: { color: Colors.text.primary, fontWeight: '600' },
  btnSaveText: { color: '#FFF', fontWeight: '700' },
});