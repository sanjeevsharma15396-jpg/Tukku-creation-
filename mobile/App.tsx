import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/screens/SplashScreen';

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

const AppShell: React.FC = () => {
  const { isHydrated, showSplash, theme } = useApp();

  useEffect(() => {
    if (isHydrated) {
      ExpoSplashScreen.hideAsync().catch(() => {});
    }
  }, [isHydrated]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style="light" backgroundColor={theme.background} />
      <View style={styles.container}>
        <RootNavigator />
        {showSplash ? <SplashScreen /> : null}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
