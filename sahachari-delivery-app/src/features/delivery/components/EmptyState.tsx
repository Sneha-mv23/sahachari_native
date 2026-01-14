import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabType } from '../types';
import { EMPTY_STATE } from '../constants';
import { emptyStateStyles as styles } from '../styles/EmptyState.styles';

interface EmptyStateProps {
  type: TabType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
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
