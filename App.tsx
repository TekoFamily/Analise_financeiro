import { StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar'; // <-- adicione aqui

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

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular });


  return (
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
  )
}