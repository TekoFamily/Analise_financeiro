// src/screens/Home.tsx

import React, { useState } from "react";
import {
  Center,
  Text,
  Box,
  VStack,
  HStack,
  ScrollView,
  Pressable,
} from "@gluestack-ui/themed";
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { ResumoDoMes } from "../components/ResumoDoMes";
import { UltimosGastos } from "../components/UltimosGastos";
import { AdicionarGastoForm } from "../components/AdicionarGastoForm"; // Novo componente
import { ToggleSaldoButton } from "../components/ToggleSaldoButton";
import { Image } from "react-native";
import { useDespesas } from "../context/ExpensesContext"; // já está importado
import { Alert } from "react-native";

// Tela Home: painel principal do app, mostra saldo, resumo do mês, últimos gastos e formulário para adicionar gasto
export function Home() {
  // Hook do contexto para acessar despesas, função de adicionar e renda
  const { despesas, adicionarDespesa, renda } = useDespesas();

  // Lista de categorias fixas para o formulário
  const categorias = ["Mercado", "Lazer", "Transporte"];

  // Calcula o total de gastos e saldo disponível
  const gastosTotais = despesas.reduce((sum, d) => sum + (d.valor || 0), 0);
  const saldo = (renda || 0) - gastosTotais;

  // Estado para mostrar ou ocultar o saldo
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  // Renderização da tela
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Alterado para 0
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: '#f5f5f5' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header com logo e saldo */}
        <Box
          w="100%"
          px="$4"
          pt="$10"
          pb="$10"
          bg="$white"
          style={{ position: "relative" }}
          mt="$10"
        >
          <HStack justifyContent="flex-end" alignItems="center">
            {/* Logo do app */}
            <Image
              source={require("../assets/logotko.png")}
              style={{
                width: 80,
                height: 80,
                resizeMode: "contain",
                marginRight: "80%", // ajuste esse valor para mover mais ou menos
              }}
            />
          </HStack>
          <VStack mt="$4" space="sm">
            <HStack alignItems="center" space="sm">
              {/* Saldo do usuário, pode ser ocultado */}
              <Text fontSize="$2xl" fontWeight="bold" color="$black">
                Saldo: {saldoVisivel
                  ? `R$ ${saldo.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "••••••"}
              </Text>
              {/* Botão para alternar visibilidade do saldo */}
              <ToggleSaldoButton
                visivel={saldoVisivel}
                onToggle={() => setSaldoVisivel((v) => !v)}
              />
            </HStack>
            <HStack alignItems="center" space="md">
              {/* Renda e gastos totais */}
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
        {/* Resumo do mês */}
        <Box
          w="90%"
          alignSelf="center"
          bg="$orange100"
          p="$4"
          rounded="$lg"
          mt="$4"
        >
          <ResumoDoMes />
        </Box>
        {/* Últimos Gastos */}
        <UltimosGastos despesas={despesas} />
        {/* Formulário de Adicionar Gasto */}
        <Box
          w="95%"
          alignSelf="center"
          bg="$white"
          p="$10"
          rounded="$lg"
          mt="$1"
        >
          <Text mb="$4" fontSize="$lg" fontWeight="bold" color="$black">
            Adicionar gasto
          </Text>
          <AdicionarGastoForm
            categorias={categorias}
            onSalvar={({ valor, categoria, data, descricao, tipo }) => {
              if (!valor || !categoria || !data || !descricao || !tipo) return;
              const novaDespesa = {
                id: Date.now(),
                nome: categoria.charAt(0).toUpperCase() + categoria.slice(1),
                valor: parseFloat(valor.replace(",", ".")),
                data,
                icone:
                  categoria.toLowerCase() === "mercado"
                    ? "🛒"
                    : categoria.toLowerCase() === "lazer"
                    ? "🎉"
                    : "🚗",
                descricao,
                tipo,
              };
              adicionarDespesa(novaDespesa); // Use o contexto!
              Alert.alert("Sucesso", "Gasto adicionado com sucesso!");
            }}
          />
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
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
