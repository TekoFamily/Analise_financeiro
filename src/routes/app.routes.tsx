import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
  RouteProp
} from '@react-navigation/bottom-tabs'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'

/* import HomeSvg from '@assets/home.svg' */

import MoneySvg from '@assets/bakingmoney.svg'


import ProfileSvg from '@assets/profile.svg'
/* import LaptopReportIcon from '@assets/laptop-report-icon.svg' */

import GoalsSvg from '@assets/goals-svgrepo-com.svg' // novo import

import AnalysisIcon from '@assets/dash.svg'






import { lazy, Suspense } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context' // ✅ Este deve ficar




const Home = lazy(() => import('../screens/Home').then(module => ({ default: module.Home })))
const History = lazy(() => import('../screens/gastos').then(module => ({ default: module.History })))
const Profile = lazy(() => import('../screens/metas').then(module => ({ default: module.Profile })))
const Perfil = lazy(() => import('../screens/perfil').then(module => ({ default: module.Perfil })))




// Componente de loading para Suspense
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <ActivityIndicator size="large" color="#FF9100" />
    </View>
  )
}




/* 

import { Home } from '@screens/Home'
import { History } from '@screens/gastos'
import { Profile } from '@screens/metas'
import { Perfil } from '@screens/perfil'
import { Platform } from 'react-native'
 */






type AppRoutes = {
  home: undefined
  exercise: undefined
  profile: undefined
  history: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {
  const { tokens } = gluestackUIConfig
  const iconSize = tokens.space['7']
  const insets = useSafeAreaInsets()
  const top = insets.top
  const bottom = insets.bottom
  const left = insets.left
  const right = insets.right

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.green500,
        tabBarInactiveTintColor: tokens.colors.gray200,
        tabBarStyle: {
          backgroundColor: tokens.colors.white,
          borderTopWidth: 2,
          height: Platform.OS === 'ios' ? 59 + bottom : 96,
          paddingBottom: bottom,
          paddingTop: 15, 
          paddingLeft: left,
          paddingRight: right,
        },
      }}
    >


<Screen
  name="home"
  component={() => (
    <Suspense fallback={<LoadingScreen />}>
      <Home />
    </Suspense>
  )}
  options={{
    tabBarIcon: ({ color }) => (
      <AnalysisIcon fill={color} width={iconSize} height={iconSize} />
    ),
  }}
/>

<Screen
  name="history"
  component={() => (
    <Suspense fallback={<LoadingScreen />}>
      <History />
    </Suspense>
  )}
  options={{
    tabBarIcon: ({ color }) => (
      <MoneySvg fill={color} width={iconSize} height={iconSize} />
    ),
  }}
/>

<Screen
  name="profile"
  component={() => (
    <Suspense fallback={<LoadingScreen />}>
      <Profile />
    </Suspense>
  )}
  options={{
    tabBarIcon: ({ color }) => (
      <GoalsSvg fill={color} width={iconSize} height={iconSize} />
    ),
  }}
/>

<Screen
  name="exercise"
  component={() => (
    <Suspense fallback={<LoadingScreen />}>
      <Perfil />
    </Suspense>
  )}
  options={{
    tabBarIcon: ({ color }) => (
      <ProfileSvg fill={color} width={iconSize} height={iconSize} />
    ),
  }}
/>
          
   
       
      
    </Navigator>
  )
}
