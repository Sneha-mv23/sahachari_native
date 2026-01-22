import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { api } from '../../../src/services/api';

interface UserData {
  _id: string;
  name: string;
  email: string;
  pincodes: string[];
  totalDeliveries: number;
  totalEarnings: number;
}

export default function Profile() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Try fetching fresh profile from backend first
      try {
        const profile = await api.getProfile();
        if (profile) {
          // Map API shape to local UserData shape safely
          const mapped = {
            _id: (profile as any)._id || (profile as any).id || '',
            name: profile.name || '',
            email: profile.email || '',
            pincodes: (profile as any).pincodes || [],
            totalDeliveries: (profile as any).totalDeliveries || 0,
            totalEarnings: (profile as any).totalEarnings || 0,
            photo: (profile as any).photo || null,
          };
          setUserData(mapped);
          await AsyncStorage.setItem('deliveryUser', JSON.stringify(mapped));
          return;
        }
      } catch (apiError) {
        console.warn('Failed to load profile from API, falling back to cache:', apiError);
      }

      // Fallback to cached profile
      const stored = await AsyncStorage.getItem('deliveryUser');
      if (stored) {
        setUserData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // (Optional) provide a refresh or edit flow that calls API to update profile


  const handleLogout = async () => {
    // (Optional) clear auth data
    // await AsyncStorage.removeItem('token');
    // await AsyncStorage.removeItem('user');

    router.replace('/delivery/signup'); // 👈 goes to main index.tsx
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]} edges={['top']}>
        <Text style={styles.loadingText}>No profile data available.</Text>

        <TouchableOpacity onPress={loadProfile} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.primary, fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/delivery/edit-profile')}
          style={{ marginTop: 12 }}
        >
          <Text style={{ color: Colors.primary, fontWeight: '600' }}>Create / Edit Profile</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#FF6B35', '#FF8E53']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarCard}>
          <LinearGradient
            colors={['#FF6B35', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Ionicons name="person" size={48} color="#FFF" />
          </LinearGradient>
          <Text style={styles.name}>{userData.name}</Text>
          <View style={styles.emailContainer}>
            <Ionicons name="mail-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.email}>{userData.email}</Text>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <LinearGradient
            colors={['#FFE5D9', '#FFF3E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statsGradient}
          >
            <View style={styles.statsHeader}>
              <Ionicons name="trending-up" size={22} color={Colors.primary} />
              <Text style={styles.statsTitle}>Performance Stats</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="bicycle" size={24} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{userData.totalDeliveries}</Text>
                <Text style={styles.statLabel}>Total Deliveries</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="wallet" size={24} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>₹{userData.totalEarnings}</Text>
                <Text style={styles.statLabel}>Total Earnings</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Serviceable Areas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Serviceable Areas</Text>
          </View>
          <View style={styles.pincodeList}>
            {(userData?.pincodes?.length || 0) > 0 ? (
              (userData.pincodes || []).map((pincode, index) => (
                <View key={index} style={styles.pincodeChip}>
                  <Ionicons name="location-outline" size={14} color={Colors.primary} />
                  <Text style={styles.pincodeText}>{pincode}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No pincodes added</Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/delivery/edit-profile')}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="create-outline" size={20} color={Colors.primary} />
            </View>

            <Text style={styles.actionButtonText}>Edit Profile</Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.text.light}
            />
          </TouchableOpacity>


        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#FFEBEE', '#FFCDD2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: Colors.text.secondary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: { padding: 4, marginRight: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', flex: 1, marginLeft: 16 },


  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 100 },
  avatarCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 8 },
  emailContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  email: { fontSize: 14, color: Colors.text.secondary },
  statsCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGradient: { padding: 20 },
  statsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  statsTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: Colors.text.secondary },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 16,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text.primary },
  pincodeList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pincodeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.earned,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pincodeText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  actionsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#D32F2F' },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.text.light,
    marginBottom: 16,
  },
  emptyText: { fontSize: 14, color: Colors.text.secondary },
});
