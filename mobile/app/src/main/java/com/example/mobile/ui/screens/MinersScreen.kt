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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

// Datos para mineros
data class Miner(
    val id: String,
    val name: String,
    val role: String,
    val zone: String,
    val status: MinerStatusType,
    val shift: String,
    val entryTime: String,
    val heartRate: Int,
    val batteryLevel: Int,
    val lastUpdate: String,
    val certifications: List<String> = emptyList()
)

enum class MinerStatusType(val displayName: String, val color: @Composable () -> Color) {
    ACTIVE("Activo", { MaterialTheme.colorScheme.tertiary }),
    BREAK("Descanso", { MaterialTheme.colorScheme.secondary }),
    OFFLINE("Sin conexión", { MaterialTheme.colorScheme.error }),
    EMERGENCY("Emergencia", { Color(0xFFFF5722) }),
    END_SHIFT("Fin turno", { MaterialTheme.colorScheme.outline })
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MinersScreen() {
    var selectedFilter by remember { mutableStateOf("Todos") }
    var searchQuery by remember { mutableStateOf("") }
    
    // Datos simulados
    val miners = remember {
        listOf(
            Miner(
                id = "M001",
                name = "Juan Carlos Pérez",
                role = "Operador de Maquinaria",
                zone = "Túnel A-1, Nivel 2",
                status = MinerStatusType.ACTIVE,
                shift = "Turno Mañana (06:00-14:00)",
                entryTime = "06:15",
                heartRate = 75,
                batteryLevel = 85,
                lastUpdate = "hace 2 min",
                certifications = listOf("Maquinaria Pesada", "Seguridad Básica")
            ),
            Miner(
                id = "M002",
                name = "María Elena García",
                role = "Supervisora de Túnel",
                zone = "Túnel B-2, Control",
                status = MinerStatusType.ACTIVE,
                shift = "Turno Mañana (06:00-14:00)",
                entryTime = "06:00",
                heartRate = 68,
                batteryLevel = 92,
                lastUpdate = "hace 1 min",
                certifications = listOf("Supervisión", "Primeros Auxilios", "Rescate")
            ),
            Miner(
                id = "M003",
                name = "Carlos Alberto López",
                role = "Técnico Especialista",
                zone = "Túnel A-3, Mantenimiento",
                status = MinerStatusType.BREAK,
                shift = "Turno Mañana (06:00-14:00)",
                entryTime = "06:30",
                heartRate = 65,
                batteryLevel = 78,
                lastUpdate = "hace 15 min",
                certifications = listOf("Técnico Eléctrico", "Ventilación")
            ),
            Miner(
                id = "M004",
                name = "Ana Victoria Martín",
                role = "Ingeniera de Seguridad",
                zone = "Zona C-1, Inspección",
                status = MinerStatusType.ACTIVE,
                shift = "Turno Mañana (06:00-14:00)",
                entryTime = "07:00",
                heartRate = 72,
                batteryLevel = 88,
                lastUpdate = "hace 3 min",
                certifications = listOf("Ingeniería", "Seguridad Industrial", "Análisis de Riesgo")
            ),
            Miner(
                id = "M005",
                name = "Roberto Silva Santos",
                role = "Operario de Extracción",
                zone = "Túnel B-1, Frente 3",
                status = MinerStatusType.EMERGENCY,
                shift = "Turno Mañana (06:00-14:00)",
                entryTime = "06:45",
                heartRate = 125,
                batteryLevel = 45,
                lastUpdate = "hace 30 min",
                certifications = listOf("Operaciones Básicas")
            ),
            Miner(
                id = "M006",
                name = "Elena Patricia Ruiz",
                role = "Geóloga de Campo",
                zone = "Túnel A-2, Survey",
                status = MinerStatusType.ACTIVE,
                shift = "Turno Mañana (06:00-14:00)",
                entryTime = "07:15",
                heartRate = 70,
                batteryLevel = 95,
                lastUpdate = "hace 5 min",
                certifications = listOf("Geología", "Topografía", "Análisis de Suelos")
            ),
            Miner(
                id = "M007",
                name = "Miguel Ángel Torres",
                role = "Operador de Transporte",
                zone = "Zona Principal, Carga",
                status = MinerStatusType.OFFLINE,
                shift = "Turno Mañana (06:00-14:00)",
                entryTime = "06:20",
                heartRate = 0,
                batteryLevel = 12,
                lastUpdate = "hace 45 min",
                certifications = listOf("Transporte", "Carga Pesada")
            )
        )
    }
    
    val filterOptions = listOf("Todos", "Activos", "En descanso", "Sin conexión", "Emergencia")
    
    val filteredMiners = miners.filter { miner ->
        val matchesFilter = when (selectedFilter) {
            "Activos" -> miner.status == MinerStatusType.ACTIVE
            "En descanso" -> miner.status == MinerStatusType.BREAK
            "Sin conexión" -> miner.status == MinerStatusType.OFFLINE
            "Emergencia" -> miner.status == MinerStatusType.EMERGENCY
            else -> true
        }
        
        val matchesSearch = if (searchQuery.isBlank()) {
            true
        } else {
            miner.name.contains(searchQuery, ignoreCase = true) ||
                    miner.id.contains(searchQuery, ignoreCase = true) ||
                    miner.zone.contains(searchQuery, ignoreCase = true)
        }
        
        matchesFilter && matchesSearch
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
                    containerColor = MaterialTheme.colorScheme.primaryContainer
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
                                text = "Control de Personal",
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = "${miners.count { it.status == MinerStatusType.ACTIVE }} de ${miners.size} mineros activos",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                            )
                        }
                        
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            // Emergency indicator
                            if (miners.any { it.status == MinerStatusType.EMERGENCY }) {
                                Surface(
                                    color = MaterialTheme.colorScheme.error,
                                    shape = RoundedCornerShape(20.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Emergency,
                                            contentDescription = null,
                                            tint = Color.White,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = "EMERGENCIA",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }
                            }
                            
                            // Active count
                            Surface(
                                color = MaterialTheme.colorScheme.tertiary,
                                shape = RoundedCornerShape(20.dp)
                            ) {
                                Text(
                                    text = "${miners.count { it.status == MinerStatusType.ACTIVE }}",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
        
        item {
            // Barra de búsqueda
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Buscar por nombre, ID o zona...") },
                leadingIcon = {
                    Icon(Icons.Default.Search, contentDescription = null)
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Default.Clear, contentDescription = null)
                        }
                    }
                },
                singleLine = true
            )
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
                                "Activos" -> Icon(Icons.Default.RadioButtonChecked, null, modifier = Modifier.size(18.dp))
                                "En descanso" -> Icon(Icons.Default.Pause, null, modifier = Modifier.size(18.dp))
                                "Sin conexión" -> Icon(Icons.Default.SignalWifiOff, null, modifier = Modifier.size(18.dp))
                                "Emergencia" -> Icon(Icons.Default.Emergency, null, modifier = Modifier.size(18.dp))
                                else -> Icon(Icons.Default.Group, null, modifier = Modifier.size(18.dp))
                            }
                        }
                    )
                }
            }
        }
        
        item {
            // Contador de resultados
            Text(
                text = "${filteredMiners.size} ${if (filteredMiners.size == 1) "minero" else "mineros"} ${if (selectedFilter == "Todos") "total" else selectedFilter.lowercase()}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
        }
        
        items(filteredMiners) { miner ->
            MinerDetailCard(miner)
        }
        
        if (filteredMiners.isEmpty()) {
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
                            imageVector = Icons.Default.PersonOff,
                            contentDescription = null,
                            modifier = Modifier.size(48.dp),
                            tint = MaterialTheme.colorScheme.outline
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No se encontraron mineros",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Intenta ajustar los filtros de búsqueda",
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
fun MinerDetailCard(miner: Miner) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = when (miner.status) {
                MinerStatusType.EMERGENCY -> MaterialTheme.colorScheme.error.copy(alpha = 0.1f)
                MinerStatusType.OFFLINE -> MaterialTheme.colorScheme.error.copy(alpha = 0.05f)
                else -> MaterialTheme.colorScheme.surface
            }
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header del minero
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = miner.status.color(),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.size(48.dp)
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier.fillMaxSize()
                        ) {
                            Text(
                                text = miner.name.split(" ").take(2).map { it.first() }.joinToString(""),
                                style = MaterialTheme.typography.titleMedium,
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                    
                    Spacer(modifier = Modifier.width(12.dp))
                    
                    Column {
                        Text(
                            text = miner.name,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${miner.id} • ${miner.role}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    }
                }
                
                Surface(
                    color = miner.status.color(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = miner.status.displayName,
                        style = MaterialTheme.typography.labelMedium,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Información de ubicación y turno
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
                )
            ) {
                Column(
                    modifier = Modifier.padding(12.dp)
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
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = miner.zone,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(6.dp))
                    
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Schedule,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.secondary
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "${miner.shift} • Entrada: ${miner.entryTime}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Métricas vitales y técnicas
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                // Ritmo cardíaco
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Favorite,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = if (miner.heartRate > 0) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.outline
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (miner.heartRate > 0) "${miner.heartRate} bpm" else "--",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (miner.heartRate > 0) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.outline
                        )
                    }
                    Text(
                        text = "Ritmo cardíaco",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
                
                // Batería
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = when {
                                miner.batteryLevel > 60 -> Icons.Default.BatteryFull
                                miner.batteryLevel > 30 -> Icons.Default.BatteryFull
                                miner.batteryLevel > 10 -> Icons.Default.BatteryAlert
                                else -> Icons.Default.BatteryAlert
                            },
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = when {
                                miner.batteryLevel > 30 -> MaterialTheme.colorScheme.tertiary
                                miner.batteryLevel > 10 -> MaterialTheme.colorScheme.secondary
                                else -> MaterialTheme.colorScheme.error
                            }
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "${miner.batteryLevel}%",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = when {
                                miner.batteryLevel > 30 -> MaterialTheme.colorScheme.tertiary
                                miner.batteryLevel > 10 -> MaterialTheme.colorScheme.secondary
                                else -> MaterialTheme.colorScheme.error
                            }
                        )
                    }
                    Text(
                        text = "Batería equipo",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
                
                // Última actualización
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Update,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = miner.lastUpdate,
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    Text(
                        text = "Última señal",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
            }
            
            // Certificaciones si existen
            if (miner.certifications.isNotEmpty()) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.VerifiedUser,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.tertiary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Certificaciones: ${miner.certifications.joinToString(", ")}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }
            }
            
            // Acciones para casos de emergencia
            if (miner.status == MinerStatusType.EMERGENCY) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = { /* TODO: Llamar emergencia */ },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.error
                        ),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.Call, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("CONTACTAR")
                    }
                    
                    OutlinedButton(
                        onClick = { /* TODO: Ver ubicación */ },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.MyLocation, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("UBICAR")
                    }
                }
            }
        }
    }
}