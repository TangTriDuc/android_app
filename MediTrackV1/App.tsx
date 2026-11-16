import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageProvider } from './src/context/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
