package com.aleleeex.mineguard.core.di

import android.content.Context
import com.aleleeex.mineguard.core.data.AndroidTokenStorage
import com.aleleeex.mineguard.core.data.TokenStorage
import org.koin.dsl.module

actual fun platformModule() = module {
    single<TokenStorage> { AndroidTokenStorage(get<Context>()) }
}
