package com.example.mobile.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.mobile.ui.screens.DashboardScreen
import com.example.mobile.ui.screens.AlertsScreen
import com.example.mobile.ui.screens.MinersScreen
import com.example.mobile.ui.screens.SettingsScreen

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    data object Dashboard : Screen("dashboard", "Panel Principal", Icons.Default.Dashboard)
    data object Alerts : Screen("alerts", "Alertas", Icons.Default.Warning)
    data object Miners : Screen("miners", "Mineros", Icons.Default.Person)
    data object Settings : Screen("settings", "Configuración", Icons.Default.Settings)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MineGuardApp() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route
                
                val screens = listOf(
                    Screen.Dashboard,
                    Screen.Alerts,
                    Screen.Miners,
                    Screen.Settings
                )
                
                screens.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = null) },
                        label = { Text(screen.title) },
                        selected = currentRoute == screen.route,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.startDestinationId)
                                launchSingleTop = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Dashboard.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Dashboard.route) {
                DashboardScreen()
            }
            composable(Screen.Alerts.route) {
                AlertsScreen()
            }
            composable(Screen.Miners.route) {
                MinersScreen()
            }
            composable(Screen.Settings.route) {
                SettingsScreen()
            }
        }
    }
}