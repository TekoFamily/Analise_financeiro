import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'

/* import HomeSvg from '@assets/home.svg' */

import MoneySvg from '@assets/bakingmoney.svg'


import ProfileSvg from '@assets/profile.svg'
/* import LaptopReportIcon from '@assets/laptop-report-icon.svg' */

import GoalsSvg from '@assets/goals-svgrepo-com.svg' // novo import

import AnalysisIcon from '@assets/dash.svg'


import { Home } from '@screens/Home'
import { History } from '@screens/gastos'
import { Profile } from '@screens/metas'
import { Perfil } from '@screens/perfil'
import { Platform } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'


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
          borderTopWidth: 5,
          height: Platform.OS === 'ios' ? 56 + bottom : 86,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <AnalysisIcon fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <MoneySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <GoalsSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
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
  )
}
