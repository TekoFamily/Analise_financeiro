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
        {/* Botões de filtro */}
        <HStack space="sm" mb="$2" justifyContent="center" mt="$8">
          <Button bg={filtro === 'todos' ? "$orange500" : "$gray200"} p="$2" borderRadius="$md" onPress={() => setFiltro('todos')}><Text color={filtro === 'todos' ? "$white" : "$gray900"}>Todos</Text></Button>
          <Button bg={filtro === 'fixo' ? "$orange500" : "$gray200"} p="$2" borderRadius="$md" onPress={() => setFiltro('fixo')}><Text color={filtro === 'fixo' ? "$white" : "$gray900"}>Fixos</Text></Button>
          <Button bg={filtro === 'variavel' ? "$orange500" : "$gray200"} p="$2" borderRadius="$md" onPress={() => setFiltro('variavel')}><Text color={filtro === 'variavel' ? "$white" : "$gray900"}>Variáveis</Text></Button>
        </HStack>
        <ScrollView w="100%">
          <VStack space="md">
            {/* Título da tela */}
            <Text fontSize="$xl" fontWeight="bold" color="$gray900" mb="$2">
              Gastos
            </Text>
            {/* Lista de despesas */}
            {despesasFiltradas.map((d) => (
              <Box
                key={d.id}
                borderWidth={1}
                borderColor="$blue500"
                borderRadius="$md"
                bg="$white"
                p="$4"
              >
                <Text fontSize="$md" fontWeight="bold" color="$gray900">
                  {d.nome} – {d.data}
                </Text>
                <Text fontSize="$sm" color="$gray700" mb="$2">
                  {d.icone} – {d.descricao}
                </Text>
                <HStack justifyContent="space-between">
                  <Text fontSize="$xs" color="$gray600">
                    R$ {d.valor.toFixed(2)}
                  </Text>
                  <Text fontSize="$xs" color="$gray600">
                    Categoria: {d.nome}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}
