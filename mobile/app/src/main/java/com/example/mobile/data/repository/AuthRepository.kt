package com.example.mobile.data.repository

import android.content.Context
import com.example.mobile.data.api.ApiService
import com.example.mobile.data.model.LoginRequest
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val apiService: ApiService,
    @ApplicationContext private val context: Context
) {
    
    private val sharedPrefs = context.getSharedPreferences("mineguard_prefs", Context.MODE_PRIVATE)
    
    suspend fun login(employeeNumber: String, password: String): Result<Boolean> {
        return try {
            val request = LoginRequest(employeeNumber, password)
            val response = apiService.login(request)
            
            if (response.isSuccessful && response.body() != null) {
                val loginResponse = response.body()!!
                
                // Guardar token
                sharedPrefs.edit()
                    .putString("access_token", loginResponse.accessToken)
                    .apply()
                
                // Obtener información del usuario
                getCurrentUserInfo()
                
                Result.success(true)
            } else {
                Result.failure(Exception("Login failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    private suspend fun getCurrentUserInfo() {
        try {
            val userResponse = apiService.getCurrentUser()
            if (userResponse.isSuccessful && userResponse.body() != null) {
                val user = userResponse.body()!!
                
                // Guardar información del usuario
                sharedPrefs.edit()
                    .putInt("user_id", user.id)
                    .putString("user_name", "${user.firstName} ${user.lastName}")
                    .putString("user_email", user.email)
                    .putString("employee_number", user.employeeNumber)
                    .apply()
            }
        } catch (e: Exception) {
            // Si falla obtener user info, no es crítico para el login
        }
    }
    
    fun isLoggedIn(): Boolean {
        return !sharedPrefs.getString("access_token", null).isNullOrBlank()
    }
    
    fun logout() {
        sharedPrefs.edit().clear().apply()
    }
    
    fun getUserName(): String? {
        return sharedPrefs.getString("user_name", null)
    }
}