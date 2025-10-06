package com.example.mobile.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Datos simulados para el dashboard
data class MinerStatusData(
    val id: String,
    val name: String,
    val zone: String,
    val status: String,
    val lastUpdate: String,
    val heartRate: Int,
    val batteryLevel: Int
)

data class AlertInfo(
    val id: String,
    val type: String,
    val severity: String,
    val message: String,
    val zone: String,
    val timestamp: String
)

data class MetricCard(
    val title: String,
    val value: String,
    val subtitle: String,
    val icon: ImageVector,
    val color: @Composable () -> Color
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen() {
    val configuration = LocalConfiguration.current
    val isTablet = configuration.screenWidthDp >= 600
    
    // Datos simulados
    val activeMiners = remember {
        listOf(
            MinerStatusData("M001", "Juan Pérez", "Túnel A-1", "Activo", "hace 2 min", 75, 85),
            MinerStatusData("M002", "María García", "Túnel B-2", "Activo", "hace 1 min", 82, 92),
            MinerStatusData("M003", "Carlos López", "Túnel A-3", "Descanso", "hace 15 min", 65, 78),
            MinerStatusData("M004", "Ana Martín", "Zona C-1", "Activo", "hace 3 min", 78, 88)
        )
    }
    
    val recentAlerts = remember {
        listOf(
            AlertInfo("A001", "Gas", "Alta", "Nivel de metano elevado", "Túnel B-2", "10:45"),
            AlertInfo("A002", "Ubicación", "Media", "Trabajador fuera de zona", "Zona C-1", "10:30"),
            AlertInfo("A003", "Equipo", "Baja", "Batería baja detectada", "Túnel A-1", "10:15")
        )
    }
    
    val metrics = remember {
        listOf(
            MetricCard("Mineros Activos", "47", "de 52 total", Icons.Default.Person) { MaterialTheme.colorScheme.primary },
            MetricCard("Alertas Críticas", "2", "últimas 24h", Icons.Default.Warning) { MaterialTheme.colorScheme.error },
            MetricCard("Zonas Seguras", "8", "de 10 total", Icons.Default.CheckCircle) { MaterialTheme.colorScheme.tertiary },
            MetricCard("Equipos Online", "98%", "sistemas activos", Icons.Default.Settings) { MaterialTheme.colorScheme.secondary }
        )
    }
    
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
                    Text(
                        text = "MineGuard Dashboard",
                        style = MaterialTheme.typography.headlineMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Supervisión de Mina en Tiempo Real",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                    )
                }
            }
        }
        
        item {
            // Métricas generales
            Text(
                text = "Estado General",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
            
            LazyVerticalGrid(
                columns = GridCells.Fixed(if (isTablet) 4 else 2),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.height(if (isTablet) 120.dp else 240.dp)
            ) {
                items(metrics) { metric ->
                    MetricCardView(metric)
                }
            }
        }
        
        item {
            // Mineros activos
            Text(
                text = "Mineros Activos",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
            
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(activeMiners) { miner ->
                    MinerCard(miner)
                }
            }
        }
        
        item {
            // Alertas recientes
            Text(
                text = "Alertas Recientes",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
        
        items(recentAlerts.take(3)) { alert ->
            AlertCard(alert)
        }
    }
}

@Composable
fun MetricCardView(metric: MetricCard) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp),
        colors = CardDefaults.cardColors(
            containerColor = metric.color().copy(alpha = 0.1f)
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = metric.icon,
                contentDescription = null,
                tint = metric.color(),
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = metric.value,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = metric.color()
            )
            Text(
                text = metric.subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
        }
    }
}

@Composable
fun MinerCard(miner: MinerStatusData) {
    Card(
        modifier = Modifier.width(200.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = miner.name,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                )
                
                Surface(
                    color = when (miner.status) {
                        "Activo" -> MaterialTheme.colorScheme.tertiary
                        "Descanso" -> MaterialTheme.colorScheme.secondary
                        else -> MaterialTheme.colorScheme.error
                    },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = miner.status,
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "Zona: ${miner.zone}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "♥ ${miner.heartRate} bpm",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error
                )
                Text(
                    text = "🔋 ${miner.batteryLevel}%",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.tertiary
                )
            }
            
            Text(
                text = "Actualizado ${miner.lastUpdate}",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}

@Composable
fun AlertCard(alert: AlertInfo) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        colors = CardDefaults.cardColors(
            containerColor = when (alert.severity) {
                "Alta" -> MaterialTheme.colorScheme.error.copy(alpha = 0.1f)
                "Media" -> MaterialTheme.colorScheme.secondary.copy(alpha = 0.1f)
                else -> MaterialTheme.colorScheme.surface
            }
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = when (alert.type) {
                            "Gas" -> Icons.Default.Warning
                            "Ubicación" -> Icons.Default.LocationOn
                            "Equipo" -> Icons.Default.Build
                            else -> Icons.Default.Info
                        },
                        contentDescription = null,
                        tint = when (alert.severity) {
                            "Alta" -> MaterialTheme.colorScheme.error
                            "Media" -> MaterialTheme.colorScheme.secondary
                            else -> MaterialTheme.colorScheme.primary
                        },
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = alert.message,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                }
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = "${alert.zone} • ${alert.timestamp}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }
            
            Surface(
                color = when (alert.severity) {
                    "Alta" -> MaterialTheme.colorScheme.error
                    "Media" -> MaterialTheme.colorScheme.secondary
                    else -> MaterialTheme.colorScheme.primary
                },
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = alert.severity,
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }
    }
}