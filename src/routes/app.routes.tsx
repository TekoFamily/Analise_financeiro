import React, {  Suspense } from 'react';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Platform } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { gluestackUIConfig } from '../../config/gluestack-ui.config';

// 🧭 Ícones
import MoneySvg from '@assets/bakingmoney.svg';
import ProfileSvg from '@assets/profile.svg';
import GoalsSvg from '@assets/goals-svgrepo-com.svg';
import AnalysisIcon from '@assets/dash.svg';


import { Home } from '@screens/Home'
import { History } from '@screens/gastos'
// ✅ CORREÇÃO: Importar Metas ao invés de Profile
import { Metas } from '@screens/metas'
import { Perfil } from '@screens/perfil'


// ⏳ Tela de carregamento
function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <ActivityIndicator size="large" color="#FF9100" />
    </View>
  );
}

// 🧱 Tipagem das rotas
type AppRoutes = {
  home: undefined;
  exercise: undefined;
  profile: undefined;
  history: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

// 🧭 Navegador principal
export function AppRoutes() {
  const { tokens } = gluestackUIConfig;
  const iconSize = tokens.space['7'];
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: tokens.colors.white,
        paddingBottom: insets.bottom,
      }}
    >
      <Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: tokens.colors.green500,
          tabBarInactiveTintColor: tokens.colors.gray200,
          tabBarStyle: {
            backgroundColor: tokens.colors.white,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 59 + insets.bottom : 86,
            paddingBottom: insets.bottom,
            paddingTop: 25,
            paddingLeft: insets.left,
            paddingRight: insets.right,
              // ✅ POSICIONAMENTO absoluto para controle total
            position: 'absolute',
            bottom: -5,
            left: 0,
            right: 0,
            elevation: 8, // Sombra no Android
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
          },
        }}
      >
        {/* 🏠 Home */}
        <Screen
          name="home"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <AnalysisIcon fill={color} width={iconSize} height={iconSize} />
            ),
          }}
        />

        {/* 💰 Histórico */}
        <Screen
          name="history"
          component={History}
          options={{
            tabBarIcon: ({ color }) => (
              <MoneySvg fill={color} width={iconSize} height={iconSize} />
            ),
          }}
        />

        {/* 🎯 Metas */}
        <Screen
          name="profile"
          // ✅ CORREÇÃO: Usar Metas ao invés de Profile
          component={Metas}
          options={{
            tabBarIcon: ({ color }) => (
              <GoalsSvg fill={color} width={iconSize} height={iconSize} />
            ),
          }}
        />

        {/* 👤 Perfil */}
        <Screen
          name="exercise"
          component={Perfil}
          options={{
            tabBarIcon: ({ color }) => (
              <ProfileSvg fill={color} width={iconSize} height={iconSize} />
            ),
          }}
        />
      </Navigator>
    </SafeAreaView>
  );
}