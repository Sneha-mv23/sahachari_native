import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
// import { api, getDeliveryId, Order as ApiOrder } from '../../../services/api'; // TODO: Uncomment for API

interface Order {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance: string;
  price: number;
  status: number;
  customerName?: string;
}

// ========== 🔥 DUMMY DATA - REMOVE DURING API INTEGRATION 🔥 ==========
const DUMMY_AVAILABLE_ORDERS: Order[] = [
  {
    _id: 'ORD001ABC',
    pickupAddress: 'Fresh Mart, MG Road, Kochi',
    deliveryAddress: '123 Park Street, Kochi 682002',
    distance: '3.5 km',
    price: 50,
    status: 0,
  },
  {
    _id: 'ORD002XYZ',
    pickupAddress: 'Super Market, Beach Road, Kochi',
    deliveryAddress: '456 Hill View, Kochi 682001',
    distance: '5.2 km',
    price: 70,
    status: 0,
  },
  {
    _id: 'ORD003LMN',
    pickupAddress: 'City Store, Palarivattom, Kochi',
    deliveryAddress: '789 Marine Drive, Kochi 682003',
    distance: '2.8 km',
    price: 45,
    status: 0,
  },
];

const DUMMY_MY_DELIVERIES: Order[] = [
  {
    _id: 'ORD004PQR',
    pickupAddress: 'Grocery Hub, Kakkanad, Kochi',
    deliveryAddress: '321 Rose Garden, Kochi 682030',
    distance: '4.1 km',
    price: 60,
    status: 1, // accepted
    customerName: 'Rahul Kumar',
  },
  {
    _id: 'ORD005STU',
    pickupAddress: 'Mini Market, Edappally, Kochi',
    deliveryAddress: '654 Silver Heights, Kochi 682024',
    distance: '6.3 km',
    price: 80,
    status: 2, // picked-up
    customerName: 'Priya Sharma',
  },
];
// ========== END DUMMY DATA ==========

