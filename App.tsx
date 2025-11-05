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
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function App() {
  /*  useEffect(() => {
    NavigationBar.setVisibilityAsync('');
     NavigationBar.setBehaviorAsync('overlay');
  }, []); */
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular });

  console.log('[App] Renderizado, fontsLoaded:', fontsLoaded);

  return (
    <SafeAreaProvider>
    <GluestackUIProvider config={config}>
      <AuthProvider>
        <DespesasProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#000"
            translucent={false}
          />
          {fontsLoaded ? <Routes /> : <Loading />}
        </DespesasProvider>
      </AuthProvider>
    </GluestackUIProvider>
    </SafeAreaProvider>
  )
}