package com.aleleeex.mineguard.feature.dashboard.data.repository

import com.aleleeex.mineguard.core.network.ApiResponse
import com.aleleeex.mineguard.feature.dashboard.data.model.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*

class DashboardRepository(
    private val httpClient: HttpClient
) {
    
    suspend fun getActiveWorkers(): ApiResponse<List<ActiveWorker>> {
        return try {
            val response = httpClient.get("/dashboard/active-workers")
            
            if (response.status.isSuccess()) {
                val workers = response.body<List<ActiveWorker>>()
                ApiResponse.Success(workers)
            } else {
                ApiResponse.Error("Error al obtener trabajadores activos", response.status.value)
            }
        } catch (e: Exception) {
            ApiResponse.Error(e.message ?: "Error desconocido")
        }
    }
    
    suspend fun getAlertCountsLastMonth(): ApiResponse<AlertCountsLastMonth> {
        return try {
            val response = httpClient.get("/dashboard/alerts/last-month-by-type")
            
            if (response.status.isSuccess()) {
                val counts = response.body<AlertCountsLastMonth>()
                ApiResponse.Success(counts)
            } else {
                ApiResponse.Error("Error al obtener conteo de alertas", response.status.value)
            }
        } catch (e: Exception) {
            ApiResponse.Error(e.message ?: "Error desconocido")
        }
    }
    
    suspend fun getBiometricsByArea(days: Int = 30): ApiResponse<BiometricsByArea> {
        return try {
            val response = httpClient.get("/dashboard/biometrics/avg-by-area") {
                parameter("days", days)
            }
            
            if (response.status.isSuccess()) {
                val biometrics = response.body<BiometricsByArea>()
                ApiResponse.Success(biometrics)
            } else {
                ApiResponse.Error("Error al obtener biométricos", response.status.value)
            }
        } catch (e: Exception) {
            ApiResponse.Error(e.message ?: "Error desconocido")
        }
    }
    
    suspend fun getRecentAlerts(days: Int = 7, limit: Int = 20): ApiResponse<List<RecentAlert>> {
        return try {
            val response = httpClient.get("/dashboard/alerts/recent") {
                parameter("days", days)
                parameter("limit", limit)
            }
            
            if (response.status.isSuccess()) {
                val alerts = response.body<List<RecentAlert>>()
                ApiResponse.Success(alerts)
            } else {
                ApiResponse.Error("Error al obtener alertas recientes", response.status.value)
            }
        } catch (e: Exception) {
            ApiResponse.Error(e.message ?: "Error desconocido")
        }
    }
}
