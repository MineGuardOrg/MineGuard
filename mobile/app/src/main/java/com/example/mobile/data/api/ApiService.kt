package com.example.mobile.data.api

import com.example.mobile.data.model.LoginRequest
import com.example.mobile.data.model.LoginResponse
import com.example.mobile.data.model.User
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    @GET("auth/me")
    suspend fun getCurrentUser(): Response<User>
}