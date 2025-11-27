package com.aleleeex.mineguard.feature.dashboard.data.websocket

import io.ktor.client.*
import io.ktor.client.plugins.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.json.Json

/**
 * Cliente WebSocket para recibir actualizaciones en tiempo real del dashboard
 */
class DashboardWebSocketClient(
    private val httpClient: HttpClient,
    private val wsUrl: String
) {
    
    fun observeUpdates(): Flow<String> = flow {
        try {
            httpClient.webSocket(
                urlString = wsUrl
            ) {
                // Recibir mensajes del WebSocket
                for (frame in incoming) {
                    when (frame) {
                        is Frame.Text -> {
                            val message = frame.readText()
                            emit(message)
                        }
                        else -> {}
                    }
                }
            }
        } catch (e: Exception) {
            println("WebSocket error: ${e.message}")
        }
    }
    
    suspend fun disconnect() {
        httpClient.close()
    }
}
