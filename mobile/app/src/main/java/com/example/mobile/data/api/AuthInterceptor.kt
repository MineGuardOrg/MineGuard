package com.example.mobile.data.api

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

class AuthInterceptor @Inject constructor(
    @ApplicationContext private val context: Context
) : Interceptor {
    
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        
        // Obtener el token guardado
        val sharedPrefs = context.getSharedPreferences("mineguard_prefs", Context.MODE_PRIVATE)
        val token = sharedPrefs.getString("access_token", null)
        
        // Si no hay token, proceder sin autenticación
        if (token.isNullOrBlank()) {
            return chain.proceed(originalRequest)
        }
        
        // Agregar el token a los headers
        val authenticatedRequest = originalRequest.newBuilder()
            .header("Authorization", "Bearer $token")
            .build()
        
        return chain.proceed(authenticatedRequest)
    }
}