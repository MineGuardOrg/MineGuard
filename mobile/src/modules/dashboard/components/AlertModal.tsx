import React, { useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Alert, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { RealtimeAlert } from "../types/alert.types";
import { styles } from "./AlertModal.styles";

interface AlertModalProps {
  alert: RealtimeAlert | null;
  visible: boolean;
  onDismiss: () => void;
  onAction?: () => void;
}

/**
 * Modal de alerta en tiempo real con vibración
 */
export const AlertModal: React.FC<AlertModalProps> = ({ alert, visible, onDismiss, onAction }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && alert) {
      //   console.log('🚨 AlertModal visible:', alert);
      //   console.log('📱 Platform:', Platform.OS);

      // Animación de entrada
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Intentar vibración
      triggerVibration(alert.severity);
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, alert]);

  const triggerVibration = async (severity: "critical" | "warning") => {
    try {
      //   console.log('Intentando vibrar con severidad:', severity);

      // Verificar si Haptics está disponible
      const isAvailable = await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        .then(() => true)
        .catch(() => false);

      if (!isAvailable) {
        console.warn("Haptics no disponible en este dispositivo");
        // Fallback: Alert nativo
        if (severity === "critical") {
          Alert.alert("ALERTA CRÍTICA", alert?.message || "Valor crítico detectado", [
            { text: "OK", onPress: onDismiss },
          ]);
        }
        return;
      }

      if (severity === "critical") {
        console.log("Vibrando: CRÍTICA (3 veces)");
        // Vibración fuerte y prolongada para críticas (3 veces)
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        //   console.log("Vibración 1/3");
        }, 200);

        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        //   console.log("Vibración 2/3");
        }, 400);

        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        //   console.log("Vibración 3/3");
        }, 600);
      } else {
        // console.log("Vibrando: WARNING (1 vez)");
        // Vibración moderada para warnings
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

    //   console.log("Vibración completada");
    } catch (error) {
      console.error("Error al vibrar:", error);
    }
  };

  if (!alert) return null;

  const isCritical = alert.severity === "critical";
  const icon = isCritical ? "🚨" : "⚠️";

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getAlertTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      high_body_temperature: "Temperatura Corporal Alta",
      heart_rate_high: "Ritmo Cardíaco Alto",
      heart_rate_low: "Ritmo Cardíaco Bajo",
      toxic_gas: "Gases Tóxicos Detectados",
      fall_detected: "Caída Detectada",
    };
    return typeMap[type] || type;
  };

  const getValueUnit = (type: string): string => {
    if (type.includes("temperature") || type.includes("temp")) return "°C";
    if (type.includes("heart") || type.includes("pulse")) return "BPM";
    if (type.includes("gas") || type.includes("co")) return "ppm";
    return "";
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            isCritical ? styles.criticalContainer : styles.warningContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Icono */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Título */}
          <Text style={[styles.title, isCritical ? styles.criticalTitle : styles.warningTitle]}>
            {isCritical ? "¡ALERTA CRÍTICA!" : "¡ADVERTENCIA!"}
          </Text>

          {/* Tipo de alerta */}
          <Text style={styles.message}>{getAlertTypeLabel(alert.type)}</Text>

          {/* Valor destacado */}
          <Text style={[styles.valueHighlight, isCritical ? styles.criticalValue : styles.warningValue]}>
            {alert.value.toFixed(1)} {getValueUnit(alert.type)}
          </Text>

          {/* Detalles */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Trabajador:</Text>
              <Text style={styles.detailValue}>{alert.worker_name}</Text>
            </View>
            {alert.area && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Área:</Text>
                <Text style={styles.detailValue}>{alert.area}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hora:</Text>
              <Text style={styles.detailValue}>{formatTimestamp(alert.timestamp)}</Text>
            </View>
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.dismissButton]} onPress={onDismiss}>
              <Text style={styles.dismissButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
