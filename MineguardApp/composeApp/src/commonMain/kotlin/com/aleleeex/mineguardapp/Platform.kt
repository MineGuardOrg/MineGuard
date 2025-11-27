package com.aleleeex.mineguardapp

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform