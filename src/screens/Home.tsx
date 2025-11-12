// src/screens/Home.tsx
// 🏠 Tela Home
// - Painel principal do app.
// - Mostra saldo, resumo do mês, últimos gastos e formulário para adicionar gasto.
// src/components/ → Componentes reutilizáveis (botões, inputs, etc.)
// src/screens/ → Telas do app (Login, Dashboard, etc.)
// src/context/ → Contextos globais, como autenticação e tema
// src/hooks/ → Hooks personalizados
// src/routes/ → Configuração de navegação
// src/utils/ → Funções auxiliares (formatação, cálculos, etc.)
// src/config/ → Configurações globais (tema, API, ambiente)

import React, { useState, useCallback, useMemo } from "react";
import {
  Center,
  Text,
  Box,
  VStack,
  HStack,
  FlatList,
} from "@gluestack-ui/themed";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { ResumoDoMes } from "../components/domain/ResumoDoMes";
import { UltimosGastos } from "../components/domain/UltimosGastos";
import { AdicionarGastoForm } from "../components/domain/AdicionarGastoForm";
import { ToggleSaldoButton } from "../components/ToggleSaldoButton";
import { Image } from "react-native";
import { useDespesas } from "../context/ExpensesContext";
import { useFinancialCalculations } from "../hooks/useFinancialCalculations";
import { formatCurrencyDisplay } from "../utils/formatUtils";
import { Alert } from "react-native";
import { theme } from "../config/theme";

// Tela Home: painel principal do app, mostra saldo, resumo do mês, últimos gastos e formulário para adicionar gasto
export function Home() {
  const { despesas, criarDespesa, renda, categorias } = useDespesas();
  const { gastosTotais, saldo } = useFinancialCalculations();
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  // Otimização: useCallback estabiliza as funções, evitando que os componentes
  // filhos que as recebem como props renderizem desnecessariamente.
  const handleToggleSaldo = useCallback(() => {
    setSaldoVisivel((v) => !v);
  }, []);

  const handleSalvarGasto = useCallback(
    (dados) => {
      if (dados.tipo && (dados.tipo === "fixo" || dados.tipo === "variavel")) {
        criarDespesa({
          valor: dados.valor,
          categoria: dados.categoria,
          data: dados.data,
          descricao: dados.descricao,
          tipo: dados.tipo,
        });
        Alert.alert("Sucesso", "Gasto adicionado com sucesso!");
      }
    },
    [criarDespesa],
  );

  // Otimização: useMemo previne a re-renderização de componentes pesados
  // que não dependem de estados que mudam com frequência (como saldoVisivel).
  const sections = useMemo(
    () => [
      {
        key: "header",
        component: (
          <Box
            w="95%"
            alignSelf="center"
            px="$6"
            pt="$7"
            pb="$7"
            bg="$white"
            rounded="$2xl"
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 6,
            }}
            mb="$4"
            mt="$8"
          >
            <Center mb="$4">
              <Image
                source={require("../assets/logotko.png")}
                style={{ width: 100, height: 100, resizeMode: "contain" }}
              />
            </Center>
            <VStack space="md">
              <Text fontSize="$md" color="$gray600" mb="$2" textAlign="center">
                Saldo disponível
              </Text>
              <HStack alignItems="center" justifyContent="center" space="sm">
                <Text fontSize="$4xl" fontWeight="bold" color="$black">
                  {saldoVisivel
                    ? `R$ ${formatCurrencyDisplay(saldo)}`
                    : "••••••"}
                </Text>
                <ToggleSaldoButton
                  visivel={saldoVisivel}
                  onToggle={handleToggleSaldo}
                />
              </HStack>
              <HStack
                alignItems="center"
                justifyContent="space-between"
                mt="$2"
              >
                <HStack alignItems="center" space="xs">
                  <Text fontSize="$md">💰</Text>
                  <Text fontSize="$sm" color="$gray600">
                    Renda: R$ {renda.toLocaleString("pt-BR")}
                  </Text>
                </HStack>
                <HStack alignItems="center" space="xs">
                  <Text fontSize="$md">💸</Text>
                  <Text fontSize="$sm" color="$gray600">
                    Gastos: R$ {gastosTotais.toLocaleString("pt-BR")}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Box>
        ),
      },
      {
        key: "resumo",
        component: (
          <Box
            w="92%"
            alignSelf="center"
            bg="$orange100"
            p="$5"
            rounded="$xl"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
            }}
            mb="$3"
          >
            <ResumoDoMes />
          </Box>
        ),
      },
      {
        key: "gastos",
        component: <UltimosGastos despesas={despesas} />,
      },
      {
        key: "form",
        component: (
          <Box
            w="92%"
            alignSelf="center"
            bg="$white"
            p="$7"
            rounded="$2xl"
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 51,
            }}
            mt="$2"
            mb="$10"
          >
            <Text mb="$4" fontSize="$xl" fontWeight="bold" color="$black">
              Adicionar gasto
            </Text>
            <AdicionarGastoForm
              categorias={categorias}
              onSalvar={handleSalvarGasto}
            />
          </Box>
        ),
      },
    ],
    [
      saldo,
      saldoVisivel,
      handleToggleSaldo,
      renda,
      gastosTotais,
      despesas,
      categorias,
      handleSalvarGasto,
    ],
  );

  const renderItem = useCallback(({ item }) => item.component, []);

  // Renderização da tela
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
        keyboardShouldPersistTaps="handled"
        // Otimizações de performance da FlatList
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: theme.colors.background, // 🎨 Fundo padrão do app
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Espaço no final da lista
  },
  // You can move other inline styles here if needed, for example:
  // logoImage: {
  //   width: 80,
  //   height: 80,
  //   resizeMode: "contain",
  //   marginRight: "80%",
  // }
});
