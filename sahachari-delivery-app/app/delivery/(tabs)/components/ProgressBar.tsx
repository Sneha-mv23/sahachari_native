import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
                onPress={() => {
                  if (isNext || isCurrent) {
                    onStagePress(order._id, stage.status);
                  }
                }}
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
                  <Ionicons
                    name={isCompleted ? 'checkmark' : stage.icon}
                    size={20}
                    color={isCompleted || isCurrent ? '#FFF' : '#999'}
                  />
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
