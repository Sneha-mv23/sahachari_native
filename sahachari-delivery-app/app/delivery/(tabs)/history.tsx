import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

interface DeliveryHistory {
  id: string;
  deliveryAddress: string;
  price: number;
  completedAt: string;
}

export default function DeliveryHistory() {
  const [todayEarnings, setTodayEarnings] = useState(120);
  const [weekEarnings, setWeekEarnings] = useState(315);
  const [monthEarnings, setMonthEarnings] = useState(1260);
  const [history, setHistory] = useState<DeliveryHistory[]>([
    {
      id: 'ORD101',
      deliveryAddress: '123 Park Street, Kochi',
      price: 50,
      completedAt: '2024-01-20',
    },
    {
      id: 'ORD102',
      deliveryAddress: '456 Beach Road, Kochi',
      price: 70,
      completedAt: '2024-01-20',
    },
    {
      id: 'ORD103',
      deliveryAddress: '789 Hill View, Kochi',
      price: 60,
      completedAt: '2024-01-19',
    },
    {
      id: 'ORD104',
      deliveryAddress: '321 MG Road, Kochi',
      price: 55,
      completedAt: '2024-01-19',
    },
  ]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem('deliveryHistory');
    if (stored) {
      const historyData = JSON.parse(stored);
      setHistory([...historyData, ...history]);
      
      // Calculate earnings
      const today = new Date().toISOString().split('T')[0];
      const todayTotal = historyData
        .filter((h: DeliveryHistory) => h.completedAt.startsWith(today))
        .reduce((sum: number, h: DeliveryHistory) => sum + h.price, 0);
      setTodayEarnings(todayTotal + 120);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Delivery History</Text>
        <TouchableOpacity style={styles.switchButton}>
          <Text style={styles.switchButtonText}>Switch App</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>Earnings Summary</Text>
          <View style={styles.earningsRow}>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>Today</Text>
              <Text style={styles.earningAmount}>₹{todayEarnings}</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>This Week</Text>
              <Text style={styles.earningAmount}>₹{weekEarnings}</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>This Month</Text>
              <Text style={styles.earningAmount}>₹{monthEarnings}</Text>
            </View>
          </View>
        </View>

        {/* Past Deliveries Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Past Deliveries</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color={Colors.text.primary} />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery List */}
        {history.map((delivery) => (
          <View key={delivery.id} style={styles.deliveryCard}>
            <View style={styles.deliveryHeader}>
              <Text style={styles.deliveryId}>{delivery.id}</Text>
              <Text style={styles.deliveryPrice}>₹{delivery.price}</Text>
            </View>
            <Text style={styles.deliveryAddress}>{delivery.deliveryAddress}</Text>
            <Text style={styles.deliveryDate}>{delivery.completedAt}</Text>
          </View>
        ))}
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
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
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
  earningsCard: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 16,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningItem: {
    flex: 1,
  },
  earningLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  earningAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  deliveryCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  deliveryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  deliveryAddress: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  deliveryDate: {
    fontSize: 12,
    color: Colors.text.light,
  },
});