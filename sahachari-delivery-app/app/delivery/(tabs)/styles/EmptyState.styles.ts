import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/Colors';

export const emptyStateStyles = StyleSheet.create({
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
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.light,
    textAlign: 'center',
  },
});
