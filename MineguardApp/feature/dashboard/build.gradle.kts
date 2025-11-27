import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    kotlin("plugin.serialization") version "2.1.0"
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_11)
        }
    }
    
    listOf(
        iosArm64(),
        iosSimulatorArm64()
    ).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "FeatureDashboard"
            isStatic = true
        }
    }
    
    sourceSets {
        commonMain.dependencies {
            implementation(project(":core"))
            
            // Compose
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.ui)
            implementation(compose.components.resources)
            implementation(compose.components.uiToolingPreview)
            
            // Lifecycle
            implementation(libs.androidx.lifecycle.viewmodelCompose)
            implementation(libs.androidx.lifecycle.runtimeCompose)
            
            // Navigation
            implementation("org.jetbrains.androidx.navigation:navigation-compose:2.8.0-alpha10")
            
            // Ktor (necesario para DashboardRepository y WebSocket)
            implementation("io.ktor:ktor-client-core:2.3.7")
            implementation("io.ktor:ktor-client-websockets:2.3.7")
            implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.7")
            
            // Serialization
            implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")
            
            // DateTime
            implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.5.0")
            
            // Koin
            implementation("io.insert-koin:koin-core:3.5.3")
            implementation("io.insert-koin:koin-compose:1.1.2")
            implementation("io.insert-koin:koin-compose-viewmodel:4.0.0")
            
            // Charts - Vico for Compose Multiplatform
            implementation("com.patrykandpatrick.vico:compose-m3:2.0.0-alpha.28")
            implementation("com.patrykandpatrick.vico:core:2.0.0-alpha.28")
        }
    }
}

android {
    namespace = "com.aleleeex.mineguard.feature.dashboard"
    compileSdk = libs.versions.android.compileSdk.get().toInt()
    
    defaultConfig {
        minSdk = libs.versions.android.minSdk.get().toInt()
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}
