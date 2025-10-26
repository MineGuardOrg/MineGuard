package com.example.mobile.data.model

import com.google.gson.annotations.SerializedName

// Request para login
data class LoginRequest(
    @SerializedName("employee_number")
    val employeeNumber: String,
    val password: String
)

// Response del login
data class LoginResponse(
    @SerializedName("access_token")
    val accessToken: String,
    @SerializedName("token_type")
    val tokenType: String = "bearer"
)

// Modelo de Usuario
data class User(
    val id: Int,
    @SerializedName("employee_number")
    val employeeNumber: String,
    @SerializedName("first_name")
    val firstName: String,
    @SerializedName("last_name")
    val lastName: String,
    val email: String,
    @SerializedName("role_id")
    val roleId: Int,
    @SerializedName("area_id")
    val areaId: Int? = null,
    @SerializedName("position_id")
    val positionId: Int? = null,
    @SerializedName("is_active")
    val isActive: Boolean,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("updated_at")
    val updatedAt: String? = null
)