import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RecentAlert } from '../types';

interface AlertCardProps {
  alert: RecentAlert;
  onPress?: (alert: RecentAlert) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onPress }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':      // Crítico
      case 'critical':
        return '#EF4444'; // Rojo
      case 'medium':    // Advertencia
      case 'warning':
        return '#F59E0B'; // Amarillo/Naranja
      case 'low':       // Bajo
      case 'info':
        return '#3B82F6'; // Azul
      default:
        return '#6B7280'; // Gris
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'CRÍTICO';
      case 'medium':
      case 'warning':
        return 'ADVERTENCIA';
      case 'low':
      case 'info':
        return 'INFO';
      default:
        return severity.toUpperCase();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(alert)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.severityBadge,
            { backgroundColor: getSeverityColor(alert.severity) },
          ]}
        >
          <Text style={styles.severityText}>
            {getSeverityLabel(alert.severity)}
          </Text>
        </View>
        <Text style={styles.time}>{formatDate(alert.created_at)}</Text>
      </View>

      <Text style={styles.message}>{alert.message}</Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{alert.user_full_name}</Text>
        <Text style={styles.footerText}>{alert.area_name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});