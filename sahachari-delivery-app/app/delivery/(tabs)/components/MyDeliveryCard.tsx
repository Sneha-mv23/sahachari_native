import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
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
          onPress={() => onPickedUp(order._id)}
          disabled={loading}
        >
          <LinearGradient
            colors={COLOR_CONSTANTS.pickedUpGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statusButtonGradient}
          >
            {loading ? (
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
