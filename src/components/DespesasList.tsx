import React from "react";
import { Box, VStack, Text, HStack } from "@gluestack-ui/themed";
import { Despesa } from "../context/ExpensesContext";

interface DespesasListProps {
  despesas: Despesa[];
}

export function DespesasList({ despesas }: DespesasListProps) {
  return (
    <VStack space="md">
      {/* Título da tela */}
      <Text fontSize="$xl" fontWeight="bold" color="$gray900" mb="$2">
        Gastos
      </Text>
      {/* Lista de despesas */}
      {despesas.map((d) => (
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
  );
}
