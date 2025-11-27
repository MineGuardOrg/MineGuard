import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
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
            baseName = "Core"
            isStatic = true
        }
    }
    
    sourceSets {
        commonMain.dependencies {
            // Ktor Client
            implementation("io.ktor:ktor-client-core:2.3.7")
            implementation("io.ktor:ktor-client-content-negotiation:2.3.7")
            implementation("io.ktor:ktor-client-logging:2.3.7")
            implementation("io.ktor:ktor-client-auth:2.3.7")
            implementation("io.ktor:ktor-client-websockets:2.3.7")
            implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.7")
            
            // Serialization
            implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")
            
            // Coroutines
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
            
            // DateTime
            implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.5.0")
            
            // Koin DI
            implementation("io.insert-koin:koin-core:3.5.3")
        }
        
        androidMain.dependencies {
            implementation("io.ktor:ktor-client-okhttp:2.3.7")
            implementation("androidx.datastore:datastore-preferences:1.0.0")
        }
        
        iosMain.dependencies {
            implementation("io.ktor:ktor-client-darwin:2.3.7")
        }
    }
}

android {
    namespace = "com.aleleeex.mineguard.core"
    compileSdk = libs.versions.android.compileSdk.get().toInt()
    
    defaultConfig {
        minSdk = libs.versions.android.minSdk.get().toInt()
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}
