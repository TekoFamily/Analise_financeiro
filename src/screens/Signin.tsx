import {
  VStack,
  Image,
  Center,
  Text,
  Heading,
  ScrollView,
  Box,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  Link,
  LinkText,
  HStack,
} from "@gluestack-ui/themed";
import { KeyboardAvoidingView, Platform } from "react-native";
import { theme } from "../config/theme";

/* o typescript nao tava entendendo o ".png" entao tive que criar um arquivo types para isso */

import logotkoImg from "@assets/logotko.png";

/* como a logo tava em svg tivemos que baixar umas dependecias o metro.config.js */

/* temos que criar um arquivo tipo para passar o novo tipo svg */

/* peguei essa documentação do site    https://github.com/kristerkari/react-native-svg-transformer */

/* agora conseguimos passar a logo */

import { useNavigation } from "@react-navigation/native";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

/* tempos que importar os componentes  de input */

import { Input } from "@components/base/Input";

/* importando o butao */

//import { Button } from "@components/base/Button";
import { Button } from "@gluestack-ui/themed";

// Import useState
import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "@gluestack-ui/themed";

const SERVER_URL = "http://100.66.7.63:3000"; // Atualizado para o IP da máquina

export function Signin() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { signIn } = useAuth();

  // State for input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Optional: state for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleNewAccount = useCallback(() => {
    navigation.navigate("SignUp");
  }, [navigation]);

  // Form submission handler
  const handleSignIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");

      setIsLoading(false);

      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("E-mail inválido.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/signin`, {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ email: email.trim(), password }),
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch (_) {
        // resposta não-JSON; segue com mensagens padrão por status
      }

      if (!response.ok) {
        const lower = (v?: string) => (v ? v.toLowerCase() : "");

        const fromBody = lower(data?.message) || lower(data?.error);

        let msg = "";

        if (response.status === 500) {
          // Alguns backends retornam 500 mesmo para credenciais inválidas
          msg = "Senha incorreta. Tente novamente.";
        } else if (
          response.status === 401 ||
          response.status === 403 ||
          fromBody.includes("senha")
        ) {
          msg = "Senha incorreta. Tente novamente.";
        } else if (
          response.status === 400 ||
          response.status === 404 ||
          fromBody.includes("email") ||
          fromBody.includes("e-mail") ||
          fromBody.includes("usuario") ||
          fromBody.includes("usuário")
        ) {
          msg = "E-mail não encontrado ou inválido.";
        } else if (response.status === 422) {
          msg =
            data?.message || "Dados inválidos. Verifique e tente novamente.";
        } else {
          msg =
            data?.message ||
            data?.error ||
            `Falha no login (código ${response.status}). Tente novamente.`;
        }

        setError(msg);

        return;
      }

      // Sucesso
      if (data?.token && data?.user) {
        await signIn(data.token, data.user);

        return;
      }

      // Caso venha 200 sem token/usuário, tentar inferir mensagem do corpo
      const lowerBody = (data?.message || data?.error || "").toLowerCase();
      if (lowerBody.includes("senha")) {
        setError("Senha incorreta. Tente novamente.");
      } else if (lowerBody.includes("email") || lowerBody.includes("e-mail")) {
        setError("E-mail não encontrado ou inválido.");
      } else if (lowerBody.includes("credenciais")) {
        setError("Credenciais inválidas. Verifique e tente novamente.");
      } else {
        setError("Não foi possível autenticar. Verifique suas credenciais.");
      }
    } catch (err) {
      console.error("Erro ao conectar ao servidor:", err);

      setError("Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, signIn]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bg="$white"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {isLoading ? (
          <Center flex={1} bg="white" h="$full">
            <Spinner size="large" color={theme.colors.primary} />
          </Center>
        ) : (
          <VStack flex={1} px="$10" justifyContent="center">
            <Center mb="$16">
              {/* Replace placeholder Box with the Image component */}
              <Image source={logotkoImg} alt="Logo" w={120} h={120} mb="$10" />
            </Center>

            {/* Display error message if any */}
            {error && (
              <Box mb="$4" p="$2" rounded="$sm" bg="$red100">
                <Text color="$red700" textAlign="center">
                  {error}
                </Text>
              </Box>
            )}

            <VStack space="md">
              <VStack space="xs">
                <Text color="$textLight800" fontWeight="$bold">
                  E-mail*
                </Text>
                <Input
                  placeholder="Seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="$coolGray400"
                  rounded="$lg" // Increased border radius
                  value={email} // Bind value
                  onChangeText={setEmail} // Update state
                />
              </VStack>

              <VStack space="xs">
                <Text color="$textLight800" fontWeight="$bold">
                  Senha*
                </Text>
                <Input
                  placeholder="Sua senha"
                  secureTextEntry
                  autoCapitalize="none"
                  placeholderTextColor="$coolGray400"
                  rounded="$lg" // Increased border radius
                  value={password} // Bind value
                  onChangeText={setPassword} // Update state
                />
              </VStack>

              <Checkbox
                value="rememberMe"
                aria-label="Mantenha-me conectado"
                size="md"
                mt="$2"
              >
                <CheckboxIndicator mr="$2">
                  <CheckboxIcon />
                </CheckboxIndicator>
                <CheckboxLabel color="$textLight700">
                  Mantenha-me conectado
                </CheckboxLabel>
              </Checkbox>
            </VStack>

            <Button
              mt="$10"
              mb="$6"
              bg={isPressed ? theme.colors.success : theme.colors.accent}
              rounded="$lg"
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text color="$white" fontWeight="bold">
                Entrar
              </Text>
            </Button>

            <Center>
              <HStack>
                <Text color="$textLight700" fontSize="$sm" fontFamily="$body">
                  Ainda não possui uma conta?{" "}
                </Text>
                <Link onPress={handleNewAccount}>
                  <LinkText
                    color={theme.colors.accent}
                    fontSize="$sm"
                    fontFamily="$body"
                    fontWeight="$bold"
                    textDecorationLine="underline"
                  >
                    Conecte-se
                  </LinkText>
                </Link>
              </HStack>
            </Center>
          </VStack>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
