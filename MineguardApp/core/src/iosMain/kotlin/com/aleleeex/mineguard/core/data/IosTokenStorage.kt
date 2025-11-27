package com.aleleeex.mineguard.core.data

import platform.Foundation.NSUserDefaults

/**
 * Implementación de TokenStorage para iOS usando UserDefaults
 * Para producción, considerar usar Keychain para mayor seguridad
 */
class IosTokenStorage : TokenStorage {
    private val userDefaults = NSUserDefaults.standardUserDefaults
    
    companion object {
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_ROLE = "user_role"
    }
    
    override suspend fun saveToken(token: String) {
        userDefaults.setObject(token, forKey = KEY_TOKEN)
        userDefaults.synchronize()
    }
    
    override suspend fun getToken(): String? {
        return userDefaults.stringForKey(KEY_TOKEN)
    }
    
    override suspend fun clearToken() {
        userDefaults.removeObjectForKey(KEY_TOKEN)
        userDefaults.removeObjectForKey(KEY_ROLE)
        userDefaults.synchronize()
    }
    
    override suspend fun saveUserRole(role: String) {
        userDefaults.setObject(role, forKey = KEY_ROLE)
        userDefaults.synchronize()
    }
    
    override suspend fun getUserRole(): String? {
        return userDefaults.stringForKey(KEY_ROLE)
    }
}
