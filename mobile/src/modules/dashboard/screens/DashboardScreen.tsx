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
import { RealtimeAlert } from "../types/alert.types";
import { StatCard } from "../components/StatCard";
import { WorkerCard } from "../components/WorkerCard";
import { AlertCard } from "../components/AlertCard";
import { AlertModal } from "../components/AlertModal";
import { CreateIncidentModal } from "../components/CreateIncidentModal";
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

  // Estado para alertas en tiempo real
  const [currentAlert, setCurrentAlert] = useState<RealtimeAlert | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Estado para modal de crear incidente
  const [selectedAlertForIncident, setSelectedAlertForIncident] = useState<any>(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

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

  const handleAlertPress = (alert: any) => {
    setSelectedAlertForIncident(alert);
    setShowIncidentModal(true);
  };

  const handleIncidentSuccess = async () => {
    // Recargar datos después de crear incidente
    await loadData();
  };

  useEffect(() => {
    loadData();
    loadUserInfo();

    // Conectar WebSocket para alertas en tiempo real
    DashboardService.connectWebSocket(
      (alert: RealtimeAlert) => {
        console.log("Nueva alerta recibida:", alert);

        // Mostrar modal con la alerta
        setCurrentAlert(alert);
        setShowAlertModal(true);

        // Recargar datos para actualizar la lista de alertas recientes
        loadData();
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
          <Text style={styles.headerTitle}>
            {data.area_biometrics?.area || 'MineGuard Dashboard'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {data.area_biometrics && 
             data.area_biometrics.avg_heart_rate !== undefined && 
             data.area_biometrics.avg_temperature !== undefined ? (
              `❤️ ${data.area_biometrics.avg_heart_rate.toFixed(0)} BPM • 🌡️ ${data.area_biometrics.avg_temperature.toFixed(1)}°C • 👥 ${data.area_biometrics.worker_count || 0} trabajadores`
            ) : (
              `Monitoreo en Tiempo Real • ${new Date().toLocaleDateString()}`
            )}
          </Text>
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
          {/* Columna Izquierda - Alertas y Biométricas (50/50) */}
          <View style={styles.leftColumn}>
            {/* Alertas Recientes - 50% superior */}
            <View style={styles.topCard}>
              <Text style={styles.cardTitle}>Alertas Recientes</Text>
              {data.recent_alerts.length > 0 ? (
                <ScrollView
                  style={styles.alertsScrollContainer}
                  showsVerticalScrollIndicator={true}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                  <View style={styles.alertsList}>
                    {data.recent_alerts.slice(0, 8).map((alert) => (
                      <AlertCard key={alert.id} alert={alert} onPress={handleAlertPress} />
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <Text style={styles.emptyText}>No hay alertas recientes</Text>
              )}
            </View>

            {/* Incidentes - 50% inferior */}
            <View style={styles.bottomCard}>
              <Text style={styles.cardTitle}>Incidentes Reportados</Text>
              {data.incidents && data.incidents.length > 0 ? (
                <ScrollView style={styles.biometricsScrollContainer} showsVerticalScrollIndicator={true}>
                  <View style={styles.biometricsTable}>
                    {/* Encabezado de la tabla */}
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, { flex: 2 }]}>Usuario</Text>
                      <Text style={[styles.tableHeaderText, { flex: 2 }]}>Descripción</Text>
                      <Text style={[styles.tableHeaderText, { flex: 1 }]}>Severidad</Text>
                      <Text style={[styles.tableHeaderText, { flex: 1 }]}>Fecha</Text>
                    </View>

                    {/* Filas de la tabla */}
                    {data.incidents.map((incident, index) => (
                      <View
                        key={incident.id}
                        style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                      >
                        <Text style={[styles.tableCellText, { flex: 2 }]} numberOfLines={1}>
                          {incident.user_full_name}
                        </Text>
                        <Text style={[styles.tableCellText, { flex: 2 }]} numberOfLines={2}>
                          {incident.description}
                        </Text>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <View
                            style={[
                              styles.severityBadge,
                              {
                                backgroundColor:
                                  incident.severity === "critical"
                                    ? "#DC2626"
                                    : incident.severity === "high"
                                    ? "#EF4444"
                                    : incident.severity === "medium"
                                    ? "#F59E0B"
                                    : "#3B82F6",
                              },
                            ]}
                          >
                            <Text style={styles.severityBadgeText}>
                              {incident.severity === "critical"
                                ? "Crítico"
                                : incident.severity === "high"
                                ? "Alto"
                                : incident.severity === "medium"
                                ? "Medio"
                                : "Bajo"}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.tableCellText, { flex: 1, fontSize: 11 }]} numberOfLines={2}>
                          {new Date(incident.created_at).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <Text style={styles.emptyText}>No hay incidentes reportados</Text>
              )}
            </View>
          </View>

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

      {/* Modal de Alerta en Tiempo Real */}
      <AlertModal
        alert={currentAlert}
        visible={showAlertModal}
        onDismiss={() => {
          setShowAlertModal(false);
          setCurrentAlert(null);
        }}
        onAction={() => {
          setShowAlertModal(false);
          // Aquí podrías navegar a una vista de detalles de la alerta
        }}
      />

      {/* Modal para Crear Incidente */}
      <CreateIncidentModal
        visible={showIncidentModal}
        alert={selectedAlertForIncident}
        onClose={() => {
          setShowIncidentModal(false);
          setSelectedAlertForIncident(null);
        }}
        onSuccess={handleIncidentSuccess}
      />
    </View>
  );
};
