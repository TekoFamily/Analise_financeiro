// Tela de Gastos: exibe o histórico de despesas do usuário
import React, { useState } from "react";
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Button,
} from "@gluestack-ui/themed";
import { useDespesas } from "../context/ExpensesContext"; // Importando o contexto de despesas
import { DespesasList } from "../components/DespesasList";
import { FiltroDespesasButtons } from "../components/FiltroDespesasButtons";

// Componente principal da tela de gastos
export function History() {
  // Hook do contexto para acessar as despesas
  const { despesas } = useDespesas();
  // Estado para filtro
  const [filtro, setFiltro] = useState<'todos' | 'fixo' | 'variavel'>('todos');

  // Função para filtrar despesas
  const despesasFiltradas = filtro === 'todos' ? despesas : despesas.filter(d => d.tipo === filtro);

  // Renderização da tela
  return (
    <Box flex={1} bg="$gray100">
      <VStack space="md" p="$5" w="100%">
        {/* Botões de filtro em componente separado */}
        <FiltroDespesasButtons filtro={filtro} setFiltro={setFiltro} />
        <ScrollView w="100%">
          <DespesasList despesas={despesasFiltradas} />
        </ScrollView>
      </VStack>
    </Box>
  );
}
