import { StyleSheet } from 'react-native';
import { COLOR_CONSTANTS } from '../constants';

export const progressBarStyles = StyleSheet.create({
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
    color: '#333',
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
    backgroundColor: COLOR_CONSTANTS.primary,
    shadowColor: COLOR_CONSTANTS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  progressIconCompleted: {
    backgroundColor: COLOR_CONSTANTS.success,
    shadowColor: COLOR_CONSTANTS.success,
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
    color: '#333',
  },
  progressLine: {
    height: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: -10,
    marginBottom: 38,
  },
  progressLineCompleted: {
    backgroundColor: COLOR_CONSTANTS.success,
  },
});
