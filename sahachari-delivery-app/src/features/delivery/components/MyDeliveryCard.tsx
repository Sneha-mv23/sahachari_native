import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Order, DeliveryStage } from '../types';
import { COLOR_CONSTANTS } from '../constants';
import { Colors } from '../../../../constants/Colors';
import { ActionButtons } from './ActionButtons';
import { ProgressBar } from './ProgressBar';
import { myDeliveryCardStyles as styles } from '../styles/MyDeliveryCard.styles';

interface MyDeliveryCardProps {
  order: Order;
  stages: DeliveryStage[];
  loading: boolean;
  onNavigate: (address: string) => void;
  onCall: () => void;
  onDetails: () => void;
  onPickedUp: (orderId: string) => void;
  onProgressUpdate: (orderId: string, status: number) => void;
}

export const MyDeliveryCard: React.FC<MyDeliveryCardProps> = ({
  order,
  stages,
  loading,
  onNavigate,
  onCall,
  onDetails,
  onPickedUp,
  onProgressUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePickedUpPress = async () => {
    try {
      setIsLoading(true);
      console.log('[MyDeliveryCard] Marking as picked up:', order._id);
      await onPickedUp(order._id);
      console.log('[MyDeliveryCard] Successfully marked as picked up');
    } catch (error) {
      console.error('[MyDeliveryCard] Error marking as picked up:', error);
      Alert.alert('Error', 'Failed to mark order as picked up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.orderCard}>
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

      <ActionButtons
        onNavigate={() => onNavigate(order.deliveryAddress)}
        onCall={onCall}
        onDetails={onDetails}
      />

      {order.status === 1 ? (
        <TouchableOpacity
          style={styles.statusButton}
          onPress={handlePickedUpPress}
          disabled={isLoading || loading}
        >
          <LinearGradient
            colors={COLOR_CONSTANTS.pickedUpGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statusButtonGradient}
          >
            {isLoading || loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-done" size={20} color="#FFF" />
                <Text style={styles.statusButtonText}>Mark as Picked Up</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <ProgressBar
          order={order}
          stages={stages}
          onStagePress={onProgressUpdate}
        />
      )}
    </View>
  );
};
