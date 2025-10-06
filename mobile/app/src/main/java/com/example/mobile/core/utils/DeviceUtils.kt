package com.example.mobile.core.utils

import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp

/**
 * Utilidades para detectar el tipo de dispositivo y ajustar la UI
 */
object DeviceUtils {
    
    /**
     * Determina si el dispositivo actual es una tablet
     */
    @Composable
    fun isTablet(): Boolean {
        val configuration = LocalConfiguration.current
        val screenWidth = configuration.screenWidthDp.dp
        val screenHeight = configuration.screenHeightDp.dp
        val smallestWidth = minOf(screenWidth, screenHeight)
        
        // Considera tablet si el ancho más pequeño es >= 600dp
        return smallestWidth >= 600.dp
    }
    
    /**
     * Determina si es una tablet grande (10"+)
     */
    @Composable
    fun isLargeTablet(): Boolean {
        val configuration = LocalConfiguration.current
        val screenWidth = configuration.screenWidthDp.dp
        val screenHeight = configuration.screenHeightDp.dp
        val smallestWidth = minOf(screenWidth, screenHeight)
        
        // Considera tablet grande si el ancho más pequeño es >= 720dp
        return smallestWidth >= 720.dp
    }
    
    /**
     * Obtiene el número de columnas recomendado para grids según el dispositivo
     */
    @Composable
    fun getGridColumns(): Int {
        return when {
            isLargeTablet() -> 3 // Tablets grandes: 3 columnas
            isTablet() -> 2      // Tablets normales: 2 columnas  
            else -> 1            // Teléfonos: 1 columna
        }
    }
    
    /**
     * Determina si usar Navigation Rail (para tablets) o Bottom Navigation (para teléfonos)
     */
    @Composable
    fun useNavigationRail(): Boolean = isTablet()
    
    /**
     * Obtiene el padding horizontal recomendado según el dispositivo
     */
    @Composable
    fun getHorizontalPadding(): androidx.compose.ui.unit.Dp {
        return when {
            isLargeTablet() -> 48.dp
            isTablet() -> 32.dp
            else -> 16.dp
        }
    }
}