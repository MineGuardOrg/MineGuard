package com.aleleeex.mineguard.feature.auth.di

import com.aleleeex.mineguard.feature.auth.data.repository.AuthRepository
import com.aleleeex.mineguard.feature.auth.presentation.login.LoginViewModel
import org.koin.core.module.dsl.singleOf
import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.module

val authModule = module {
    // Repository
    singleOf(::AuthRepository)
    
    // ViewModels
    viewModelOf(::LoginViewModel)
}
