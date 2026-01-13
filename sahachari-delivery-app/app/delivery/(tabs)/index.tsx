import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
  const [deliveryId] = useState<string>(''); // TODO: Get from user context/auth

  const { availableOrders, myDeliveries, isLoading, isError, error, refetch } = useOrdersQuery(
    DUMMY_AVAILABLE_ORDERS,
    DUMMY_MY_DELIVERIES,
    deliveryId
  );

  const { handleAcceptOrder, handlePickedUp, handleUpdateProgress, isUpdating, acceptError, updateError } =
    useOrderMutations(deliveryId);

  const { handleNavigate, handleCall } = useOrderActions();

  useEffect(() => {
    // Refetch when component mounts
    refetch();
  }, [refetch]);

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
            availableOrders.map((order) => (
              <AvailableOrderCard
                key={order._id}
                order={order}
                loading={isUpdating}
                onAccept={(accepted) => {
                  handleAcceptOrder(accepted._id);
                  setActiveTab('my-deliveries');
                }}
              />
            ))
          ) : isError ? (
            renderError()
          ) : (
            renderEmptyState('available')
          )
        ) : myDeliveries.length > 0 ? (
          myDeliveries.map((order) => (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}