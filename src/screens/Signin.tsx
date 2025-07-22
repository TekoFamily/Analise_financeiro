import { VStack, Image, Center, Text, Heading, ScrollView, Box, Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel, Link, LinkText, HStack } from "@gluestack-ui/themed";
import { KeyboardAvoidingView, Platform } from 'react-native';

/* o typescript nao tava entendendo o ".png" entao tive que criar um arquivo types para isso */

import logotkoImg from "@assets/logotko.png";

/* como a logo tava em svg tivemos que baixar umas dependecias o metro.config.js */

/* temos que criar um arquivo tipo para passar o novo tipo svg */

/* peguei essa documentação do site    https://github.com/kristerkari/react-native-svg-transformer */

/* agora conseguimos passar a logo */


import { useNavigation } from "@react-navigation/native";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";





/* tempos que importar os componentes  de input */



import { Input } from "@components/input";


/* importando o butao */

import { Button } from "@components/Button";

// Import useState
import { useState } from 'react';
import { useAuth } from "../context/AuthContext";

const SERVER_URL = "http://192.168.15.16:3000"; // Atualizado para o IP da máquina

export function Signin() {
    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const { signIn } = useAuth();

    // State for input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Optional: state for loading and error handling
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    function handleNewAccount() {
        navigation.navigate("SignUp");
    }

    // Form submission handler
    async function handleSignIn() {
        setIsLoading(true);
        setError(null);

        console.log("Tentando conectar ao servidor...");
        console.log("URL:", `${SERVER_URL}/signin`);

        if (!email || !password) {
            setError("Por favor, preencha todos os campos.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            console.log("Resposta do servidor:", data);

            if (!response.ok) {
                // Tratamento específico para diferentes tipos de erro
                if (response.status === 500) {
                    console.error("Erro interno do servidor:", data);
                    setError("Erro interno do servidor. Por favor, tente novamente mais tarde.");
                } else {
                    setError(data.message || data.error || "Falha no login. Verifique suas credenciais.");
                }
            } else {
                try {
                    await signIn(data.token, data.user);
                    console.log("Login realizado com sucesso!");
                    // A navegação será automática pelo AuthContext
                    // O componente Routes vai detectar isAuthenticated=true e mostrar AppRoutes
                } catch (signInError) {
                    console.error("Erro ao processar login:", signInError);
                    setError("Erro ao processar login.");
                }
            }
        } catch (err) {
            console.error("Erro ao conectar ao servidor:", err);
            setError("Erro de conexão com o servidor.");
        }

        setIsLoading(false);
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} bg="$white">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <VStack flex={1} px="$10" justifyContent="center">

                    <Center mb="$16">
                        {/* Replace placeholder Box with the Image component */}
                        <Image
                            source={logotkoImg}
                            alt="Logo"
                            w={120} 
                            h={120} 
                            mb="$10"
                        />
                    </Center>

                    {/* Display error message if any */}
                    {error && (
                        <Box mb="$4" p="$2" rounded="$sm" bg="$red100">
                            <Text color="$red700" textAlign="center">{error}</Text>
                        </Box>
                    )}

                    <VStack space="md">
                        <VStack space="xs">
                            <Text color="$textLight800" fontWeight="$bold">E-mail*</Text>
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
                            <Text color="$textLight800" fontWeight="$bold">Senha*</Text>
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

                        <Checkbox value="rememberMe" aria-label="Mantenha-me conectado" size="md" mt="$2">
                            <CheckboxIndicator mr="$2">
                                <CheckboxIcon />
                            </CheckboxIndicator>
                            <CheckboxLabel color="$textLight700">Mantenha-me conectado</CheckboxLabel>
                        </Checkbox>
                    </VStack>

                    <Button
                        title="Entrar"
                        mt="$10"
                        mb="$6"
                        bg="#FF9100" // Orange color from image
                        sx={{
                            ":pressed": {
                                bg: "$orange700"
                            }
                        }}
                        rounded="$lg" // Increased border radius
                        onPress={handleSignIn} // Call the submission handler
                        disabled={isLoading} // Disable button when loading
                    />

                    <Center>
                        <HStack>
                            <Text color="$textLight700" fontSize="$sm" fontFamily="$body">Ainda não possui uma conta? </Text>
                            <Link onPress={handleNewAccount}>
                                <LinkText color="#FF9100" fontSize="$sm" fontFamily="$body" fontWeight="$bold" textDecorationLine="underline">
                                    Conecte-se
                                </LinkText>
                            </Link>
                        </HStack>
                    </Center>

                </VStack>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}