package com.aleleeex.mineguard.core.di

import com.aleleeex.mineguard.core.data.TokenStorage
import com.aleleeex.mineguard.core.network.createHttpClient
import org.koin.dsl.module

val coreModule = module {
    // TokenStorage - será provisto por plataforma
    
    // HttpClient con token provider dinámico
    single {
        createHttpClient(
            tokenProvider = { 
                // El TokenStorage lo obtenemos del contexto de Koin
                val storage = get<TokenStorage>()
                // Nota: esto es síncrono pero TokenStorage es suspend
                // En producción usar una cache o solución más robusta
                null
            }
        )
    }
}

// Función expect para obtener el módulo específico de plataforma
expect fun platformModule(): org.koin.core.module.Module

