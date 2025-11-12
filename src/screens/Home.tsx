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

import React, { useState } from "react";
import {
  Center,
  Text,
  Box,
  VStack,
  HStack,
  ScrollView,
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

  // Renderização da tela
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Box bg="$white" style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContentContainer,
            {
              paddingBottom: theme.spacing.xl,
              paddingHorizontal: theme.spacing.md,
            },
          ]} // margem inferior para não colar
          keyboardShouldPersistTaps="handled"
        >
          {/* 🔽 Header - pode mover para o topo ou esconder em telas menores */}
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
                  onToggle={() => setSaldoVisivel((v) => !v)}
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
          {/* 📊 Resumo do mês - card principal que redimensiona automaticamente conforme a tela */}
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
          {/* 🧾 Últimos gastos - lista rolável; pode ficar abaixo do resumo em telas pequenas */}
          <Box
            w="95%"
            alignSelf="center"
            bg="$white"
            p="$6"
            rounded="$2xl"
            style={{
              elevation: 10,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
            mb="$4"
            borderWidth={1}
            borderColor="$gray100"
          >
            <UltimosGastos despesas={despesas} />
          </Box>
          {/* 💬 Adicionar gasto - pode ser reposicionado abaixo do gráfico; campos se adaptam ao teclado */}
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
              onSalvar={(dados) => {
                if (
                  dados.tipo &&
                  (dados.tipo === "fixo" || dados.tipo === "variavel")
                ) {
                  criarDespesa({
                    valor: dados.valor,
                    categoria: dados.categoria,
                    data: dados.data,
                    descricao: dados.descricao,
                    tipo: dados.tipo,
                  });
                  Alert.alert("Sucesso", "Gasto adicionado com sucesso!");
                }
              }}
            />
          </Box>
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: theme.colors.background, // 🎨 Fundo padrão do app
    padding: theme.spacing.md, // 🧭 Controle central de espaçamento
  },
  scrollViewContentContainer: {
    flexGrow: 5,
    // Removido paddingBottom: 80 para evitar espaço extra acima do teclado
  },
  // You can move other inline styles here if needed, for example:
  // logoImage: {
  //   width: 80,
  //   height: 80,
  //   resizeMode: "contain",
  //   marginRight: "80%",
  // }
});
