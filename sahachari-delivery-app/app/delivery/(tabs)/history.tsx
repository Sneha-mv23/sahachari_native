import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
// import { api, getDeliveryId } from '../../../services/api'; // TODO: Uncomment for API

interface DeliveryHistoryItem {
  _id: string;
  deliveryAddress: string;
  price: number;
  deliveredAt: string;
}

// ========== 🔥 DUMMY DATA - REMOVE DURING API INTEGRATION 🔥 ==========
const DUMMY_HISTORY: DeliveryHistoryItem[] = [
  {
    _id: 'ORD101ABC',
    deliveryAddress: '123 Park Street, Kochi 682002',
    price: 50,
    deliveredAt: '2024-12-31T10:30:00Z',
  },
  {
    _id: 'ORD102XYZ',
    deliveryAddress: '456 Beach Road, Kochi 682001',
    price: 70,
    deliveredAt: '2024-12-31T14:15:00Z',
  },
  {
    _id: 'ORD103LMN',
    deliveryAddress: '789 Hill View, Kochi 682003',
    price: 60,
    deliveredAt: '2024-12-30T09:45:00Z',
  },
  {
    _id: 'ORD104PQR',
    deliveryAddress: '321 MG Road, Kochi 682011',
    price: 55,
    deliveredAt: '2024-12-29T16:20:00Z',
  },
  {
    _id: 'ORD105STU',
    deliveryAddress: '654 Marine Drive, Kochi 682031',
    price: 80,
    deliveredAt: '2024-12-28T11:00:00Z',
  },
  {
    _id: 'ORD106VWX',
    deliveryAddress: '987 Rose Garden, Kochi 682024',
    price: 45,
    deliveredAt: '2024-12-25T13:30:00Z',
  },
];
// ========== END DUMMY DATA ==========

export default function DeliveryHistory() {
  const router = useRouter();

  // TODO: During API integration, initialize as empty array: useState<DeliveryHistoryItem[]>([])
  const [history, setHistory] = useState<DeliveryHistoryItem[]>(DUMMY_HISTORY);
  const [loading, setLoading] = useState(false); // Changed to false for dummy data

  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weekEarnings, setWeekEarnings] = useState(0);
  const [monthEarnings, setMonthEarnings] = useState(0);

  useEffect(() => {
    // TODO: Uncomment for API integration
    // loadHistory();
    
    // Calculate earnings from dummy data
    calculateEarnings(DUMMY_HISTORY);
  }, []);

  // TODO: Uncomment for API integration
  /*
  const loadHistory = async () => {
    try {
      const deliveryId = await getDeliveryId();
      if (!deliveryId) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const data = await api.getDeliveryHistory(deliveryId);
      setHistory(data);
      calculateEarnings(data);
    } catch (error) {
      console.error('Load history error:', error);
      Alert.alert('Error', 'Failed to load delivery history');
    } finally {
      setLoading(false);
    }
  };
  */

  const calculateEarnings = (data: DeliveryHistoryItem[]) => {
    const now = new Date();

    let today = 0;
    let week = 0;
    let month = 0;

    data.forEach(item => {
      const date = new Date(item.deliveredAt);
      const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays < 1) today += item.price;
      if (diffDays < 7) week += item.price;
      if (diffDays < 30) month += item.price;
    });

    setTodayEarnings(today);
    setWeekEarnings(week);
    setMonthEarnings(month);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading history...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#FF6B35', '#FF8E53']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Delivery History</Text>
        <TouchableOpacity style={styles.switchButton} onPress={() => router.replace('/')}>
          <Ionicons name="apps" size={14} color="#FFF" />
          <Text style={styles.switchButtonText}>Switch</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#FF6B35', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.earningsCard}
        >
          <View style={styles.earningsHeader}>
            <Ionicons name="wallet" size={24} color="#FFF" />
            <Text style={styles.earningsTitle}>Earnings Summary</Text>
          </View>
          <View style={styles.earningsRow}>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>Today</Text>
              <Text style={styles.earningAmount}>₹{todayEarnings}</Text>
            </View>
            <View style={styles.earningDivider} />
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>This Week</Text>
              <Text style={styles.earningAmount}>₹{weekEarnings}</Text>
            </View>
            <View style={styles.earningDivider} />
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>This Month</Text>
              <Text style={styles.earningAmount}>₹{monthEarnings}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Past Deliveries</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{history.length}</Text>
          </View>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="bicycle-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.emptyText}>No deliveries completed yet</Text>
            <Text style={styles.emptySubtext}>
              Start accepting orders to build your history
            </Text>
          </View>
        ) : (
          history.map(item => (
            <View key={item._id} style={styles.deliveryCard}>
              <View style={styles.cardIconContainer}>
                <View style={styles.cardIcon}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <View style={styles.deliveryHeader}>
                  <View style={styles.orderIdContainer}>
                    <Ionicons name="cube-outline" size={16} color={Colors.primary} />
                    <Text style={styles.deliveryId}>
                      #{item._id.slice(-6).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.deliveryPrice}>₹{item.price}</Text>
                  </View>
                </View>
                
                <View style={styles.addressRow}>
                  <Ionicons name="location" size={16} color={Colors.text.secondary} />
                  <Text style={styles.deliveryAddress} numberOfLines={2}>
                    {item.deliveryAddress}
                  </Text>
                </View>
                
                <View style={styles.dateRow}>
                  <Ionicons name="time-outline" size={14} color={Colors.text.light} />
                  <Text style={styles.deliveryDate}>
                    {new Date(item.deliveredAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: { padding: 4, marginRight: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', flex: 1 },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  switchButtonText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  content: { flex: 1 },
  contentContainer: { paddingBottom: 100 },
  earningsCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  earningsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  earningsTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  earningsRow: { flexDirection: 'row', alignItems: 'center' },
  earningItem: { flex: 1, alignItems: 'center' },
  earningDivider: { width: 1, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  earningLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.9)', marginBottom: 6 },
  earningAmount: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text.primary },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  deliveryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconContainer: { marginRight: 12, justifyContent: 'flex-start', paddingTop: 2 },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1 },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderIdContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deliveryId: { fontSize: 15, fontWeight: 'bold', color: Colors.text.primary },
  priceContainer: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryPrice: { fontSize: 15, fontWeight: 'bold', color: Colors.primary },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  deliveryAddress: { flex: 1, fontSize: 14, color: Colors.text.secondary, lineHeight: 20 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deliveryDate: { fontSize: 12, color: Colors.text.light },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  emptySubtext: { fontSize: 14, color: Colors.text.light, textAlign: 'center' },
});