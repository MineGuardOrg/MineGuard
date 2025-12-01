
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { StorageService } from './src/core/storage';

export default function App() {
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        try {
          await StorageService.clear();
        } catch (e) {
          // Silenciar errores de limpieza
        }
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
