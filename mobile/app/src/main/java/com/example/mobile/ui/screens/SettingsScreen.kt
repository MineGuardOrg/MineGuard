package com.example.mobile.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

// Datos para configuraciones
data class SettingItem(
    val id: String,
    val title: String,
    val description: String,
    val icon: ImageVector,
    val type: SettingType,
    val value: Any? = null,
    val isEnabled: Boolean = true
)

sealed class SettingType {
    data object Switch : SettingType()
    data object Navigation : SettingType()
    data object Info : SettingType()
    data class Selector(val options: List<String>, val selectedIndex: Int = 0) : SettingType()
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen() {
    // Estados para las configuraciones
    var notificationsEnabled by remember { mutableStateOf(true) }
    var soundEnabled by remember { mutableStateOf(true) }
    var vibrationEnabled by remember { mutableStateOf(false) }
    var autoRefreshEnabled by remember { mutableStateOf(true) }
    var darkModeEnabled by remember { mutableStateOf(false) }
    var emergencyModeEnabled by remember { mutableStateOf(false) }
    var biometricsEnabled by remember { mutableStateOf(false) }
    
    // Configuraciones agrupadas
    val alertSettings = listOf(
        SettingItem(
            id = "notifications",
            title = "Notificaciones Push",
            description = "Recibir alertas en tiempo real",
            icon = Icons.Default.Notifications,
            type = SettingType.Switch,
            value = notificationsEnabled
        ),
        SettingItem(
            id = "sound",
            title = "Sonidos de Alerta",
            description = "Reproducir sonidos para alertas críticas",
            icon = Icons.Default.VolumeUp,
            type = SettingType.Switch,
            value = soundEnabled
        ),
        SettingItem(
            id = "vibration",
            title = "Vibración",
            description = "Usar vibración para alertas silenciosas",
            icon = Icons.Default.Vibration,
            type = SettingType.Switch,
            value = vibrationEnabled
        ),
        SettingItem(
            id = "emergency_mode",
            title = "Modo Emergencia",
            description = "Alertas de máxima prioridad únicamente",
            icon = Icons.Default.Emergency,
            type = SettingType.Switch,
            value = emergencyModeEnabled
        )
    )
    
    val appSettings = listOf(
        SettingItem(
            id = "auto_refresh",
            title = "Actualización Automática",
            description = "Sincronizar datos cada 30 segundos",
            icon = Icons.Default.Refresh,
            type = SettingType.Switch,
            value = autoRefreshEnabled
        ),
        SettingItem(
            id = "dark_mode",
            title = "Modo Oscuro",
            description = "Interfaz optimizada para entornos con poca luz",
            icon = Icons.Default.DarkMode,
            type = SettingType.Switch,
            value = darkModeEnabled
        ),
        SettingItem(
            id = "language",
            title = "Idioma",
            description = "Español (México)",
            icon = Icons.Default.Language,
            type = SettingType.Selector(listOf("Español (México)", "Español (España)", "English", "Português"), 0)
        ),
        SettingItem(
            id = "refresh_rate",
            title = "Frecuencia de Actualización",
            description = "Cada 30 segundos",
            icon = Icons.Default.Timer,
            type = SettingType.Selector(listOf("15 segundos", "30 segundos", "1 minuto", "2 minutos"), 1)
        )
    )
    
    val securitySettings = listOf(
        SettingItem(
            id = "biometrics",
            title = "Autenticación Biométrica",
            description = "Usar huella dactilar para acceder",
            icon = Icons.Default.Fingerprint,
            type = SettingType.Switch,
            value = biometricsEnabled
        ),
        SettingItem(
            id = "session_timeout",
            title = "Tiempo de Sesión",
            description = "Cerrar sesión automáticamente",
            icon = Icons.Default.Timer,
            type = SettingType.Selector(listOf("15 minutos", "30 minutos", "1 hora", "2 horas", "Sin límite"), 1)
        ),
        SettingItem(
            id = "change_password",
            title = "Cambiar Contraseña",
            description = "Actualizar credenciales de acceso",
            icon = Icons.Default.Lock,
            type = SettingType.Navigation
        ),
        SettingItem(
            id = "device_permissions",
            title = "Permisos del Dispositivo",
            description = "Gestionar accesos de la aplicación",
            icon = Icons.Default.Security,
            type = SettingType.Navigation
        )
    )
    
    val aboutSettings = listOf(
        SettingItem(
            id = "version",
            title = "Versión de la App",
            description = "MineGuard v2.1.4 (Build 2024.12)",
            icon = Icons.Default.Info,
            type = SettingType.Info
        ),
        SettingItem(
            id = "backend_status",
            title = "Estado del Servidor",
            description = "Conectado • FastAPI v0.104.1",
            icon = Icons.Default.Cloud,
            type = SettingType.Info
        ),
        SettingItem(
            id = "privacy_policy",
            title = "Política de Privacidad",
            description = "Ver términos y condiciones",
            icon = Icons.Default.PrivacyTip,
            type = SettingType.Navigation
        ),
        SettingItem(
            id = "support",
            title = "Soporte Técnico",
            description = "Contactar al equipo de TI",
            icon = Icons.Default.Support,
            type = SettingType.Navigation
        ),
        SettingItem(
            id = "feedback",
            title = "Enviar Feedback",
            description = "Compartir sugerencias de mejora",
            icon = Icons.Default.Feedback,
            type = SettingType.Navigation
        )
    )
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // Header
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onPrimaryContainer,
                            modifier = Modifier.size(32.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "Configuración",
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = "Personaliza tu experiencia MineGuard",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                            )
                        }
                    }
                }
            }
        }
        
        // Configuración de Alertas
        item {
            SettingsSection(
                title = "Alertas y Notificaciones",
                icon = Icons.Default.Warning,
                settings = alertSettings,
                onSwitchToggle = { settingId, value ->
                    when (settingId) {
                        "notifications" -> notificationsEnabled = value
                        "sound" -> soundEnabled = value
                        "vibration" -> vibrationEnabled = value
                        "emergency_mode" -> emergencyModeEnabled = value
                    }
                }
            )
        }
        
        // Configuración de Aplicación
        item {
            SettingsSection(
                title = "Aplicación",
                icon = Icons.Default.Apps,
                settings = appSettings,
                onSwitchToggle = { settingId, value ->
                    when (settingId) {
                        "auto_refresh" -> autoRefreshEnabled = value
                        "dark_mode" -> darkModeEnabled = value
                    }
                }
            )
        }
        
        // Configuración de Seguridad
        item {
            SettingsSection(
                title = "Seguridad y Privacidad",
                icon = Icons.Default.Security,
                settings = securitySettings,
                onSwitchToggle = { settingId, value ->
                    when (settingId) {
                        "biometrics" -> biometricsEnabled = value
                    }
                }
            )
        }
        
        // Información y Soporte
        item {
            SettingsSection(
                title = "Información y Soporte",
                icon = Icons.Default.Help,
                settings = aboutSettings,
                onSwitchToggle = { _, _ -> }
            )
        }
        
        // Botón de cierre de sesión
        item {
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = { /* TODO: Implementar cierre de sesión */ },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.error
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Logout,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Cerrar Sesión",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }
        
        // Footer con información adicional
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "MineGuard Mobile",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "Sistema de Supervisión Minera",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "© 2024 • Desarrollado para entornos industriales",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    )
                }
            }
        }
    }
}

