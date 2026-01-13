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
<<<<<<< HEAD
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
  progressContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  progressOuterContainer: {
    backgroundColor: '#e3eef1ff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    shadowColor: '#e8ebebff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStage: {
    alignItems: 'center',
    flex: 1,
  },
  progressStageCompleted: {},
  progressStageCurrent: {},
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressIconCurrent: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  progressIconCompleted: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  progressLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    textAlign: 'center',
  },
  progressLabelActive: {
    color: Colors.text.primary,
  },
  progressLine: {
    height: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: -10,
    marginBottom: 38,
  },
  progressLineCompleted: {
    backgroundColor: '#4CAF50',
  },
});
=======
}
>>>>>>> 5250b6530a7a1dabfdba8b438226f4dad449c8aa
