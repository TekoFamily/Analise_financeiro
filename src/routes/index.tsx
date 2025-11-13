// src/routes/index.tsx
// 🧭 Configuração de navegação da aplicação
// Responsável por aplicar o tema global centralizado e alternar entre rotas autenticadas e públicas.
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthRoutes } from "./auth.routes";

import { Box } from "@gluestack-ui/themed";

import { AppRoutes } from "./app.routes";

import { useAuth } from "../context/AuthContext";
import { theme as appTheme } from "../config/theme";

export function Routes() {
  return <RoutesContent />;
}

function RoutesContent() {
  const { isAuthenticated } = useAuth();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: appTheme.colors.background,
      primary: appTheme.colors.primary,
      card: appTheme.colors.surface,
      text: appTheme.colors.text,
      border: appTheme.colors.border,
      notification: appTheme.colors.accent,
    },
  };

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
