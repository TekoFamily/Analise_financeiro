import { StatusBar } from 'react-native';
import React, { useEffect } from 'react'; // Adicione useEffect


 import * as NavigationBar from 'expo-navigation-bar'; // Comentado - pode causar problemas no Expo Go

import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular
} from "@expo-google-fonts/roboto";

import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from "./config/gluestack-ui.config";
import { Routes } from "./src/routes";
import { Loading } from '@components/Loading';
import { DespesasProvider } from "./src/context/ExpensesContext";
import { AuthProvider } from "./src/context/AuthContext";
import { MetasProvider } from "./src/context/MetasContext";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';



export default function App() {
  // Remova qualquer NavigationBar.setVisibilityAsync ou overlay aqui!
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular });

  console.log('[App] Renderizado, fontsLoaded:', fontsLoaded);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GluestackUIProvider config={config}>
          <AuthProvider>
            <DespesasProvider>
              <MetasProvider>
                <StatusBar
                  barStyle="dark-content"
                  backgroundColor="#fff"
                  translucent={false}
                />
                {fontsLoaded ? <Routes /> : <Loading />}
              </MetasProvider>
            </DespesasProvider>
          </AuthProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}