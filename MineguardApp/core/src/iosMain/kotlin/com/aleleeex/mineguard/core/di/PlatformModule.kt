package com.aleleeex.mineguard.core.di

import com.aleleeex.mineguard.core.data.IosTokenStorage
import com.aleleeex.mineguard.core.data.TokenStorage
import org.koin.dsl.module

actual fun platformModule() = module {
    single<TokenStorage> { IosTokenStorage() }
}
