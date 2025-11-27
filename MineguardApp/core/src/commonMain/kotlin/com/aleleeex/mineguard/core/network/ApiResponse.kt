package com.aleleeex.mineguard.core.network

sealed class ApiResponse<out T> {
    data class Success<T>(val data: T) : ApiResponse<T>()
    data class Error(val message: String, val code: Int? = null) : ApiResponse<Nothing>()
    data object Loading : ApiResponse<Nothing>()
}

sealed class NetworkError : Exception() {
    data object NoInternet : NetworkError()
    data object Timeout : NetworkError()
    data object Unauthorized : NetworkError()
    data class ServerError(val code: Int, override val message: String) : NetworkError()
    data class Unknown(override val message: String) : NetworkError()
}
