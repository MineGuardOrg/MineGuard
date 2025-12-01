import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DashboardService } from "../services/dashboardService";
import { DashboardData } from "../types";
import { StatCard } from "../components/StatCard";
import { WorkerCard } from "../components/WorkerCard";
import { AlertCard } from "../components/AlertCard";
import { AuthService } from "../../auth/services/authService";
import { StorageService } from "../../../core/storage";
import { JWTHelper } from "../../../core/jwtHelper";
import { styles } from "./DashboardScreen.styles";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, "Dashboard">;

interface DashboardScreenProps {
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userFullName, setUserFullName] = useState<string>("Usuario");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const loadData = async () => {
    try {
      const dashboardData = await DashboardService.getDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error("Load data error:", error);
      Alert.alert("Error", "No se pudieron cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async () => {
    try {
      const token = await StorageService.getToken();
      if (token) {
        const fullName = JWTHelper.getUserFullName(token);
        // console.log('User full name from token:', fullName);
        setUserFullName(fullName);
      } else {
        // console.log('No token found');
      }
    } catch (error) {
      // console.error('Error loading user info:', error);
      setUserFullName("Usuario");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          try {
            await AuthService.logout();
            DashboardService.disconnectWebSocket();
            onLogout();
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadData();
    loadUserInfo();

    // Conectar WebSocket para actualizaciones en tiempo real
    DashboardService.connectWebSocket(
      (update) => {
        setData((prev) => {
          if (!prev) return null;
          return { ...prev, ...update };
        });
      },
      (error) => {
        console.error("WebSocket error:", error);
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
          <Text style={styles.headerTitle}>MineGuard Dashboard</Text>
          <Text style={styles.headerSubtitle}>Monitoreo en Tiempo Real • {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Menú de usuario */}
        <View>
          <TouchableOpacity style={styles.userMenuButton} onPress={() => setShowUserMenu(!showUserMenu)}>
            <Text style={styles.userMenuName}>{userFullName}</Text>
            <Text style={styles.userMenuIcon}>{showUserMenu ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowUserMenu(false);
                  navigation.navigate("Profile");
                }}
              >
                <Text style={styles.dropdownItemText}>Perfil</Text>
              </TouchableOpacity>

              <View style={styles.dropdownDivider} />

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowUserMenu(false);
                  handleLogout();
                }}
              >
                <Text style={[styles.dropdownItemText, styles.dropdownItemTextDanger]}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Dashboard Grid Layout para iPad horizontal */}
        <View style={styles.dashboardGrid}>
          {/* Columna Izquierda - Alertas y Estadísticas */}
          <ScrollView
            style={styles.leftColumn}
            showsVerticalScrollIndicator={true}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {/* Resumen de Alertas del Último Mes */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Alertas del Último Mes</Text>
              <View style={styles.alertStatsGrid}>
                <View key="critical" style={[styles.alertStatCard, { backgroundColor: "#FFF5F5" }]}>
                  <Text style={[styles.alertStatValue, { color: "#FF3B30" }]}>{data.alert_counts.critical}</Text>
                  <Text style={styles.alertStatLabel}>Críticas</Text>
                </View>
                <View key="warning" style={[styles.alertStatCard, { backgroundColor: "#FFF9F0" }]}>
                  <Text style={[styles.alertStatValue, { color: "#FF9500" }]}>{data.alert_counts.warning}</Text>
                  <Text style={styles.alertStatLabel}>Advertencias</Text>
                </View>
                <View key="info" style={[styles.alertStatCard, { backgroundColor: "#F0F7FF" }]}>
                  <Text style={[styles.alertStatValue, { color: "#007AFF" }]}>{data.alert_counts.info}</Text>
                  <Text style={styles.alertStatLabel}>Informativas</Text>
                </View>
              </View>
            </View>

            {/* Biométricas por Área */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Biométricas por Área</Text>
              {data.biometrics_by_area.length > 0 ? (
                <View style={styles.biometricsTable}>
                  {/* Encabezado de la tabla */}
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.tableColArea]}>Área</Text>
                    <Text style={[styles.tableHeaderText, styles.tableColMetric]}>❤️ BPM</Text>
                    <Text style={[styles.tableHeaderText, styles.tableColMetric]}>🌡️ Temp (°C)</Text>
                  </View>

                  {/* Filas de la tabla */}
                  {data.biometrics_by_area.map((area, index) => (
                    <View
                      key={area.area_name}
                      style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                    >
                      <Text style={[styles.tableCellText, styles.tableColArea, styles.tableAreaName]}>
                        {area.area_name}
                      </Text>
                      <Text style={[styles.tableCellText, styles.tableColMetric, styles.tableMetricValue]}>
                        {area.avg_heart_rate ? area.avg_heart_rate.toFixed(0) : "N/A"}
                      </Text>
                      <Text style={[styles.tableCellText, styles.tableColMetric, styles.tableMetricValue]}>
                        {area.avg_temperature ? area.avg_temperature.toFixed(1) : "N/A"}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No hay datos de áreas disponibles</Text>
              )}
            </View>

            {/* Alertas Recientes */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Alertas Recientes</Text>
              {data.recent_alerts.length > 0 ? (
                <View style={styles.alertsList}>
                  {data.recent_alerts.slice(0, 8).map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No hay alertas recientes</Text>
              )}
            </View>
          </ScrollView>

          {/* Columna Derecha - Trabajadores Activos */}
          <View style={styles.rightColumn}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Trabajadores Activos</Text>
                <View style={styles.workerCountBadge}>
                  <Text style={styles.workerCountText}>{data.active_workers.length}</Text>
                </View>
              </View>
              {data.active_workers.length > 0 ? (
                <ScrollView style={styles.workersList} showsVerticalScrollIndicator={true}>
                  {data.active_workers.map((worker) => (
                    <WorkerCard key={worker.user_id} worker={worker} />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No hay trabajadores activos en este momento</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
