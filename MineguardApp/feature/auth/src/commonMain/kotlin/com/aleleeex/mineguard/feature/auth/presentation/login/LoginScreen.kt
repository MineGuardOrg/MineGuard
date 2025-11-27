package com.aleleeex.mineguard.feature.auth.presentation.login

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import org.koin.compose.koinInject

/**
 * LoginScreen optimizada para iPad
 * Diseño espacioso y cómodo para tablets
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    viewModel: LoginViewModel = koinInject()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    var employeeNumber by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    
    // Navegar cuando el login es exitoso
    LaunchedEffect(uiState.loginSuccess) {
        if (uiState.loginSuccess != null) {
            onLoginSuccess()
        }
    }
    
    // Mostrar error en Snackbar
    val snackbarHostState = remember { SnackbarHostState() }
    LaunchedEffect(uiState.error) {
        uiState.error?.let { error ->
            snackbarHostState.showSnackbar(
                message = error,
                duration = SnackbarDuration.Short
            )
            viewModel.clearError()
        }
    }
    
    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentAlignment = Alignment.Center
        ) {
            Card(
                modifier = Modifier
                    .widthIn(max = 600.dp) // Ancho máximo para iPad
                    .padding(32.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(
                    modifier = Modifier
                        .padding(48.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(24.dp)
                ) {
                    // Logo o título
                    Text(
                        text = "MineGuard",
                        style = MaterialTheme.typography.displayMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                    
                    Text(
                        text = "Iniciar Sesión",
                        style = MaterialTheme.typography.headlineMedium
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    // Campo de número de empleado
                    OutlinedTextField(
                        value = employeeNumber,
                        onValueChange = { employeeNumber = it },
                        label = { Text("Número de Empleado") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Text,
                            imeAction = ImeAction.Next
                        ),
                        enabled = !uiState.isLoading
                    )
                    
                    // Campo de contraseña
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Contraseña") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Password,
                            imeAction = ImeAction.Done
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = {
                                if (!uiState.isLoading) {
                                    viewModel.login(employeeNumber, password)
                                }
                            }
                        ),
                        enabled = !uiState.isLoading
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    // Botón de login
                    Button(
                        onClick = { viewModel.login(employeeNumber, password) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        enabled = !uiState.isLoading
                    ) {
                        if (uiState.isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp),
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                        } else {
                            Text(
                                text = "Ingresar",
                                style = MaterialTheme.typography.titleMedium
                            )
                        }
                    }
                }
            }
        }
    }
}
