package com.example.mobile.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Colores específicos para MineGuard - tema minero industrial
private val mineOrange = Color(0xFFFF8C00)
private val mineDeepOrange = Color(0xFFFF6B00)
private val mineGray = Color(0xFF424242)
private val mineDarkGray = Color(0xFF2E2E2E)
private val mineBlack = Color(0xFF1C1C1C)
private val safetyYellow = Color(0xFFFFC107)
private val alertRed = Color(0xFFE53E3E)
private val successGreen = Color(0xFF38A169)

private val DarkColorScheme = darkColorScheme(
    primary = mineOrange,
    secondary = safetyYellow,
    tertiary = successGreen,
    background = mineBlack,
    surface = mineDarkGray,
    onPrimary = Color.White,
    onSecondary = mineBlack,
    onTertiary = Color.White,
    onBackground = Color.White,
    onSurface = Color.White,
    error = alertRed
)

private val LightColorScheme = lightColorScheme(
    primary = mineDeepOrange,
    secondary = safetyYellow,
    tertiary = successGreen,
    background = Color(0xFFFFFBFE),
    surface = Color(0xFFF5F5F5),
    onPrimary = Color.White,
    onSecondary = mineBlack,
    onTertiary = Color.White,
    onBackground = mineBlack,
    onSurface = mineBlack,
    error = alertRed
)

@Composable
fun MineGuardTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}

@Composable
fun MobileTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) = MineGuardTheme(darkTheme, content)