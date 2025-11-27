package com.aleleeex.mineguard.feature.auth.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    @SerialName("employee_number")
    val employeeNumber: String,
    val password: String
)

@Serializable
data class LoginResponse(
    @SerialName("access_token")
    val accessToken: String,
    @SerialName("token_type")
    val tokenType: String,
    val role: String
)

@Serializable
data class UserSchema(
    val id: Int,
    @SerialName("employee_number")
    val employeeNumber: String,
    @SerialName("first_name")
    val firstName: String,
    @SerialName("last_name")
    val lastName: String,
    val email: String,
    @SerialName("role_id")
    val roleId: Int,
    @SerialName("area_id")
    val areaId: Int? = null,
    @SerialName("position_id")
    val positionId: Int? = null,
    @SerialName("supervisor_id")
    val supervisorId: Int? = null,
    @SerialName("is_active")
    val isActive: Boolean,
    @SerialName("created_at")
    val createdAt: String,
    @SerialName("updated_at")
    val updatedAt: String? = null
)

@Serializable
data class RegisterRequest(
    @SerialName("employee_number")
    val employeeNumber: String,
    @SerialName("first_name")
    val firstName: String,
    @SerialName("last_name")
    val lastName: String,
    val email: String,
    val password: String,
    @SerialName("role_id")
    val roleId: Int? = null
)
