package com.aleleeex.mineguard.feature.auth.data.repository

import com.aleleeex.mineguard.core.data.TokenStorage
import com.aleleeex.mineguard.core.network.ApiResponse
import com.aleleeex.mineguard.feature.auth.data.model.LoginRequest
import com.aleleeex.mineguard.feature.auth.data.model.LoginResponse
import com.aleleeex.mineguard.feature.auth.data.model.UserSchema
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*

class AuthRepository(
    private val httpClient: HttpClient,
    private val tokenStorage: TokenStorage
) {
    
    suspend fun login(employeeNumber: String, password: String): ApiResponse<LoginResponse> {
        return try {
            val response = httpClient.post("/auth/login") {
                contentType(ContentType.Application.Json)
                setBody(LoginRequest(employeeNumber, password))
            }
            
            if (response.status.isSuccess()) {
                val loginResponse = response.body<LoginResponse>()
                // Guardar token y rol
                tokenStorage.saveToken(loginResponse.accessToken)
                tokenStorage.saveUserRole(loginResponse.role)
                ApiResponse.Success(loginResponse)
            } else {
                ApiResponse.Error("Error al iniciar sesión", response.status.value)
            }
        } catch (e: Exception) {
            ApiResponse.Error(e.message ?: "Error desconocido")
        }
    }
    
    suspend fun getCurrentUser(): ApiResponse<UserSchema> {
        return try {
            val response = httpClient.get("/auth/me")
            
            if (response.status.isSuccess()) {
                val user = response.body<UserSchema>()
                ApiResponse.Success(user)
            } else {
                ApiResponse.Error("Error al obtener usuario", response.status.value)
            }
        } catch (e: Exception) {
            ApiResponse.Error(e.message ?: "Error desconocido")
        }
    }
    
    suspend fun logout() {
        tokenStorage.clearToken()
    }
    
    suspend fun isLoggedIn(): Boolean {
        return tokenStorage.getToken() != null
    }
    
    suspend fun getUserRole(): String? {
        return tokenStorage.getUserRole()
    }
}
