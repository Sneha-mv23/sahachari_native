import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order, DeliveryStage } from '../types';
import { COLOR_CONSTANTS } from '../constants';
import { progressBarStyles as styles } from '../styles/ProgressBar.styles';

interface ProgressBarProps {
  order: Order;
  stages: DeliveryStage[];
  onStagePress: (orderId: string, status: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  order,
  stages,
  onStagePress,
}) => {
  const [loadingStage, setLoadingStage] = useState<number | null>(null);

  const handleStagePress = async (stage: DeliveryStage) => {
    const isNext = order.status === stage.status - 1;
    const isCurrent = order.status === stage.status;

    if (!isNext && !isCurrent) {
      return; // Disabled, don't process
    }

    try {
      setLoadingStage(stage.status);
      console.log('[ProgressBar] Clicking stage:', stage.activeLabel, 'status:', stage.status);
      await onStagePress(order._id, stage.status);
      console.log('[ProgressBar] Successfully updated to:', stage.activeLabel);
    } catch (error) {
      console.error('[ProgressBar] Error updating stage:', error);
    } finally {
      setLoadingStage(null);
    }
  };
  return (
    <View style={styles.progressOuterContainer}>
      <Text style={styles.progressTitle}>Delivery Progress</Text>
      <View style={styles.progressBar}>
        {stages.map((stage, index) => {
          const isCompleted = order.status > stage.status;
          const isCurrent = order.status === stage.status;
          const isNext = order.status === stage.status - 1;
          const displayLabel = isCompleted ? stage.completedLabel : stage.activeLabel;

          return (
            <React.Fragment key={stage.status}>
              <TouchableOpacity
                style={[
                  styles.progressStage,
                  isCompleted && styles.progressStageCompleted,
                  isCurrent && styles.progressStageCurrent,
                ]}
                onPress={() => handleStagePress(stage)}
                disabled={!isNext && !isCurrent}
                activeOpacity={isNext || isCurrent ? 0.7 : 1}
              >
                <View
                  style={[
                    styles.progressIcon,
                    isCompleted && styles.progressIconCompleted,
                    isCurrent && styles.progressIconCurrent,
                  ]}
                >
                  {loadingStage === stage.status ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Ionicons
                      name={isCompleted ? 'checkmark' : stage.icon}
                      size={20}
                      color={isCompleted || isCurrent ? '#FFF' : '#999'}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.progressLabel,
                    (isCompleted || isCurrent) && styles.progressLabelActive,
                  ]}
                >
                  {displayLabel}
                </Text>
              </TouchableOpacity>

              {index < stages.length - 1 && (
                <View
                  style={[
                    styles.progressLine,
                    isCompleted && styles.progressLineCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};
