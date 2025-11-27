package com.aleleeex.mineguard.feature.dashboard.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ActiveWorker(
    val id: Int,
    val nombre: String,
    val area: String? = null,
    val ritmoCardiaco: Float? = null,
    val temperaturaCorpral: Float? = null,
    val nivelBateria: Float? = null,
    val tiempoActivo: Int,
    val cascoId: Int
)

@Serializable
data class AlertCountsLastMonth(
    val labels: List<String>,
    val gasesToxicos: Int,
    val ritmoCardiacoAnormal: Int,
    val temperaturaCorporalAlta: Int,
    val caidasImpactos: Int
)

@Serializable
data class BiometricsByArea(
    val areas: List<String>,
    val ritmoCardiaco: List<Float>,
    val temperaturaCorporal: List<Float>
)

@Serializable
data class RecentAlert(
    val id: Int,
    val tipo: String,
    val trabajador: String,
    val area: String? = null,
    val severidad: String,
    val timestamp: String,
    val estado: String? = null,
    val valor: Float
)

@Serializable
data class DashboardData(
    val activeWorkers: List<ActiveWorker> = emptyList(),
    val alertCounts: AlertCountsLastMonth? = null,
    val biometrics: BiometricsByArea? = null,
    val recentAlerts: List<RecentAlert> = emptyList()
)
