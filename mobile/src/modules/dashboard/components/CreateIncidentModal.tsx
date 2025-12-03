import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RecentAlert } from '../types';
import { apiClient } from '../../../core/api';
import { API_ENDPOINTS } from '../../../core/config';

interface CreateIncidentModalProps {
  visible: boolean;
  alert: RecentAlert | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface AssignedUser {
  id: number;
  first_name: string;
  last_name: string;
  employee_number: string;
}

type Severity = 'low' | 'medium' | 'high' | 'critical';

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  visible,
  alert,
  onClose,
  onSuccess,
}) => {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && alert) {
      // Pre-llenar severidad basado en la alerta
      setSeverity(alert.severity as Severity);
    }
  }, [visible, alert]);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }

    if (description.trim().length < 10) {
      Alert.alert('Error', 'La descripción debe tener al menos 10 caracteres');
      return;
    }

    if (!alert) return;

    // Validar que los campos requeridos existan
    if (!alert.user_id || !alert.reading_id) {
      console.error('Alerta con datos incompletos:', alert);
      Alert.alert('Error', 'La alerta no contiene los datos necesarios para crear el incidente');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        description: description.trim(),
        severity,
        user_id: alert.user_id,
        device_id: alert.device_id || alert.user_id,
        reading_id: alert.reading_id,
        alert_id: alert.id,
      };

      console.log('Enviando incidente:', payload);

      await apiClient.post(API_ENDPOINTS.CREATE_INCIDENT, payload);

      Alert.alert('Éxito', 'Incidente creado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            onSuccess();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error creating incident:', error);
      const errorMessage = error?.response?.data?.detail || 'No se pudo crear el incidente';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setSeverity('medium');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getSeverityLabel = (sev: Severity): string => {
    const labels = {
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto',
      critical: 'Crítico',
    };
    return labels[sev];
  };

  const getSeverityColor = (sev: Severity): string => {
    const colors = {
      low: '#3B82F6',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626',
    };
    return colors[sev];
  };

  if (!alert) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Crear Incidente</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Alerta Info */}
          <View style={styles.alertInfo}>
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <View style={styles.alertMeta}>
              <Text style={styles.alertMetaText}>{alert.user_full_name}</Text>
              <Text style={styles.alertMetaText}>{alert.area_name}</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Descripción */}
            <View style={styles.field}>
              <Text style={styles.label}>Descripción *</Text>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe lo sucedido..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={255}
              />
              <Text style={styles.charCount}>{description.length}/255</Text>
            </View>

            {/* Severidad */}
            <View style={styles.field}>
              <Text style={styles.label}>Severidad *</Text>
              <View style={styles.severityOptions}>
                <TouchableOpacity
                  style={[
                    styles.severityButton,
                    { borderColor: '#3B82F6' },
                    severity === 'low' && { backgroundColor: '#3B82F6' },
                  ]}
                  onPress={() => setSeverity('low')}
                >
                  <View style={[
                    styles.severityDot,
                    { backgroundColor: severity === 'low' ? '#FFFFFF' : '#3B82F6' }
                  ]} />
                  <Text
                    style={[
                      styles.severityButtonText,
                      severity === 'low' && styles.severityButtonTextActive,
                    ]}
                  >
                    Baja
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.severityButton,
                    { borderColor: '#F59E0B' },
                    severity === 'medium' && { backgroundColor: '#F59E0B' },
                  ]}
                  onPress={() => setSeverity('medium')}
                >
                  <View style={[
                    styles.severityDot,
                    { backgroundColor: severity === 'medium' ? '#FFFFFF' : '#F59E0B' }
                  ]} />
                  <Text
                    style={[
                      styles.severityButtonText,
                      severity === 'medium' && styles.severityButtonTextActive,
                    ]}
                  >
                    Media
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.severityButton,
                    { borderColor: '#EF4444' },
                    severity === 'high' && { backgroundColor: '#EF4444' },
                  ]}
                  onPress={() => setSeverity('high')}
                >
                  <View style={[
                    styles.severityDot,
                    { backgroundColor: severity === 'high' ? '#FFFFFF' : '#EF4444' }
                  ]} />
                  <Text
                    style={[
                      styles.severityButtonText,
                      severity === 'high' && styles.severityButtonTextActive,
                    ]}
                  >
                    Alta
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.severityButton,
                    { borderColor: '#DC2626' },
                    severity === 'critical' && { backgroundColor: '#DC2626' },
                  ]}
                  onPress={() => setSeverity('critical')}
                >
                  <View style={[
                    styles.severityDot,
                    { backgroundColor: severity === 'critical' ? '#FFFFFF' : '#DC2626' }
                  ]} />
                  <Text
                    style={[
                      styles.severityButtonText,
                      severity === 'critical' && styles.severityButtonTextActive,
                    ]}
                  >
                    Crítica
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Crear Incidente</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
  },
  alertInfo: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  alertMessage: {
    fontSize: 14,
    color: '#78350F',
    fontWeight: '600',
    marginBottom: 6,
  },
  alertMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  alertMetaText: {
    fontSize: 12,
    color: '#92400E',
  },
  form: {
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    minHeight: 80,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  severityOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  severityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  severityButtonTextActive: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
