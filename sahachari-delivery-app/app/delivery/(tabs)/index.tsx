import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../constants/Colors';
import { Order, TabType } from './types';
import {
  DELIVERY_STAGES,
  DUMMY_AVAILABLE_ORDERS,
  DUMMY_MY_DELIVERIES,
  COLOR_CONSTANTS,
  EMPTY_STATE,
} from './constants';
import { useOrdersQuery, useOrderMutations } from './hooks/useOrdersQuery';
import { useOrderActions } from './hooks/useOrderActions';
import { AvailableOrderCard } from './components/AvailableOrderCard';
import { MyDeliveryCard } from './components/MyDeliveryCard';
import { styles } from './styles/index.styles';

export default function AvailableOrders() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('available');
  const [refreshing, setRefreshing] = useState(false);
  const [deliveryId, setDeliveryId] = useState<string>('');
  const [acceptedOrders, setAcceptedOrders] = useState<string[]>([]);

  useEffect(() => {
    // Get delivery ID from AsyncStorage
    // const loadDeliveryId = async () => {
    //   try {
    //     const user = await AsyncStorage.getItem('deliveryUser');
    //     console.log('[loadDeliveryId] Raw user data:', user);
    //     if (user) {
    //       const parsedUser = JSON.parse(user);
    //       console.log('[loadDeliveryId] Parsed user:', parsedUser);
    //       console.log('[loadDeliveryId] Available keys:', Object.keys(parsedUser));
    //       
    //       // Try different possible ID fields
    //       let id = parsedUser._id || parsedUser.id || parsedUser.deliveryId || '';
    //       
    //       // If no ID exists, use email as fallback
    //       if (!id && parsedUser.email) {
    //         id = parsedUser.email;
    //       }
    //       
    //       console.log('[loadDeliveryId] Using ID:', id);
    //       setDeliveryId(id);
    //     } else {
    //       console.warn('[loadDeliveryId] No user data found in AsyncStorage');
    //     }
    //   } catch (error) {
    //     console.error('Error loading delivery ID:', error);
    //   }
    // };
    // loadDeliveryId();
    
    // Load accepted orders from storage
    // const loadAcceptedOrders = async () => {
    //   try {
    //     const stored = await AsyncStorage.getItem('acceptedOrderIds');
    //     if (stored) {
    //       setAcceptedOrders(JSON.parse(stored));
    //     }
    //   } catch (error) {
    //     console.error('Error loading accepted orders:', error);
    //   }
    // };
    // loadAcceptedOrders();
    
    console.log('[useEffect] Dummy data mode - no AsyncStorage');
  }, []);

  const { availableOrders, myDeliveries, isLoading, isError, error, refetch } = useOrdersQuery(
    DUMMY_AVAILABLE_ORDERS,
    DUMMY_MY_DELIVERIES,
    deliveryId
  );

  console.log('[AvailableOrders] Available Orders:', availableOrders.length);
  console.log('[AvailableOrders] My Deliveries:', myDeliveries.length);
  console.log('[AvailableOrders] Accepted Orders:', acceptedOrders);

  const { handleAcceptOrder, handlePickedUp, handleUpdateProgress, isUpdating, acceptError, updateError } =
    useOrderMutations(deliveryId);

  const { handleNavigate, handleCall } = useOrderActions();

  useEffect(() => {
    // Refetch when deliveryId is set or component mounts
    // Always refetch to ensure dummy data is loaded
    console.log('[useEffect] Refetching orders, deliveryId:', deliveryId);
    refetch();
  }, [deliveryId, refetch]);

  const handleDetailsPress = (orderId: string) => {
    router.push({
      pathname: '/delivery/(tabs)/order-details',
      params: { orderId },
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderEmptyState = (type: TabType) => {
    const state = type === 'available' ? EMPTY_STATE.available : EMPTY_STATE.myDeliveries;
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name={state.icon as any} size={64} color="#E0E0E0" />
        </View>
        <Text style={styles.emptyStateText}>{state.title}</Text>
        <Text style={styles.emptyStateSubtext}>{state.subtitle}</Text>
      </View>
    );
  };

  const renderError = () => {
    const errorMessage = error?.message || 'An error occurred while loading orders';
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B35" />
        </View>
        <Text style={styles.emptyStateText}>Error Loading Orders</Text>
        <Text style={styles.emptyStateSubtext}>{errorMessage}</Text>
      </View>
    );
  };

  useEffect(() => {
    if (acceptError) {
      Alert.alert('Error', acceptError.message || 'Failed to accept order');
    }
  }, [acceptError]);

  useEffect(() => {
    if (updateError) {
      Alert.alert('Error', updateError.message || 'Failed to update order');
    }
  }, [updateError]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={COLOR_CONSTANTS.primaryGradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.title}>Deliveries</Text>
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
            onRefresh={onRefresh}
          />
        }
      >
        {activeTab === 'available' ? (
          availableOrders.length > 0 ? (
            availableOrders
              .filter((order) => !acceptedOrders.includes(order._id))
              .map((order) => (
                <AvailableOrderCard
                  key={order._id}
                  order={order}
                  loading={isUpdating}
                  onAccept={(accepted) => {
                    try {
                      console.log('Accept order clicked for:', accepted._id);
                      console.log('Current deliveryId:', deliveryId);
                      // Save accepted order to local state
                      const newAcceptedOrders = [...acceptedOrders, accepted._id];
                      setAcceptedOrders(newAcceptedOrders);
                      // AsyncStorage.setItem('acceptedOrderIds', JSON.stringify(newAcceptedOrders));
                      // For dummy data, we don't need a real deliveryId
                      handleAcceptOrder(accepted._id);
                      setActiveTab('my-deliveries');
                    } catch (error) {
                      console.error('Error accepting order:', error);
                      Alert.alert('Error', 'Failed to accept order. Please try again.');
                    }
                  }}
                />
              ))
          ) : isError ? (
            renderError()
          ) : (
            renderEmptyState('available')
          )
        ) : (
          // My Deliveries section - show both from API and locally accepted orders
          (() => {
            const acceptedOrdersData = availableOrders.filter((order) =>
              acceptedOrders.includes(order._id)
            );
            const allDeliveries = [...myDeliveries, ...acceptedOrdersData];
            
            return allDeliveries.length > 0 ? (
              allDeliveries.map((order) => (
                <MyDeliveryCard
                  key={order._id}
                  order={order}
                  stages={DELIVERY_STAGES}
                  loading={isUpdating}
                  onNavigate={handleNavigate}
                  onCall={handleCall}
                  onDetails={() => handleDetailsPress(order._id)}
                  onPickedUp={handlePickedUp}
                  onProgressUpdate={handleUpdateProgress}
                />
              ))
            ) : isError ? (
              renderError()
            ) : (
              renderEmptyState('my-deliveries')
            );
          })()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
