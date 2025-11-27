package com.aleleeex.mineguard.core.data

/**
 * Interface para almacenamiento seguro de tokens
 * Implementación específica por plataforma
 */
interface TokenStorage {
    suspend fun saveToken(token: String)
    suspend fun getToken(): String?
    suspend fun clearToken()
    suspend fun saveUserRole(role: String)
    suspend fun getUserRole(): String?
}
