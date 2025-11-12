// Tela de Metas: permite ao usuário criar e acompanhar metas financeiras
import React, { useState } from "react";
import {
  Center,
  ScrollView,
  VStack,
  HStack,
  Box,
  Text,
  Input,
  InputField,
  Button,
  Image,
  Pressable,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Icon,
  Progress,
  ProgressFilledTrack,
} from "@gluestack-ui/themed";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useMetas } from "../context/MetasContext";
import { useMetaCalculations } from "../hooks/useMetaCalculations";
import { formatCurrency, formatDate } from "../utils/formatUtils";
import { CalendarDays as CalendarIcon, X } from "lucide-react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { theme } from "../config/theme";

// Componente para exibir uma meta individual
function MetaCard({ meta }: { meta: any }) {
  const { progresso, diasRestantes, prazoExpirado, status } =
    useMetaCalculations(meta);
  const { adicionarValorNaMeta, excluirMeta } = useMetas();
  const [modalVisible, setModalVisible] = useState(false);
  const [valorAdicionar, setValorAdicionar] = useState("");

  const handleAdicionarValor = () => {
    if (!valorAdicionar) {
      Alert.alert("Erro", "Digite um valor válido!");
      return;
    }

    const valorNum = parseFloat(valorAdicionar.replace(",", "."));
    if (isNaN(valorNum) || valorNum <= 0) {
      Alert.alert("Erro", "Digite um valor válido!");
      return;
    }

    adicionarValorNaMeta(meta.id, valorNum);
    setModalVisible(false);
    setValorAdicionar("");
  };

  return (
    <>
      <Box
        borderWidth={1}
        borderColor={prazoExpirado ? "$red400" : "$blue500"}
        borderRadius="$lg"
        bg="$white"
        p="$4"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={3}
      >
        <VStack space="sm">
          <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack flex={1}>
              <Text fontSize="$lg" fontWeight="bold" color="$gray900">
                {meta.nome}
              </Text>
              <Text fontSize="$sm" color="$gray600">
                📂 {meta.categoria}
              </Text>
            </VStack>
            <Pressable onPress={() => excluirMeta(meta.id)} p="$1">
              <Icon as={X} size="md" color={theme.colors.danger}  />
            </Pressable>
          </HStack>

          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$sm" color="$gray700">
              ⏰ Prazo: {formatDate(meta.prazo)}
            </Text>
            <Text
              fontSize="$sm"
              color={prazoExpirado ? theme.colors.danger : theme.colors.success}
              fontWeight="bold"
            >
              {prazoExpirado
                ? `${Math.abs(diasRestantes)} dias atrasado`
                : `${diasRestantes} dias restantes`}
            </Text>
          </HStack>

          <Text fontSize="$xs" color="$gray500">
            Criado em: {formatDate(meta.criadoEm)}
          </Text>

          <VStack space="xs">
            <Progress value={Math.min(progresso, 100)} size="md">
              <ProgressFilledTrack
                bg={
                  progresso >= 100 ? theme.colors.success : theme.colors.warning
                }
              />
            </Progress>
            <HStack justifyContent="space-between">
              <Text fontSize="$xs" color="$gray600">
                {progresso.toFixed(1)}% concluído
              </Text>
              <Text fontSize="$xs" color="$gray600">
                {formatCurrency(meta.valorAtual)} / {formatCurrency(meta.valor)}
              </Text>
            </HStack>
          </VStack>

          <Box
            bg={
              progresso >= 100
                ? theme.colors.green100
                : prazoExpirado
                  ? theme.colors.red100
                  : theme.colors.orange100
            }
            borderRadius="$md"
            p="$2"
          >
            <Text
              fontSize="$sm"
              fontWeight="bold"
              color={
                progresso >= 100
                  ? theme.colors.green700
                  : prazoExpirado
                    ? theme.colors.red700
                    : theme.colors.orange700
              }
              textAlign="center"
            >
              {progresso >= 100
                ? "🎉 Meta alcançada!"
                : prazoExpirado
                  ? "⚠️ Prazo expirado"
                  : "📈 Em andamento"}
            </Text>
          </Box>

          <Button
            mt="$2"
            bg={theme.colors.warning}
            onPress={() => setModalVisible(true)}
            isDisabled={progresso >= 100}
          >
            <Text color="$white">
              {progresso >= 100 ? "Meta concluída" : "Adicionar valor"}
            </Text>
          </Button>
        </VStack>
      </Box>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="$lg" fontWeight="bold">
              Adicionar valor à meta
            </Text>
            <ModalCloseButton>
              <Icon as={X} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Input>
              <InputField
                placeholder="Valor a adicionar (ex: 150,50)"
                keyboardType="numeric"
                value={valorAdicionar}
                onChangeText={(text) => {
                  const valorLimpo = text.replace(/[^0-9.,]/g, "");
                  setValorAdicionar(valorLimpo);
                }}
              />
            </Input>
          </ModalBody>
          <ModalFooter>
            <HStack space="md">
              <Button
                bg="$gray400"
                onPress={() => setModalVisible(false)}
                flex={1}
              >
                <Text color="$white">Cancelar</Text>
              </Button>
              <Button
                bg={theme.colors.success}
                onPress={handleAdicionarValor}
                flex={1}
              >
                <Text color="$white">Adicionar</Text>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// Componente principal da tela de metas
export function Metas() {
  const { metas, adicionarMeta } = useMetas();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState<Date | null>(null);
  const [categoria, setCategoria] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(Platform.OS === "ios");
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    if (selectedDate) {
      setPrazo(selectedDate);
      setShowDatePicker(false);
    }
  };

  const handleValorChange = (text: string) => {
    const valorLimpo = text.replace(/[^0-9.,]/g, "");
    setValor(valorLimpo);
  };

  const handleAdicionarMeta = () => {
    if (!nome.trim() || !valor || !prazo || !categoria.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }

    const valorNumerico = parseFloat(valor.replace(",", "."));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert("Erro", "Digite um valor válido maior que zero!");
      return;
    }

    adicionarMeta({
      nome: nome.trim(),
      valor: valorNumerico,
      prazo,
      categoria: categoria.trim(),
    });

    setNome("");
    setValor("");
    setPrazo(null);
    setCategoria("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Center flex={1} bg="$gray100">
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={prazo || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        <ScrollView
          w="100%"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        >
          <Center mt="$8" mb="$4">
            <Image
              source={require("@assets/logotko.png")}
              alt="Logo"
              w={100}
              h={100}
              resizeMode="contain"
            />
            <Text fontSize="$xl" fontWeight="bold" color={theme.colors.warning} mt="$2">
              Minhas Metas
            </Text>
          </Center>

          {/* 📦 Lista de metas — os cards abaixo podem ser reorganizados e empilhados verticalmente */}
          <VStack space="md" p="$4" pb="$8">
            {metas.length === 0 ? (
              <Box bg="$white" borderRadius="$lg" p="$6" alignItems="center">
                <Text fontSize="$md" color="$gray600" textAlign="center">
                  Você ainda não tem metas cadastradas.
                </Text>
                <Text
                  fontSize="$sm"
                  color="$gray500"
                  textAlign="center"
                  mt="$2"
                >
                  Crie sua primeira meta abaixo!
                </Text>
              </Box>
            ) : (
              metas.map((meta) => <MetaCard key={meta.id} meta={meta} />)
            )}

            {/* 📝 Formulário “Nova Meta” — pode ser reposicionado (topo/abaixo). Campos se adaptam ao teclado e à tela. */}
            <Box
              bg="$white"
              borderRadius="$lg"
              p="$4"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={4}
              elevation={3}
            >
              <Text fontSize="$lg" fontWeight="bold" color="$gray900" mb="$4">
                ➕ Nova Meta
              </Text>

              <VStack space="md">
                <Input>
                  <InputField
                    placeholder="Nome da meta"
                    value={nome}
                    onChangeText={setNome}
                  />
                </Input>

                <Input>
                  <InputField
                    placeholder="Categoria (ex: Viagem, Carro, Casa)"
                    value={categoria}
                    onChangeText={setCategoria}
                  />
                </Input>

                <Input>
                  <InputField
                    placeholder="Valor necessário (ex: 2500,50)"
                    keyboardType="numeric"
                    value={valor}
                    onChangeText={handleValorChange}
                  />
                </Input>

                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  bg="$gray200"
                  p="$3"
                  borderRadius="$md"
                >
                  <HStack alignItems="center" space="sm">
                    <Icon as={CalendarIcon} size="sm" color="$gray600" />
                    <Text color={prazo ? "$gray900" : "$gray500"}>
                      {prazo
                        ? `Prazo: ${formatDate(prazo)}`
                        : "Selecionar prazo"}
                    </Text>
                  </HStack>
                </Pressable>

                <Button
                  mt="$2"
                  bg={theme.colors.warning}
                  onPress={handleAdicionarMeta}
                  isDisabled={
                    !nome.trim() || !valor || !prazo || !categoria.trim()
                  }
                >
                  <Text color="$white">Criar Meta</Text>
                </Button>
              </VStack>
            </Box>
          </VStack>
        </ScrollView>
      </Center>
    </KeyboardAvoidingView>
  );
}