export default function AvailableOrders() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'my-deliveries'>('available');
  
  // TODO: During API integration, initialize as empty arrays: useState<Order[]>([])
  const [availableOrders, setAvailableOrders] = useState<Order[]>(DUMMY_AVAILABLE_ORDERS);
  const [myDeliveries, setMyDeliveries] = useState<Order[]>(DUMMY_MY_DELIVERIES);
  
  const [loading, setLoading] = useState(false); // Changed to false for dummy data
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // TODO: Uncomment for API integration
    // loadData();
  }, []);

  // TODO: Uncomment and use during API integration
  /*
  const loadData = async () => {
    try {
      await Promise.all([loadAvailableOrders(), loadMyDeliveries()]);
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadAvailableOrders = async () => {
    try {
      const orders = await api.getAvailableOrders();
      setAvailableOrders(orders);
    } catch (error) {
      console.error('Load available orders error:', error);
    }
  };

  const loadMyDeliveries = async () => {
    try {
      const deliveryId = await getDeliveryId();
      if (!deliveryId) return;

      const acceptedOrders = await api.getMyOrders(deliveryId);
      const orders = acceptedOrders.map(ao => ({
        ...ao.order,
        customerName: 'Rahul Kumar',
      })) as Order[];
      
      setMyDeliveries(orders);
    } catch (error) {
      console.error('Load my deliveries error:', error);
    }
  };
  */

  const handleAcceptOrder = async (order: Order) => {
    // TODO: Replace with API call during integration
    Alert.alert('Demo', 'This will call API to accept order', [
      {
        text: 'OK',
        onPress: () => {
          // Remove from available, add to my deliveries
          setAvailableOrders(availableOrders.filter(o => o._id !== order._id));
          setMyDeliveries([...myDeliveries, { ...order, status: 1, customerName: 'Rahul Kumar' }]);
          setActiveTab('my-deliveries');
        },
      },
    ]);
    
    /* TODO: Uncomment for API integration
    try {
      const deliveryId = await getDeliveryId();
      if (!deliveryId) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      setLoading(true);
      await api.acceptOrder({ deliveryId, orderId: order._id });
      await loadData();
      Alert.alert('Success', 'Order accepted!');
      setActiveTab('my-deliveries');
    } catch (error) {
      console.error('Accept order error:', error);
      Alert.alert('Error', 'Failed to accept order');
    } finally {
      setLoading(false);
    }
    */
  };

  const handlePickedUp = async (orderId: string) => {
    // TODO: Replace with API call during integration
    setMyDeliveries(myDeliveries.map(o => 
      o._id === orderId ? { ...o, status: 2 } : o
    ));
    Alert.alert('Success', 'Order marked as picked up!');
    
    /* TODO: Uncomment for API integration
    try {
      setLoading(true);
      await api.updateOrderStatus({ orderId, status: 2 });
      await loadMyDeliveries();
      Alert.alert('Success', 'Order marked as picked up!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setLoading(false);
    }
    */
  };

  const handleMarkDelivered = async (order: Order) => {
    Alert.alert('Confirm Delivery', 'Mark this order as delivered?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          // TODO: Replace with API call during integration
          setMyDeliveries(myDeliveries.filter(o => o._id !== order._id));
          Alert.alert('Success', 'Order marked as delivered!');
          
          /* TODO: Uncomment for API integration
          try {
            setLoading(true);
            await api.updateOrderStatus({ orderId: order._id, status: 3 });
            await loadMyDeliveries();
            Alert.alert('Success', 'Order marked as delivered!');
          } catch (error) {
            Alert.alert('Error', 'Failed to update status');
          } finally {
            setLoading(false);
          }
          */
        },
      },
    ]);
  };

  const handleNavigate = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleCall = (phone: string = '+919876543210') => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderAvailableOrder = (order: Order) => (
    <View key={order._id} style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View style={styles.orderIdContainer}>
          <Ionicons name="cube-outline" size={18} color={Colors.primary} />
          <Text style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</Text>
        </View>
        <LinearGradient
          colors={['#FFE5D9', '#FFF3E0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.priceTag}
        >
          <Text style={styles.price}>₹{order.price}</Text>
        </LinearGradient>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={16} color="#FF6B35" />
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.label}>Pickup Location</Text>
            <Text style={styles.address}>{order.pickupAddress}</Text>
          </View>
        </View>

        <View style={styles.dashedLine} />

        <View style={styles.addressRow}>
          <View style={[styles.iconCircle, styles.iconCircleGreen]}>
            <Ionicons name="flag" size={16} color="#4CAF50" />
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.label}>Drop Location</Text>
            <Text style={styles.address}>{order.deliveryAddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.distanceContainer}>
        <Ionicons name="navigate-circle" size={16} color={Colors.secondary} />
        <Text style={styles.distance}>{order.distance}</Text>
      </View>

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAcceptOrder(order)}
        activeOpacity={0.8}
        disabled={loading}
      >
        <LinearGradient
          colors={['#FF6B35', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.acceptButtonGradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Text style={styles.acceptButtonText}>Accept Order</Text>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderMyDelivery = (order: Order) => (
    <View key={order._id} style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View style={styles.orderIdContainer}>
          <Ionicons name="cube-outline" size={18} color={Colors.primary} />
          <Text style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</Text>
        </View>
        {order.status === 2 && (
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Picked up</Text>
          </View>
        )}
      </View>

      {order.customerName && (
        <View style={styles.customerCard}>
          <View style={styles.customerAvatar}>
            <Ionicons name="person" size={20} color={Colors.primary} />
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{order.customerName}</Text>
            <Text style={styles.customerAddress}>{order.deliveryAddress}</Text>
          </View>
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleNavigate(order.deliveryAddress)}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="navigate" size={18} color="#2196F3" />
          </View>
          <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>Navigate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleCall()}>
          <View style={[styles.actionIconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="call" size={18} color="#4CAF50" />
          </View>
          <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push({
            pathname: '/delivery/(tabs)/order-details',
            params: { orderId: order._id }
          })}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="information-circle" size={18} color="#FF9800" />
          </View>
          <Text style={[styles.actionButtonText, { color: '#FF9800' }]}>Details</Text>
        </TouchableOpacity>
      </View>

      {order.status === 1 ? (
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => handlePickedUp(order._id)}
          disabled={loading}
        >
          <LinearGradient
            colors={['#00ACC1', '#00BCD4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statusButtonGradient}
          >
            <Ionicons name="checkmark-done" size={20} color="#FFF" />
            <Text style={styles.statusButtonText}>Mark as Picked Up</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => handleMarkDelivered(order)}
          disabled={loading}
        >
          <LinearGradient
            colors={['#FF6B35', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statusButtonGradient}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={styles.statusButtonText}>Mark as Delivered</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading orders...</Text>
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
        <Text style={styles.title}>Deliveries</Text>
        <TouchableOpacity style={styles.switchButton} onPress={() => router.replace('/')}>
          <Ionicons name="apps" size={14} color="#FFF" />
          <Text style={styles.switchButtonText}>Switch</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            <Ionicons
              name="list"
              size={18}
              color={activeTab === 'available' ? '#FFF' : Colors.text.secondary}
            />
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
              Available
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'my-deliveries' && styles.activeTab]}
            onPress={() => setActiveTab('my-deliveries')}
          >
            <Ionicons
              name="bicycle"
              size={18}
              color={activeTab === 'my-deliveries' ? '#FFF' : Colors.text.secondary}
            />
            <Text style={[styles.tabText, activeTab === 'my-deliveries' && styles.activeTabText]}>
              My Deliveries
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => {
              // TODO: Uncomment for API: onRefresh()
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1000);
            }} 
          />
        }
      >
        {activeTab === 'available' ? (
          availableOrders.length > 0 ? (
            availableOrders.map(renderAvailableOrder)
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="cube-outline" size={64} color="#E0E0E0" />
              </View>
              <Text style={styles.emptyStateText}>No orders available</Text>
              <Text style={styles.emptyStateSubtext}>Check back later for new deliveries</Text>
            </View>
          )
        ) : myDeliveries.length > 0 ? (
          myDeliveries.map(renderMyDelivery)
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="bicycle-outline" size={64} color="#E0E0E0" />
            </View>
            <Text style={styles.emptyStateText}>No active deliveries</Text>
            <Text style={styles.emptyStateSubtext}>Accept orders to start earning</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 14, color: Colors.text.secondary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
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
  tabWrapper: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: { fontSize: 14, color: Colors.text.secondary, fontWeight: '600' },
  activeTabText: { color: '#FFF' },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 100 },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderIdContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderId: { fontSize: 18, fontWeight: 'bold', color: Colors.text.primary },
  priceTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  price: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  addressContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE5D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleGreen: { backgroundColor: '#E8F5E9' },
  addressTextContainer: { flex: 1 },
  label: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  address: { fontSize: 14, color: Colors.text.primary, lineHeight: 20 },
  dashedLine: {
    height: 20,
    width: 2,
    marginLeft: 15,
    marginVertical: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#DDD',
    borderStyle: 'dashed',
  },
  distanceContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  distance: { fontSize: 14, color: Colors.secondary, fontWeight: '600' },
  acceptButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  acceptButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00ACC1' },
  statusText: { fontSize: 13, fontWeight: '600', color: '#00838F' },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE5D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 4 },
  customerAddress: { fontSize: 13, color: Colors.text.secondary, lineHeight: 18 },
  actionButtons: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: { fontSize: 12, fontWeight: '600' },
  statusButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  statusButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
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
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  emptyStateSubtext: { fontSize: 14, color: Colors.text.light, textAlign: 'center' },
});