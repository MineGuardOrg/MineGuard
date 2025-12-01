import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import profileService from "../services/profileService";
import { UserProfile } from "../types";
import { styles } from "./ProfileScreen.styles";

/**
 * Pantalla de perfil del usuario
 * Muestra información de solo lectura del usuario autenticado
 */
const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  /**
   * Carga el perfil del usuario
   */
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getCurrentUserProfile();
      setProfile(data);
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setError(err?.response?.data?.detail || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formatea una fecha ISO a formato legible
   */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  /**
   * Renderiza un campo de información
   */
  const renderField = (label: string, value: string | number | null | undefined) => {
    const displayValue = value ?? "No asignado";

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {value !== null && value !== undefined ? (
          <Text style={styles.fieldValue}>{value}</Text>
        ) : (
          <Text style={styles.notAssignedText}>{displayValue}</Text>
        )}
      </View>
    );
  };

  /**
   * Renderiza el estado de la cuenta
   */
  const renderAccountStatus = (isActive: boolean) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Estado de la Cuenta</Text>
        <View style={[styles.statusBadge, isActive ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
          <Text style={styles.statusText}>{isActive ? "✓ Activo" : "✗ Inactivo"}</Text>
        </View>
      </View>
    );
  };

  // Estado de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffa500" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  // Estado de error
  if (error || !profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "No se pudo cargar el perfil"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Vista del perfil
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      {/* Contenido centrado */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Información Personal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            {renderField("Nombre", `${profile.first_name} ${profile.last_name}`)}
            {renderField("Correo Electrónico", profile.email)}
            {renderField("Número de Empleado", profile.employee_number)}
          </View>

          {/* Información Laboral */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Laboral</Text>
            {renderField("Área", profile.area_id)}
            {renderField("Puesto", profile.position_id)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
