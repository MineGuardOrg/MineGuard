package com.aleleeex.mineguard.feature.auth.presentation.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aleleeex.mineguard.core.network.ApiResponse
import com.aleleeex.mineguard.feature.auth.data.model.LoginResponse
import com.aleleeex.mineguard.feature.auth.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class LoginUiState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val loginSuccess: LoginResponse? = null
)

class LoginViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()
    
    fun login(employeeNumber: String, password: String) {
        if (employeeNumber.isBlank() || password.isBlank()) {
            _uiState.value = _uiState.value.copy(
                error = "Por favor, completa todos los campos"
            )
            return
        }
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            when (val result = authRepository.login(employeeNumber, password)) {
                is ApiResponse.Success -> {
                    _uiState.value = LoginUiState(
                        isLoading = false,
                        loginSuccess = result.data
                    )
                }
                is ApiResponse.Error -> {
                    _uiState.value = LoginUiState(
                        isLoading = false,
                        error = result.message
                    )
                }
                is ApiResponse.Loading -> {
                    _uiState.value = _uiState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
