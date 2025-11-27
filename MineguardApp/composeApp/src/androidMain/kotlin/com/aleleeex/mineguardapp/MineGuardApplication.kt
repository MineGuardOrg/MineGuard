package com.aleleeex.mineguardapp

import android.app.Application
import com.aleleeex.mineguard.core.di.coreModule
import com.aleleeex.mineguard.core.di.platformModule
import com.aleleeex.mineguard.feature.auth.di.authModule
import com.aleleeex.mineguard.feature.dashboard.di.dashboardModule
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin

class MineGuardApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        startKoin {
            androidLogger()
            androidContext(this@MineGuardApplication)
            modules(
                coreModule,
                platformModule(),
                authModule,
                dashboardModule
            )
        }
    }
}
