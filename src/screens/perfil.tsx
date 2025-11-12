// Tela de Perfil: permite ao usuário visualizar e editar seus dados pessoais e renda
import React, { useState, useMemo, useEffect } from "react";
import {
  Center,
  ScrollView,
  VStack,
  Box,
  Text,
  Button,
  Image,
  Pressable,
  Heading,
  Icon,
  HStack,
} from "@gluestack-ui/themed";
import {
  User as UserIcon,
  Camera as CameraIcon,
  CalendarDays as CalendarDaysIcon,
} from "lucide-react-native";
import { useDespesas } from "../context/ExpensesContext";
import { useAuth } from "../context/AuthContext";
import { useFinancialCalculations } from "../hooks/useFinancialCalculations";
import {
  Alert,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { Input } from "@components/base/Input";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { formatCurrency, parseCurrency } from "../utils/formatUtils";
import { theme } from "../config/theme";

// Componente principal da tela de perfil
export function Perfil() {
  const { user, signOut } = useAuth();

  // Proteção: se user não existir, retorna null (componente não renderiza)
  if (!user) {
    return null;
  }

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const { despesas, renda, setRenda, limparDados } = useDespesas();
  const [income, setIncome] = useState(formatCurrency(renda));
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  // State for date filtering
  const [filterType, setFilterType] = useState<"month" | "year">("month");
  const [currentFilterDate, setCurrentFilterDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Atualiza os campos quando user mudar (apenas se realmente mudou)
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user?.name, user?.email, user?.phone]);

  // Sempre que a renda do contexto mudar, atualize o campo formatado
  useEffect(() => {
    const formatted = formatCurrency(renda);
    setIncome(formatted);
  }, [renda]);

  const handleSelectImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão Necessária",
        "Desculpe, precisamos da permissão da galeria para fazer isso funcionar!",
      );
      return;
    }

    // Launch image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
      allowsEditing: true, // Allow user to edit the image (crop, etc.)
      aspect: [1, 1], // Aspect ratio for cropping (square for profile picture)
      quality: 1, // Highest quality
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(Platform.OS === "ios"); // Keep open on iOS until dismissed
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    if (selectedDate) {
      setCurrentFilterDate(selectedDate);
    }
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }
  };

  const formattedPeriod = useMemo(() => {
    if (filterType === "month") {
      return currentFilterDate.toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
      });
    }
    return currentFilterDate.getFullYear().toString();
  }, [currentFilterDate, filterType]);

  // Usar hook para cálculos de despesas
  const { getDespesasPorPeriodo, getDespesasPorAno } =
    useFinancialCalculations();

  const filteredDespesas = useMemo(() => {
    const selectedMonth = currentFilterDate.getMonth();
    const selectedYear = currentFilterDate.getFullYear();

    if (filterType === "month") {
      return getDespesasPorPeriodo(selectedMonth, selectedYear);
    } else {
      return getDespesasPorAno(selectedYear);
    }
  }, [currentFilterDate, filterType, getDespesasPorPeriodo, getDespesasPorAno]);

  const totalGastosFiltrados = useMemo(() => {
    return filteredDespesas.reduce((sum, d) => sum + d.valor, 0);
  }, [filteredDespesas]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Ajustado para 0
    >
      <ScrollView
        flex={1}
        bg="$gray100"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <VStack space="lg" p="$6" pt="$12">
          {/* 🔽 Avatar e cabeçalho — pode mover para topo fixo ou esconder em telas menores */}
          <Center>
            <Pressable
              onPress={handleSelectImage}
              w={120}
              h={120}
              rounded="$full"
              bg="$coolGray300"
              justifyContent="center"
              alignItems="center"
              mb="$4"
              sx={{ _dark: { bg: "$coolGray700" } }}
            >
              {profileImageUri ? (
                <Image
                  source={{ uri: profileImageUri }}
                  alt="Foto de perfil"
                  w={120}
                  h={120}
                  rounded="$full"
                />
              ) : (
                <Icon as={UserIcon} size="xl" color="$coolGray500" />
              )}
              <Box
                position="absolute"
                bottom={0}
                right={0}
                bg="$primary500"
                rounded="$full"
                p="$1.5"
              >
                <Icon as={CameraIcon} size="sm" color="$white" />
              </Box>
            </Pressable>
            <Heading size="xl" color="$textDark800" mb="$1">
              Meu Perfil
            </Heading>
            <Text color="$textLight600" fontSize="$md" mb="$6">
              Edite seus dados e gerencie sua renda.
            </Text>
            {/* Botão para limpar dados */}
            <Button
              mt="$2"
              mb="$2"
              bg={theme.colors.accent}
              rounded="$lg"
              onPress={() => {
                Alert.alert(
                  "Limpar Dados",
                  "Tem certeza que deseja limpar todos os dados de gastos? Esta ação não pode ser desfeita.",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Sim, limpar",
                      onPress: async () => {
                        await limparDados();
                        Alert.alert(
                          "Sucesso",
                          "Todos os dados de gastos foram limpos.",
                        );
                      },
                      style: "destructive",
                    },
                  ],
                );
              }}
              sx={{
                ":pressed": {
                  bg: "$orange700",
                },
              }}
            >
              <Text color="$white" fontWeight="$bold">
                Limpar Dados
              </Text>
            </Button>

            {/* Botão de sair */}
            <Button
              mt="$2"
              mb="$4"
              //bg="$red600" errado
              bg={theme.colors.danger} //correto
              rounded="$lg"
              onPress={async () => {
                try {
                  await signOut();
                } catch (error) {
                  console.error("Erro ao fazer logout:", error);
                  Alert.alert(
                    "Erro",
                    "Ocorreu um erro ao sair. Tente novamente.",
                  );
                }
              }}
              sx={{
                ":pressed": {
                  bg: "$red800",
                },
              }}
            >
              <Text color="$white" fontWeight="$bold">
                Sair
              </Text>
            </Button>
          </Center>

          {/* 🧾 Card de informações do usuário — redimensiona conforme conteúdo; pode ser movido acima/abaixo do histórico */}

          <Box
            bg="$white"
            rounded="$xl"
            p="$6"
            sx={{ _dark: { bg: "$coolGray800" } }}
          >
            {/* Campo Nome */}
            <Text color="$textLight800" fontWeight="$bold" mb="$1">
              Nome Completo*
            </Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              rounded="$lg"
            />

            <Box h="$4" />

            {/* Campo E-mail */}
            <Text color="$textLight800" fontWeight="$bold" mb="$1">
              E-mail*
            </Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Seu e-mail"
              keyboardType="email-address"
              rounded="$lg"
            />

            <Box h="$4" />

            {/* Campo Telefone */}
            <Text color="$textLight800" fontWeight="$bold" mb="$1">
              Telefone
            </Text>
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="(xx) xxxxx-xxxx"
              keyboardType="phone-pad"
              rounded="$lg"
            />

            <Box h="$4" />

            {/* Campo Renda */}
            <Text color="$textLight800" fontWeight="$bold" mb="$1">
              Renda Mensal (R$)
            </Text>
            <Input
              value={income}
              onChangeText={(text) => {
                // Permite apenas números e formata
                const numeric = text.replace(/\D/g, "");
                const formatted = formatCurrency(numeric);
                setIncome(formatted);
              }}
              placeholder="Ex: R$ 3.500,00"
              keyboardType="numeric"
              rounded="$lg"
            />

            <Box h="$6" />

            {/* Botão para salvar alterações */}
            <Button
              onPress={() => {
                const valorNumerico = parseCurrency(income);
                setRenda(valorNumerico);
                Alert.alert("Sucesso", "Dados atualizados com sucesso!");
              }}
            //bg="#FF9100" errado
              bg={theme.colors.accent} //correto
              rounded="$lg"
              size="lg"
              sx={{
                ":pressed": {
                  bg: "$orange700",
                },
              }}
            >
              <Text color="$white" fontWeight="$bold">
                Salvar Alterações
              </Text>
            </Button>
          </Box>

          {/* 📈 Seção de Histórico de Gastos — pode ser reordenada; blocos se adaptam ao espaço disponível */}

          <Box
            bg="$white"
            rounded="$xl"
            p="$6"
            sx={{ _dark: { bg: "$coolGray800" } }}
            mt="$6"
          >
            <Heading size="lg" color="$textDark800" mb="$4">
              Histórico de Gastos
            </Heading>

            <HStack space="md" mb="$4">
              <Button
                flex={1}
                variant={filterType === "month" ? "solid" : "outline"}
                action={filterType === "month" ? "primary" : "secondary"}
                onPress={() => setFilterType("month")}
                isDisabled={filterType === "month"}
              >
                <Text>Mês</Text>
              </Button>
              <Button
                flex={1}
                variant={filterType === "year" ? "solid" : "outline"}
                action={filterType === "year" ? "primary" : "secondary"}
                onPress={() => setFilterType("year")}
                isDisabled={filterType === "year"}
              >
                <Text>Ano</Text>
              </Button>
            </HStack>

            <Pressable onPress={() => setShowDatePicker(true)} mb="$4">
              <HStack
                alignItems="center"
                space="sm"
                p="$2"
                borderWidth={1}
                borderColor="$coolGray300"
                rounded="$md"
              >
                <Icon as={CalendarDaysIcon} size="md" color="$textLight600" />
                <Text color="$textLight700">{formattedPeriod}</Text>
              </HStack>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                testID="datePicker"
                value={currentFilterDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Box bg="$gray100" p="$3" rounded="$md">
              <Text fontWeight="$bold" color="$textDark800">
                Total Gasto em {formattedPeriod}:
              </Text>
              <Text fontSize="$xl" color="$primary600" fontWeight="$bold">
                R$ {totalGastosFiltrados.toFixed(2)}
              </Text>
            </Box>
          </Box>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingBottom: 80, // evita que o conteúdo seja coberto pela barra inferior
  },
});
