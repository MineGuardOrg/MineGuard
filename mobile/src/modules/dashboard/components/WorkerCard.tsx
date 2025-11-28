import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActiveWorker } from '../types';

interface WorkerCardProps {
  worker: ActiveWorker;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const getHeartRateColor = (hr: number) => {
    if (hr > 120) return '#FF3B30';
    if (hr > 100) return '#FF9500';
    return '#34C759';
  };

  const getTempColor = (temp: number) => {
    if (temp > 38) return '#FF3B30';
    if (temp > 37.5) return '#FF9500';
    return '#34C759';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{worker.full_name}</Text>
          <Text style={styles.subtitle}>{worker.employee_number}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{worker.shift_name}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>📍 {worker.area_name}</Text>
        <Text style={styles.infoText}>⏱️ {worker.hours_worked.toFixed(1)}h</Text>
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
            {worker.avg_heart_rate.toFixed(0)} bpm
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
            {worker.avg_temperature.toFixed(1)}°C
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  metrics: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
  },
});
