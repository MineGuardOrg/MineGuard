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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

// Datos para alertas
data class Alert(
    val id: String,
    val type: AlertType,
    val severity: AlertSeverity,
    val title: String,
    val description: String,
    val zone: String,
    val timestamp: String,
    val minerId: String? = null,
    val isResolved: Boolean = false
)

enum class AlertType(val icon: ImageVector, val displayName: String) {
    GAS(Icons.Default.Warning, "Gas Peligroso"),
    LOCATION(Icons.Default.LocationOn, "Ubicación"),
    EQUIPMENT(Icons.Default.Build, "Equipo"),
    EMERGENCY(Icons.Default.Emergency, "Emergencia"),
    HEALTH(Icons.Default.Favorite, "Salud"),
    COMMUNICATION(Icons.Default.SignalWifiOff, "Comunicación")
}

enum class AlertSeverity(val displayName: String, val color: @Composable () -> Color) {
    CRITICAL("Crítica", { MaterialTheme.colorScheme.error }),
    HIGH("Alta", { Color(0xFFFF5722) }),
    MEDIUM("Media", { MaterialTheme.colorScheme.secondary }),
    LOW("Baja", { MaterialTheme.colorScheme.primary }),
    INFO("Información", { MaterialTheme.colorScheme.outline })
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlertsScreen() {
    var selectedFilter by remember { mutableStateOf("Todas") }
    
    // Datos simulados
    val alerts = remember {
        listOf(
            Alert(
                id = "A001",
                type = AlertType.GAS,
                severity = AlertSeverity.CRITICAL,
                title = "Nivel de Metano Crítico",
                description = "Concentración de metano superó límite seguro (5000 ppm)",
                zone = "Túnel B-2, Sector 4",
                timestamp = "11:45 - Hace 15 min",
                minerId = "M002"
            ),
            Alert(
                id = "A002",
                type = AlertType.EMERGENCY,
                severity = AlertSeverity.CRITICAL,
                title = "Botón de Pánico Activado",
                description = "Trabajador solicita ayuda inmediata",
                zone = "Túnel A-1, Sector 2",
                timestamp = "11:30 - Hace 30 min",
                minerId = "M005"
            ),
            Alert(
                id = "A003",
                type = AlertType.HEALTH,
                severity = AlertSeverity.HIGH,
                title = "Ritmo Cardíaco Irregular",
                description = "Frecuencia cardíaca fuera de rango normal (135 bpm)",
                zone = "Zona C-1",
                timestamp = "11:20 - Hace 40 min",
                minerId = "M003"
            ),
            Alert(
                id = "A004",
                type = AlertType.LOCATION,
                severity = AlertSeverity.MEDIUM,
                title = "Trabajador Fuera de Zona",
                description = "Minero detectado en área no autorizada",
                zone = "Perímetro Norte",
                timestamp = "11:10 - Hace 50 min",
                minerId = "M007"
            ),
            Alert(
                id = "A005",
                type = AlertType.EQUIPMENT,
                severity = AlertSeverity.MEDIUM,
                title = "Falla en Detector de Gas",
                description = "Sensor de CO no responde a calibración",
                zone = "Túnel B-1",
                timestamp = "10:55 - Hace 1h 5min",
            ),
            Alert(
                id = "A006",
                type = AlertType.COMMUNICATION,
                severity = AlertSeverity.LOW,
                title = "Pérdida Temporal de Señal",
                description = "Dispositivo sin comunicación por 3 minutos",
                zone = "Túnel A-3",
                timestamp = "10:45 - Hace 1h 15min",
                minerId = "M012",
                isResolved = true
            )
        )
    }
    
    val filterOptions = listOf("Todas", "Críticas", "Activas", "Resueltas")
    
    val filteredAlerts = alerts.filter { alert ->
        when (selectedFilter) {
            "Críticas" -> alert.severity == AlertSeverity.CRITICAL
            "Activas" -> !alert.isResolved
            "Resueltas" -> alert.isResolved
            else -> true
        }
    }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // Header con estadísticas
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Centro de Alertas",
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onErrorContainer
                            )
                            Text(
                                text = "Monitoreo en tiempo real",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.8f)
                            )
                        }
                        
                        Surface(
                            color = MaterialTheme.colorScheme.error,
                            shape = RoundedCornerShape(20.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Warning,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "${alerts.count { it.severity == AlertSeverity.CRITICAL }} Críticas",
                                    style = MaterialTheme.typography.labelLarge,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }
        
        item {
            // Filtros
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                filterOptions.forEach { filter ->
                    FilterChip(
                        onClick = { selectedFilter = filter },
                        label = { Text(filter) },
                        selected = selectedFilter == filter,
                        leadingIcon = {
                            when (filter) {
                                "Críticas" -> Icon(Icons.Default.PriorityHigh, null, modifier = Modifier.size(18.dp))
                                "Activas" -> Icon(Icons.Default.Circle, null, modifier = Modifier.size(18.dp))
                                "Resueltas" -> Icon(Icons.Default.CheckCircle, null, modifier = Modifier.size(18.dp))
                                else -> Icon(Icons.Default.List, null, modifier = Modifier.size(18.dp))
                            }
                        }
                    )
                }
            }
        }
        
        item {
            // Contador de resultados
            Text(
                text = "${filteredAlerts.size} alertas ${selectedFilter.lowercase()}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
        }
        
        items(filteredAlerts) { alert ->
            DetailedAlertCard(alert)
        }
        
        if (filteredAlerts.isEmpty()) {
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 32.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            modifier = Modifier.size(48.dp),
                            tint = MaterialTheme.colorScheme.tertiary
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No hay alertas",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Todo funciona correctamente",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun DetailedAlertCard(alert: Alert) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (alert.isResolved) {
                MaterialTheme.colorScheme.surface
            } else {
                alert.severity.color().copy(alpha = 0.1f)
            }
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header de la alerta
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = alert.type.icon,
                        contentDescription = null,
                        tint = if (alert.isResolved) {
                            MaterialTheme.colorScheme.outline
                        } else {
                            alert.severity.color()
                        },
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = alert.title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (alert.isResolved) {
                                MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                            } else {
                                MaterialTheme.colorScheme.onSurface
                            }
                        )
                        Text(
                            text = alert.type.displayName,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    }
                }
                
                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Surface(
                        color = if (alert.isResolved) {
                            MaterialTheme.colorScheme.tertiary
                        } else {
                            alert.severity.color()
                        },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = if (alert.isResolved) "Resuelta" else alert.severity.displayName,
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.White,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Descripción
            Text(
                text = alert.description,
                style = MaterialTheme.typography.bodyMedium,
                color = if (alert.isResolved) {
                    MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                } else {
                    MaterialTheme.colorScheme.onSurface
                }
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Información adicional
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = alert.zone,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                
                if (alert.minerId != null) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.secondary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = alert.minerId,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.secondary
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Timestamp
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = alert.timestamp,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                
                if (!alert.isResolved && alert.severity == AlertSeverity.CRITICAL) {
                    TextButton(
                        onClick = { /* TODO: Implementar acciones de respuesta */ }
                    ) {
                        Text("RESPONDER")
                    }
                }
            }
        }
    }
}