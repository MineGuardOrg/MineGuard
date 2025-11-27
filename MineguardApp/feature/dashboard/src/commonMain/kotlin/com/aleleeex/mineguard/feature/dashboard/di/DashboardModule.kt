package com.aleleeex.mineguard.feature.dashboard.di

import com.aleleeex.mineguard.core.network.NetworkConfig
import com.aleleeex.mineguard.feature.dashboard.data.repository.DashboardRepository
import com.aleleeex.mineguard.feature.dashboard.data.websocket.DashboardWebSocketClient
import com.aleleeex.mineguard.feature.dashboard.presentation.DashboardViewModel
import org.koin.core.module.dsl.singleOf
import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.module

val dashboardModule = module {
    // Repository
    singleOf(::DashboardRepository)
    
    // WebSocket Client
    single { DashboardWebSocketClient(get(), NetworkConfig.WS_URL) }
    
    // ViewModels
    viewModelOf(::DashboardViewModel)
}
