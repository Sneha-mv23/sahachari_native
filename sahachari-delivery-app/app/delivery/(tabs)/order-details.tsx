import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
// import { api } from '../../../services/api'; // TODO: Uncomment for API

interface Product {
  name: string;
  quantity: number;
}

interface OrderDetails {
  _id: string;
  pickupAddress: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  products: Product[];
  price: number;
  status: number;
}

// ========== 🔥 DUMMY DATA - REMOVE DURING API INTEGRATION 🔥 ==========
const DUMMY_ORDER_DETAILS: OrderDetails = {
  _id: 'ORD003',
  pickupAddress: 'Demo Shop, MG Road, Kochi',
  deliveryAddress: '123 Park Street, Kochi 682002',
  customerName: 'Rahul Kumar',
  customerPhone: '+91 98765 43210',
  products: [
    { name: 'Fresh Tomatoes', quantity: 2 },
    { name: 'Rice - Basmati', quantity: 1 },
  ],
  price: 50,
  status: 1,
};
// ========== END DUMMY DATA ==========

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // TODO: Get orderId from params during API integration
  // const orderId = params.orderId as string;
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(DUMMY_ORDER_DETAILS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Uncomment for API integration
    // loadOrderDetails();
  }, []);

  // TODO: Uncomment for API integration
  /*
  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getOrderDetails(orderId);
      setOrderDetails(data);
    } catch (error) {
      console.error('Load order details error:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };
  */

  const handleStartNavigation = () => {
    if (!orderDetails) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(orderDetails.pickupAddress)}`;
    Linking.openURL(url);
  };

  const handleCallCustomer = () => {
    if (!orderDetails) return;
    Linking.openURL(`tel:${orderDetails.customerPhone}`);
  };

  const handleMarkDelivered = () => {
    Alert.alert(
      'Confirm Delivery',
      'Mark this order as delivered?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // TODO: API call to mark as delivered
            Alert.alert('Success', 'Order marked as delivered!');
            router.back();
          },
        },
      ]
    );
  };

  if (loading || !orderDetails) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <LinearGradient
        colors={['#FF6B35', '#FF8E53']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
         
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Order ID Card */}
        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderIdValue}>#{orderDetails._id.toUpperCase()}</Text>
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          {orderDetails.products.map((product, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productIconContainer}>
                <Ionicons name="cube" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productQty}>Qty: {product.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Customer</Text>
          </View>
          <View style={styles.customerCard}>
            <View style={styles.customerRow}>
              <Ionicons name="person" size={18} color={Colors.text.secondary} />
              <Text style={styles.customerInfo}>{orderDetails.customerName}</Text>
            </View>
            <View style={styles.customerRow}>
              <Ionicons name="call" size={18} color={Colors.text.secondary} />
              <Text style={styles.customerInfo}>{orderDetails.customerPhone}</Text>
            </View>
            <View style={styles.customerRow}>
              <Ionicons name="location" size={18} color={Colors.text.secondary} />
              <Text style={styles.customerInfo}>{orderDetails.deliveryAddress}</Text>
            </View>
          </View>
        </View>

        {/* Pickup Location */}
        <View style={styles.section}>
          <View style={styles.pickupHeader}>
            <Ionicons name="location" size={20} color="#FF6B35" />
            <Text style={styles.pickupLabel}>Pickup Location</Text>
          </View>
          <Text style={styles.pickupAddress}>{orderDetails.pickupAddress}</Text>

          {/* Map Placeholder */}
          <TouchableOpacity style={styles.mapPlaceholder} onPress={handleStartNavigation}>
            <Ionicons name="map" size={40} color="#9E9E9E" />
            <Text style={styles.mapText}>Map View</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={handleStartNavigation}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#2196F3', '#42A5F5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Ionicons name="navigate" size={22} color="#FFF" />
            <Text style={styles.buttonText}>Start Navigation</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.callButton}
          onPress={handleCallCustomer}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4CAF50', '#66BB6A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Ionicons name="call" size={22} color="#FFF" />
            <Text style={styles.buttonText}>Call Customer</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deliveredButton}
          onPress={handleMarkDelivered}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6B35', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Ionicons name="checkmark-circle" size={22} color="#FFF" />
            <Text style={styles.buttonText}>Mark Delivered</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', flex: 1 },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 100 },
  orderIdCard: {
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
  orderIdLabel: { fontSize: 12, color: Colors.text.secondary, marginBottom: 4 },
  orderIdValue: { fontSize: 28, fontWeight: 'bold', color: Colors.text.primary },
  section: {
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
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productName: { flex: 1, fontSize: 15, color: Colors.text.primary },
  productQty: { fontSize: 14, color: Colors.text.secondary, fontWeight: '600' },
  customerCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  customerInfo: { flex: 1, fontSize: 14, color: Colors.text.primary, lineHeight: 20 },
  pickupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  pickupLabel: { fontSize: 14, fontWeight: '600', color: '#FF6B35' },
  pickupAddress: { fontSize: 14, color: Colors.text.primary, marginBottom: 16, lineHeight: 20 },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: { fontSize: 16, color: '#9E9E9E', marginTop: 8 },
  navigationButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  callButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  deliveredButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
});