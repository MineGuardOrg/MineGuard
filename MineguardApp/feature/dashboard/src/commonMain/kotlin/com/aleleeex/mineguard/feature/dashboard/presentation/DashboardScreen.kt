package com.aleleeex.mineguard.feature.dashboard.presentation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.aleleeex.mineguard.feature.dashboard.data.model.ActiveWorker
import com.aleleeex.mineguard.feature.dashboard.data.model.RecentAlert
import org.koin.compose.koinInject

/**
 * DashboardScreen optimizado para iPad
 * Layout adaptativo con grid para aprovechar espacio horizontal
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    onLogout: () -> Unit,
    viewModel: DashboardViewModel = koinInject()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("MineGuard Dashboard") },
                actions = {
                    IconButton(onClick = { viewModel.refresh() }) {
                        Text("🔄")
                    }
                    IconButton(onClick = onLogout) {
                        Text("🚪")
                    }
                }
            )
        }
    ) { padding ->
        if (uiState.isLoading && uiState.activeWorkers.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(horizontal = 24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item { Spacer(modifier = Modifier.height(8.dp)) }
                
                // Sección de trabajadores activos
                item {
                    Text(
                        text = "Trabajadores Activos (${uiState.activeWorkers.size})",
                        style = MaterialTheme.typography.headlineSmall
                    )
                }
                
                item {
                    if (uiState.activeWorkers.isEmpty()) {
                        Card(
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "No hay trabajadores activos",
                                modifier = Modifier.padding(24.dp),
                                style = MaterialTheme.typography.bodyLarge
                            )
                        }
                    } else {
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(uiState.activeWorkers) { worker ->
                                WorkerCard(worker)
                            }
                        }
                    }
                }
                
                // Alertas recientes
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Alertas Recientes",
                        style = MaterialTheme.typography.headlineSmall
                    )
                }
                
                items(uiState.recentAlerts) { alert ->
                    AlertCard(alert)
                }
                
                item { Spacer(modifier = Modifier.height(16.dp)) }
            }
        }
        
        // Mostrar error si existe
        uiState.error?.let { error ->
            Snackbar(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(error)
            }
        }
    }
}

@Composable
fun WorkerCard(worker: ActiveWorker) {
    Card(
        modifier = Modifier
            .width(280.dp)
            .height(180.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = worker.nombre,
                style = MaterialTheme.typography.titleMedium
            )
            
            worker.area?.let {
                Text(
                    text = "Área: $it",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            HorizontalDivider()
            
            worker.ritmoCardiaco?.let {
                Text("❤️ ${it.toInt()} BPM")
            }
            
            worker.temperaturaCorpral?.let {
                Text("🌡️ ${
                    (it * 10).toInt() / 10.0
                }°C")
            }
            
            worker.nivelBateria?.let {
                Text("🔋 ${it.toInt()}%")
            }
        }
    }
}

@Composable
fun AlertCard(alert: RecentAlert) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = when (alert.severidad.lowercase()) {
                "alta", "high" -> MaterialTheme.colorScheme.errorContainer
                "media", "medium" -> MaterialTheme.colorScheme.secondaryContainer
                else -> MaterialTheme.colorScheme.surfaceVariant
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
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = alert.tipo,
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = alert.trabajador,
                    style = MaterialTheme.typography.bodyMedium
                )
                alert.area?.let {
                    Text(
                        text = "Área: $it",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
            
            Column(
                horizontalAlignment = Alignment.End
            ) {
                Text(
                    text = alert.severidad,
                    style = MaterialTheme.typography.labelLarge
                )
                Text(
                    text = "Valor: ${(alert.valor * 10).toInt() / 10.0}",
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}
