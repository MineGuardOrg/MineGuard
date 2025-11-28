import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { DashboardService } from '../services/dashboardService';
import { DashboardData } from '../types';
import { StatCard } from '../components/StatCard';
import { WorkerCard } from '../components/WorkerCard';
import { AlertCard } from '../components/AlertCard';
import { AuthService } from '../../auth/services/authService';

interface DashboardScreenProps {
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const dashboardData = await DashboardService.getDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              DashboardService.disconnectWebSocket();
              onLogout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadData();

    // Conectar WebSocket para actualizaciones en tiempo real
    DashboardService.connectWebSocket(
      (update) => {
        setData((prev) => {
          if (!prev) return null;
          return { ...prev, ...update };
        });
      },
      (error) => {
        console.error('WebSocket error:', error);
      }
    );

    // Cleanup
    return () => {
      DashboardService.disconnectWebSocket();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando dashboard...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudieron cargar los datos</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Monitoreo en Tiempo Real</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Alertas</Text>
          <View style={styles.statsRow}>
            <StatCard
              title="Críticas"
              value={data.alert_counts.critical}
              color="#FF3B30"
            />
            <StatCard
              title="Advertencias"
              value={data.alert_counts.warning}
              color="#FF9500"
            />
            <StatCard
              title="Informativas"
              value={data.alert_counts.info}
              color="#007AFF"
            />
          </View>
        </View>

        {/* Active Workers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Trabajadores Activos ({data.active_workers.length})
          </Text>
          {data.active_workers.length > 0 ? (
            data.active_workers.map((worker) => (
              <WorkerCard key={worker.user_id} worker={worker} />
            ))
          ) : (
            <Text style={styles.emptyText}>No hay trabajadores activos</Text>
          )}
        </View>

        {/* Biometrics by Area */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biométricas por Área</Text>
          {data.biometrics_by_area.length > 0 ? (
            data.biometrics_by_area.map((area, index) => (
              <View key={index} style={styles.areaCard}>
                <Text style={styles.areaName}>{area.area_name}</Text>
                <View style={styles.areaStats}>
                  <View style={styles.areaStat}>
                    <Text style={styles.areaStatLabel}>Trabajadores</Text>
                    <Text style={styles.areaStatValue}>{area.worker_count}</Text>
                  </View>
                  <View style={styles.areaStat}>
                    <Text style={styles.areaStatLabel}>FC Promedio</Text>
                    <Text style={styles.areaStatValue}>
                      {area.avg_heart_rate.toFixed(0)} bpm
                    </Text>
                  </View>
                  <View style={styles.areaStat}>
                    <Text style={styles.areaStatLabel}>Temp Promedio</Text>
                    <Text style={styles.areaStatValue}>
                      {area.avg_temperature.toFixed(1)}°C
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No hay datos de áreas</Text>
          )}
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas Recientes</Text>
          {data.recent_alerts.length > 0 ? (
            data.recent_alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <Text style={styles.emptyText}>No hay alertas recientes</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 32,
  },
  areaCard: {
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
  areaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  areaStats: {
    flexDirection: 'row',
    gap: 16,
  },
  areaStat: {
    flex: 1,
  },
  areaStatLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  areaStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});
