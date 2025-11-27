package com.aleleeex.mineguardapp

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.aleleeex.mineguard.core.di.coreModule
import com.aleleeex.mineguard.core.di.platformModule
import com.aleleeex.mineguard.feature.auth.di.authModule
import com.aleleeex.mineguard.feature.auth.presentation.login.LoginScreen
import com.aleleeex.mineguard.feature.dashboard.di.dashboardModule
import com.aleleeex.mineguard.feature.dashboard.presentation.DashboardScreen
import org.koin.compose.KoinApplication

/**
 * Rutas de navegación
 */
object Routes {
    const val LOGIN = "login"
    const val DASHBOARD = "dashboard"
}

@Composable
fun App() {
    // Inicializar Koin con todos los módulos
    KoinApplication(
        application = {
            modules(
                coreModule,
                platformModule(),
                authModule,
                dashboardModule
            )
        }
    ) {
        MaterialTheme {
            MineGuardNavigation()
        }
    }
}

@Composable
fun MineGuardNavigation() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = Routes.LOGIN
    ) {
        // Pantalla de Login
        composable(Routes.LOGIN) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Routes.DASHBOARD) {
                        // Limpiar el back stack para que no pueda volver al login
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                }
            )
        }
        
        // Pantalla de Dashboard
        composable(Routes.DASHBOARD) {
            DashboardScreen(
                onLogout = {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(Routes.DASHBOARD) { inclusive = true }
                    }
                }
            )
        }
    }
}
