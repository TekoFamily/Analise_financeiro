// src/routes/auth.routes.tsx
// 🧭 Rotas de autenticação (públicas)
// Pasta: src/routes → Responsável por configurar a navegação do app
// Este arquivo define as telas de login/cadastro e oculta o cabeçalho padrão do stack
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { Signin } from "@screens/Signin";

import { SignUp } from "@screens/SignUp";

type AuthRoutes = {
  Signin: undefined;
  SignUp: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Signin" component={Signin} />

      <Screen name="SignUp" component={SignUp} />
    </Navigator>
  );
}
