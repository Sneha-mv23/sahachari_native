import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

interface UserData {
  name: string;
  email: string;
  pincodes: string[];
  totalDeliveries: number;
  totalEarnings: number;
}

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    name: 'Demo Driver',
    email: 'snehamv23@gmail.com',
    pincodes: ['682001', '682002'],
    totalDeliveries: 127,
    totalEarnings: 6350,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const stored = await AsyncStorage.getItem('deliveryUser');
    if (stored) {
      const user = JSON.parse(stored);
      setUserData(user);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('isLoggedIn');
          router.replace('/delivery');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color={Colors.text.primary} />
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.switchButton}>
          <Text style={styles.switchButtonText}>Switch App</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={Colors.white} />
          </View>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>

        {/* Serviceable Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviceable Areas</Text>
          <View style={styles.pincodeList}>
            {userData.pincodes.map((pincode, index) => (
              <View key={index} style={styles.pincodeChip}>
                <Text style={styles.pincodeText}>{pincode}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Ionicons name="trending-up" size={20} color={Colors.primary} />
            <Text style={styles.statsTitle}>Stats</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Deliveries</Text>
              <Text style={styles.statValue}>{userData.totalDeliveries}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Earnings</Text>
              <Text style={styles.statValue}>₹{userData.totalEarnings}</Text>
            </View>
          </View>
        </View>

        {/* Edit Profile */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
    marginLeft: 16,
  },
  switchButton: {
    backgroundColor: '#9E9E9E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  switchButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    padding: 32,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  section: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  pincodeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pincodeChip: {
    backgroundColor: Colors.earned,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pincodeText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: Colors.earned,
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  editButton: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFEBEE',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
});