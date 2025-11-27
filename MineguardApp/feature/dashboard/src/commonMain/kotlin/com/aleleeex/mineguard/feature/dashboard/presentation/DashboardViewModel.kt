package com.aleleeex.mineguard.feature.dashboard.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aleleeex.mineguard.core.network.ApiResponse
import com.aleleeex.mineguard.feature.dashboard.data.model.*
import com.aleleeex.mineguard.feature.dashboard.data.repository.DashboardRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.datetime.Clock

data class DashboardUiState(
    val isLoading: Boolean = true,
    val error: String? = null,
    val activeWorkers: List<ActiveWorker> = emptyList(),
    val alertCounts: AlertCountsLastMonth? = null,
    val biometrics: BiometricsByArea? = null,
    val recentAlerts: List<RecentAlert> = emptyList(),
    val lastUpdateTime: Long = 0L
)

class DashboardViewModel(
    private val dashboardRepository: DashboardRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()
    
    init {
        loadDashboardData()
    }
    
    fun loadDashboardData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            // Cargar todos los datos en paralelo
            launch { loadActiveWorkers() }
            launch { loadAlertCounts() }
            launch { loadBiometrics() }
            launch { loadRecentAlerts() }
        }
    }
    
    private suspend fun loadActiveWorkers() {
        when (val result = dashboardRepository.getActiveWorkers()) {
            is ApiResponse.Success -> {
                _uiState.value = _uiState.value.copy(
                    activeWorkers = result.data,
                    isLoading = false,
                    lastUpdateTime = Clock.System.now().toEpochMilliseconds()
                )
            }
            is ApiResponse.Error -> {
                _uiState.value = _uiState.value.copy(
                    error = result.message,
                    isLoading = false
                )
            }
            else -> {}
        }
    }
    
    private suspend fun loadAlertCounts() {
        when (val result = dashboardRepository.getAlertCountsLastMonth()) {
            is ApiResponse.Success -> {
                _uiState.value = _uiState.value.copy(alertCounts = result.data)
            }
            else -> {}
        }
    }
    
    private suspend fun loadBiometrics() {
        when (val result = dashboardRepository.getBiometricsByArea()) {
            is ApiResponse.Success -> {
                _uiState.value = _uiState.value.copy(biometrics = result.data)
            }
            else -> {}
        }
    }
    
    private suspend fun loadRecentAlerts() {
        when (val result = dashboardRepository.getRecentAlerts()) {
            is ApiResponse.Success -> {
                _uiState.value = _uiState.value.copy(recentAlerts = result.data)
            }
            else -> {}
        }
    }
    
    fun refresh() {
        loadDashboardData()
    }
}
