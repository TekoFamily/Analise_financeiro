import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { Box } from '@gluestack-ui/themed';
import { AppRoutes } from './app.routes';
import { AuthProvider, useAuth } from "../context/AuthContext";

export function Routes() {
  return <RoutesContent />;
}

function RoutesContent() {
  const { isAuthenticated } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}