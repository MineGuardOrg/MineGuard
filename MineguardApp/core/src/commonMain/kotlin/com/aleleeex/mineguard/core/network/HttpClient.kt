package com.aleleeex.mineguard.core.network

import io.ktor.client.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.auth.*
import io.ktor.client.plugins.auth.providers.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.plugins.websocket.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

object NetworkConfig {
    // TODO: Actualizar con tu URL de backend real
    const val BASE_URL = "https://your-backend-url.com"
    const val WS_URL = "wss://your-backend-url.com"
    
    const val TIMEOUT_MILLIS = 30_000L
}

fun createHttpClient(
    tokenProvider: () -> String?
): HttpClient {
    return HttpClient {
        // Configuración JSON
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
                prettyPrint = true
            })
        }
        
        // Logging para debug (prioridad iOS)
        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.INFO
        }
        
        // Timeout
        install(HttpTimeout) {
            requestTimeoutMillis = NetworkConfig.TIMEOUT_MILLIS
            connectTimeoutMillis = NetworkConfig.TIMEOUT_MILLIS
            socketTimeoutMillis = NetworkConfig.TIMEOUT_MILLIS
        }
        
        // Autenticación con Bearer Token
        install(Auth) {
            bearer {
                loadTokens {
                    tokenProvider()?.let { token ->
                        BearerTokens(accessToken = token, refreshToken = "")
                    }
                }
            }
        }
        
        // WebSockets para tiempo real
        install(WebSockets) {
            pingInterval = 20_000
        }
        
        // Default request configuration
        defaultRequest {
            url(NetworkConfig.BASE_URL)
        }
    }
}
