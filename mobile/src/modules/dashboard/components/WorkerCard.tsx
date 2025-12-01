import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActiveWorker } from '../types';

interface WorkerCardProps {
  worker: ActiveWorker;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const getHeartRateColor = (hr: number | null | undefined) => {
    if (!hr) return '#999';
    if (hr > 120) return '#FF3B30';
    if (hr > 100) return '#FF9500';
    return '#34C759';
  };

  const getTempColor = (temp: number | null | undefined) => {
    if (!temp) return '#999';
    if (temp > 38) return '#FF3B30';
    if (temp > 37.5) return '#FF9500';
    return '#34C759';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{worker.full_name || 'N/A'}</Text>
          <Text style={styles.subtitle}>{worker.employee_number || 'N/A'}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{worker.shift_name || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>📍 {worker.area_name || 'N/A'}</Text>
        <Text style={styles.infoText}>⏱️ {worker.hours_worked ? worker.hours_worked.toFixed(1) : '0'}h</Text>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Ritmo Cardíaco</Text>
          <Text
            style={[
              styles.metricValue,
              { color: getHeartRateColor(worker.avg_heart_rate) },
            ]}
          >
            {worker.avg_heart_rate ? worker.avg_heart_rate.toFixed(0) : 'N/A'} bpm
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Temperatura</Text>
          <Text
            style={[
              styles.metricValue,
              { color: getTempColor(worker.avg_temperature) },
            ]}
          >
            {worker.avg_temperature ? worker.avg_temperature.toFixed(1) : 'N/A'}°C
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  info: {
    flexDirection: 'row',
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    gap: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});