@Composable
fun SettingsSection(
    title: String,
    icon: ImageVector,
    settings: List<SettingItem>,
    onSwitchToggle: (String, Boolean) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header de la sección
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 16.dp)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            
            // Items de configuración
            settings.forEachIndexed { index, setting ->
                SettingItemView(
                    setting = setting,
                    onSwitchToggle = { value -> onSwitchToggle(setting.id, value) }
                )
                
                if (index < settings.lastIndex) {
                    HorizontalDivider(
                        modifier = Modifier.padding(vertical = 8.dp),
                        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
                    )
                }
            }
        }
    }
}

@Composable
fun SettingItemView(
    setting: SettingItem,
    onSwitchToggle: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier.weight(1f),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = setting.icon,
                contentDescription = null,
                tint = if (setting.isEnabled) {
                    MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                } else {
                    MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
                },
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = setting.title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium,
                    color = if (setting.isEnabled) {
                        MaterialTheme.colorScheme.onSurface
                    } else {
                        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    }
                )
                Text(
                    text = setting.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = if (setting.isEnabled) {
                        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    } else {
                        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
                    }
                )
            }
        }
        
        Spacer(modifier = Modifier.width(16.dp))
        
        // Control según el tipo de configuración
        when (setting.type) {
            is SettingType.Switch -> {
                Switch(
                    checked = setting.value as? Boolean ?: false,
                    onCheckedChange = onSwitchToggle,
                    enabled = setting.isEnabled
                )
            }
            is SettingType.Navigation -> {
                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                    modifier = Modifier.size(20.dp)
                )
            }
            is SettingType.Info -> {
                // Solo mostrar la información, sin control
            }
            is SettingType.Selector -> {
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = setting.type.options[setting.type.selectedIndex],
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Icon(
                            imageVector = Icons.Default.ExpandMore,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}