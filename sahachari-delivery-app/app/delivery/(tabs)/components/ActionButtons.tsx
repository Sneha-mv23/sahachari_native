import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLOR_CONSTANTS } from '../constants';
import { actionButtonsStyles as styles } from '../styles/ActionButtons.styles';

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
  backgroundColor: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onPress,
  color,
  backgroundColor,
}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={[styles.actionIconCircle, { backgroundColor }]}>
      <Ionicons name={icon as any} size={18} color={color} />
    </View>
    <Text style={[styles.actionButtonText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

interface ActionButtonsProps {
  onNavigate: () => void;
  onCall: () => void;
  onDetails: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onNavigate,
  onCall,
  onDetails,
}) => (
  <View style={styles.actionButtons}>
    <ActionButton
      icon="navigate"
      label="Navigate"
      onPress={onNavigate}
      color={COLOR_CONSTANTS.navigate}
      backgroundColor={COLOR_CONSTANTS.navigateBg}
    />
    <ActionButton
      icon="call"
      label="Call"
      onPress={onCall}
      color={COLOR_CONSTANTS.success}
      backgroundColor={COLOR_CONSTANTS.callBg}
    />
    <ActionButton
      icon="information-circle"
      label="Details"
      onPress={onDetails}
      color="#FF9800"
      backgroundColor={COLOR_CONSTANTS.detailsBg}
    />
  </View>
);
