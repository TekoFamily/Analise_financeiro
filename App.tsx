/**
 * App.tsx
 * 🚀 Ponto de entrada do aplicativo.
 *
 * Responsabilidades:
 * - Carregar fontes e configurar StatusBar.
 * - Fornecer provedores globais: ErrorBoundary, SafeAreaProvider, GluestackUIProvider (tema),
 *   AuthProvider, DespesasProvider, MetasProvider.
 * - Renderizar a árvore de navegação (Routes) quando as fontes estiverem carregadas.
 *
 * Estrutura de inicialização:
 * 1. ErrorBoundary captura falhas em runtime e exibe fallback.
 * 2. SafeAreaProvider lida com áreas seguras (notch e barras do SO).
 * 3. GluestackUIProvider injeta o design system e tokens de UI.
 * 4. Providers de contexto expõem estados globais (auth, despesas, metas).
 * 5. Routes decide entre rotas autenticadas e públicas.
 *
 * Observações:
 * - Evite usar NavigationBar.setVisibilityAsync aqui (pode gerar problemas em alguns ambientes).
 * - Caso novas camadas globais sejam necessárias (ex.: i18n, analytics), adicione-as aqui.
 */

import { StatusBar } from "react-native";
import React, { useEffect } from "react"; // Adicione useEffect
import { theme } from "./src/config/theme";

import * as NavigationBar from "expo-navigation-bar"; // Comentado - pode causar problemas no Expo Go

import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
} from "@expo-google-fonts/roboto";

import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { Routes } from "./src/routes";
import { Loading } from "@components/feedback/Loading";
import { DespesasProvider } from "./src/context/ExpensesContext";
import { AuthProvider } from "./src/context/AuthContext";
import { MetasProvider } from "./src/context/MetasContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./src/components/ErrorBoundary";

export default function App() {
  // Remova qualquer NavigationBar.setVisibilityAsync ou overlay aqui!
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular });

  console.log("[App] Renderizado, fontsLoaded:", fontsLoaded);

  // 🌐 Providers globais + navegação
  // - ErrorBoundary: captura erros de runtime
  // - SafeAreaProvider: ajusta áreas seguras (notch/barras)
  // - GluestackUIProvider: injeta tema/design system
  // - Auth/Despesas/Metas Providers: estados globais
  // - Routes: decide entre rotas autenticadas e públicas
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GluestackUIProvider config={config}>
          <AuthProvider>
            <DespesasProvider>
              <MetasProvider>
                <StatusBar
                  barStyle="dark-content"
                  backgroundColor={theme.colors.surface}
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
