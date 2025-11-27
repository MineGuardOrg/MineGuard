package com.aleleeex.mineguard.core.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

/**
 * Implementación de TokenStorage para Android usando DataStore
 */
class AndroidTokenStorage(private val context: Context) : TokenStorage {
    
    companion object {
        private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "mineguard_prefs")
        private val KEY_TOKEN = stringPreferencesKey("auth_token")
        private val KEY_ROLE = stringPreferencesKey("user_role")
    }
    
    override suspend fun saveToken(token: String) {
        context.dataStore.edit { preferences ->
            preferences[KEY_TOKEN] = token
        }
    }
    
    override suspend fun getToken(): String? {
        return context.dataStore.data.map { preferences ->
            preferences[KEY_TOKEN]
        }.first()
    }
    
    override suspend fun clearToken() {
        context.dataStore.edit { preferences ->
            preferences.remove(KEY_TOKEN)
            preferences.remove(KEY_ROLE)
        }
    }
    
    override suspend fun saveUserRole(role: String) {
        context.dataStore.edit { preferences ->
            preferences[KEY_ROLE] = role
        }
    }
    
    override suspend fun getUserRole(): String? {
        return context.dataStore.data.map { preferences ->
            preferences[KEY_ROLE]
        }.first()
    }
}
