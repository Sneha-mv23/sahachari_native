import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../types';
import { COLOR_CONSTANTS } from '../constants';
import { Colors } from '../../../../constants/Colors';
import { availableOrderCardStyles as styles } from '../styles/AvailableOrderCard.styles';

interface AvailableOrderCardProps {
  order: Order;
  loading: boolean;
  onAccept: (order: Order) => void;
}

export const AvailableOrderCard: React.FC<AvailableOrderCardProps> = ({
  order,
  loading,
  onAccept,
}) => {
  return (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View style={styles.orderIdContainer}>
          <Ionicons name="cube-outline" size={18} color={Colors.primary} />
          <Text style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</Text>
        </View>
        <LinearGradient
          colors={COLOR_CONSTANTS.priceGradient as any}
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
            <Ionicons name="location" size={16} color={COLOR_CONSTANTS.pickupIcon} />
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.label}>Pickup Location</Text>
            <Text style={styles.address}>{order.pickupAddress}</Text>
          </View>
        </View>

        <View style={styles.dashedLine} />

        <View style={styles.addressRow}>
          <View style={[styles.iconCircle, styles.iconCircleGreen]}>
            <Ionicons name="flag" size={16} color={COLOR_CONSTANTS.deliveryIcon} />
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.label}>Drop Location</Text>
            <Text style={styles.address}>{order.deliveryAddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.distanceContainer}>
        <Ionicons name="navigate-circle" size={16} color={COLOR_CONSTANTS.secondary} />
        <Text style={styles.distance}>{order.distance}</Text>
      </View>

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => onAccept(order)}
        activeOpacity={0.8}
        disabled={loading}
      >
        <LinearGradient
          colors={COLOR_CONSTANTS.primaryGradient as any}
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
};
