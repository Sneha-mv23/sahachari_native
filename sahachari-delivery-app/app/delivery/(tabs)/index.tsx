import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../constants/Colors';

interface Order {
  id: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: string;
  price: number;
  customerName?: string;
  status?: 'available' | 'accepted' | 'picked-up' | 'delivered';
}

export default function AvailableOrders() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'my-deliveries'>('available');
  const [availableOrders, setAvailableOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      pickupAddress: 'Demo Shop, MG Road, Kochi',
      deliveryAddress: '123 Park Street, Kochi 682002',
      distance: '3.5 km',
      price: 50,
      status: 'available',
    },
    {
      id: 'ORD002',
      pickupAddress: 'Super Market, Beach Road, Kochi',
      deliveryAddress: '456 Hill View, Kochi 682001',
      distance: '5.2 km',
      price: 70,
      status: 'available',
    },
  ]);
  const [myDeliveries, setMyDeliveries] = useState<Order[]>([]);

  useEffect(() => {
    loadMyDeliveries();
  }, []);

  const loadMyDeliveries = async () => {
    const stored = await AsyncStorage.getItem('myDeliveries');
    if (stored) {
      setMyDeliveries(JSON.parse(stored));
    }
  };

  const handleAcceptOrder = async (order: Order) => {
    // Add customer name for accepted orders
    const acceptedOrder = {
      ...order,
      customerName: 'Rahul Kumar',
      status: 'accepted' as const,
    };

    const updatedMyDeliveries = [...myDeliveries, acceptedOrder];
    setMyDeliveries(updatedMyDeliveries);
    await AsyncStorage.setItem('myDeliveries', JSON.stringify(updatedMyDeliveries));

    // Remove from available orders
    setAvailableOrders(availableOrders.filter((o) => o.id !== order.id));

    Alert.alert('Success', 'Order accepted! Check My Deliveries.');
    setActiveTab('my-deliveries');
  };

  const handlePickedUp = async (orderId: string) => {
    const updated = myDeliveries.map((order) =>
      order.id === orderId ? { ...order, status: 'picked-up' as const } : order
    );
    setMyDeliveries(updated);
    await AsyncStorage.setItem('myDeliveries', JSON.stringify(updated));
  };

  const handleNavigate = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleCall = (phone: string = '+919876543210') => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleMarkDelivered = async (order: Order) => {
    Alert.alert(
      'Confirm Delivery',
      'Mark this order as delivered?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            // Remove from my deliveries
            const updated = myDeliveries.filter((o) => o.id !== order.id);
            setMyDeliveries(updated);
            await AsyncStorage.setItem('myDeliveries', JSON.stringify(updated));

            // Add to history
            const history = await AsyncStorage.getItem('deliveryHistory');
            const historyData = history ? JSON.parse(history) : [];
            historyData.push({
              ...order,
              status: 'delivered',
              completedAt: new Date().toISOString(),
            });
            await AsyncStorage.setItem('deliveryHistory', JSON.stringify(historyData));

            // Update earnings
            const userData = await AsyncStorage.getItem('deliveryUser');
            if (userData) {
              const user = JSON.parse(userData);
              user.totalDeliveries = (user.totalDeliveries || 0) + 1;
              user.totalEarnings = (user.totalEarnings || 0) + order.price;
              await AsyncStorage.setItem('deliveryUser', JSON.stringify(user));
            }

            Alert.alert('Success', 'Order marked as delivered!');
          },
        },
      ]
    );
  };

  const renderAvailableOrder = (order: Order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={styles.priceTag}>
          <Text style={styles.price}>₹{order.price}</Text>
        </View>
      </View>

      <View style={styles.addressSection}>
        <Text style={styles.label}>Pickup</Text>
        <Text style={styles.address}>{order.pickupAddress}</Text>
      </View>

      <View style={styles.addressSection}>
        <Text style={styles.label}>Delivery</Text>
        <Text style={styles.address}>{order.deliveryAddress}</Text>
      </View>

      <Text style={styles.distance}>Distance: {order.distance}</Text>

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAcceptOrder(order)}
      >
        <Text style={styles.acceptButtonText}>Accept Order</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMyDelivery = (order: Order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        {order.status === 'picked-up' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Picked up</Text>
          </View>
        )}
      </View>

      {order.customerName && (
        <View style={styles.customerSection}>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.address}>{order.deliveryAddress}</Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => handleNavigate(order.deliveryAddress)}
        >
          <Text style={styles.navigateButtonText}>📍 Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall()}
        >
          <Text style={styles.callButtonText}>📞 Call</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>

      {order.status === 'accepted' ? (
        <TouchableOpacity
          style={styles.pickedUpButton}
          onPress={() => handlePickedUp(order.id)}
        >
          <Text style={styles.buttonText}>Mark as Picked Up</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.deliveredButton}
          onPress={() => handleMarkDelivered(order)}
        >
          <Text style={styles.buttonText}>Mark as Delivered</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deliveries</Text>
        <TouchableOpacity style={styles.switchButton}>
          <Text style={styles.switchButtonText}>Switch App</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text
            style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}
          >
            Available
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-deliveries' && styles.activeTab]}
          onPress={() => setActiveTab('my-deliveries')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'my-deliveries' && styles.activeTabText,
            ]}
          >
            My Deliveries
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'available'
          ? availableOrders.map(renderAvailableOrder)
          : myDeliveries.map(renderMyDelivery)}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  priceTag: {
    backgroundColor: Colors.earned,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statusBadge: {
    backgroundColor: Colors.pickedUp,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00838F',
  },
  addressSection: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  distance: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 16,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  customerSection: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  navigateButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    backgroundColor: Colors.success,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  viewDetailsButton: {
    backgroundColor: Colors.background,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewDetailsText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  pickedUpButton: {
    backgroundColor: '#00ACC1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deliveredButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});