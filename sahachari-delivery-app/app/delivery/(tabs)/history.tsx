import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { api } from '../../../src/services/api';
// import { api, getDeliveryId } from '@src/services/api'; // TODO: Uncomment for API

interface DeliveryHistoryItem {
  _id: string;
  deliveryAddress: string;
  price: number;
  deliveredAt: string;
}

export default function DeliveryHistory() {
  const router = useRouter();

  const [history, setHistory] = useState<DeliveryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weekEarnings, setWeekEarnings] = useState(0);
  const [monthEarnings, setMonthEarnings] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const deliveryUserRaw = await AsyncStorage.getItem('deliveryUser');
      let deliveryId = '';
      if (deliveryUserRaw) {
        const parsed = JSON.parse(deliveryUserRaw);
        deliveryId = parsed?._id || parsed?.id || '';
      }
      if (!deliveryId) {
        // No delivery ID available; show empty history
        setHistory([]);
        calculateEarnings([]);
        return;
      }

      // Try to fetch deliveries; filter to completed/delivered items
      const all = await api.getAcceptedOrders();
      const completed = (all || []).filter((item) => item.status >= 2);
      setHistory(completed);
      calculateEarnings(completed);
    } catch (error) {
      console.error('Load history error:', error);
      Alert.alert('Error', 'Failed to load delivery history');
    } finally {
      setLoading(false);
    }
  };


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