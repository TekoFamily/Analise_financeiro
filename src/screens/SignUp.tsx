import { VStack, Center, Text, Heading, ScrollView, Link, LinkText, HStack, Box } from "@gluestack-ui/themed";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Button } from "@components/Button";
import { useState } from 'react';

/* o typescript nao tava entendendo o ".png" entao tive que criar um arquivo types para isso */

/* como a logo tava em svg tivemos que baixar umas dependecias o metro.config.js */

/* temos que criar um arquivo tipo para passar o novo tipo svg */

/* peguei essa documentação do site    https://github.com/kristerkari/react-native-svg-transformer */

/* agora conseguimos passar a logo */

import Logo from "@assets/logotko.png";

/* tempos que importar os componentes  de input */

import { Input } from "@components/input";

export function SignUp() {
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    // State for input fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Optional: state for loading and error handling
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleGoBackToLogin() {
        navigation.navigate("Signin");
    }

    // Form submission handler
    async function handleSignUp() {
        setIsLoading(true);
        setError(null);

        if (!name || !email || !password || !confirmPassword) {
            setError("Por favor, preencha todos os campos.");
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://100.66.7.63:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Falha no cadastro.");
            } else {
                // Cadastro realizado com sucesso
                // Você pode redirecionar para o login:
                navigation.navigate("Signin");
            }
        } catch (err) {
            setError("Erro de conexão com o servidor.");
        }
        setIsLoading(false);
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1, backgroundColor: 'white' }}
        >
            <ScrollView 
                contentContainerStyle={{ 
                    flexGrow: 1, 
                    justifyContent: 'center'
                }} 
                showsVerticalScrollIndicator={false}
            >
                <VStack px="$10" pb="$10" w="$full">

                    <Center my="$12"> 
                        <Heading color="$textDark800" fontSize="$2xl" mb="$2">
                            Crie a sua conta!
                        </Heading>
                        <Text color="$textLight700" fontSize="$md">
                            vamos criar sua conta juntos
                        </Text>
                    </Center>

                    {/* Display error message if any */}
                    {error && (
                        <Box mb="$4" p="$2" rounded="$sm" bg="$red100">
                            <Text color="$red700" textAlign="center">{error}</Text>
                        </Box>
                    )}

                    <VStack space="md">
                        <VStack space="xs">
                            <Text color="$textLight800" fontWeight="$bold">Nome*</Text>
                            <Input
                                placeholder="Seu nome completo"
                                autoCapitalize="words"
                                placeholderTextColor="$coolGray400"
                                rounded="$lg"
                                value={name}
                                onChangeText={setName}
                            />
                        </VStack>

                        <VStack space="xs">
                            <Text color="$textLight800" fontWeight="$bold">E-mail*</Text>
                            <Input
                                placeholder="Seu e-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="$coolGray400"
                                rounded="$lg"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </VStack>

                        <VStack space="xs">
                            <Text color="$textLight800" fontWeight="$bold">Senha*</Text>
                            <Input
                                placeholder="Crie uma senha"
                                secureTextEntry
                                autoCapitalize="none"
                                placeholderTextColor="$coolGray400"
                                rounded="$lg"
                                value={password}
                                onChangeText={setPassword}
                            />
                        </VStack>

                        <VStack space="xs">
                            <Text color="$textLight800" fontWeight="$bold">Confirmar senha*</Text>
                            <Input
                                placeholder="Confirme sua senha"
                                secureTextEntry
                                autoCapitalize="none"
                                placeholderTextColor="$coolGray400"
                                rounded="$lg"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </VStack>
                    </VStack>

                    <Button
                        title="Cadastrar"
                        mt="$10"
                        mb="$6"
                        bg="#FF9100" 
                        sx={{
                            ":pressed": {
                                bg: "$orange700"
                            }
                        }}
                        rounded="$lg"
                        onPress={handleSignUp}
                        disabled={isLoading}
                    />

                    <Center>
                        <HStack>
                            <Text color="$textLight700" fontSize="$sm" fontFamily="$body">Já possui uma conta? </Text>
                            <Link onPress={handleGoBackToLogin}>
                                <LinkText color="#FF9100" fontSize="$sm" fontFamily="$body" fontWeight="$bold" textDecorationLine="underline">
                                    Faça login
                                </LinkText>
                            </Link>
                        </HStack>
                    </Center>

                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}