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
// Removido: import { LinearGradient } from 'expo-linear-gradient';

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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Box bg="$white" style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollViewContentContainer, { paddingBottom: 32 }]} // margem inferior para não colar
          keyboardShouldPersistTaps="handled"
        >
          {/* Header com logo e saldo */}
          <Box
            w="95%"
            alignSelf="center"
            px="$6"
            pt="$7"
            pb="$7"
            bg="$white"
            rounded="$2xl"
            style={{ elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6 }}
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
              <Text fontSize="$md" color="$gray600" mb="$2" textAlign="center">Saldo disponível</Text>
              <HStack alignItems="center" justifyContent="center" space="sm">
                <Text fontSize="$4xl" fontWeight="bold" color="$black">
                  {saldoVisivel
                    ? `R$ ${saldo.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "••••••"}
                </Text>
                <ToggleSaldoButton
                  visivel={saldoVisivel}
                  onToggle={() => setSaldoVisivel((v) => !v)}
                />
              </HStack>
              <HStack alignItems="center" justifyContent="space-between" mt="$2">
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
            w="92%"
            alignSelf="center"
            bg="$orange100"
            p="$5"
            rounded="$xl"
            style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 }}
            mb="$3"
          >
            <ResumoDoMes />
          </Box>
          <Box
            w="95%"
            alignSelf="center"
            bg="$white"
            p="$6"
            rounded="$2xl"
            style={{ 
              elevation: 10, 
              shadowColor: '#000', 
              shadowOpacity: 0.08, 
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 }
            }}
            mb="$4"
            borderWidth={1}
            borderColor="$gray100"
          


          >
            <UltimosGastos despesas={despesas} />
          </Box>
          {/* Formulário de Adicionar Gasto */}
          <Box
            w="92%"
            alignSelf="center"
            bg="$white"
            p="$7"
            rounded="$2xl"
            style={{ elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 51 }}
            mt="$2"
            mb="$10"
          >
            <Text mb="$4" fontSize="$xl" fontWeight="bold" color="$black">Adicionar gasto</Text>
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
      </Box>
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