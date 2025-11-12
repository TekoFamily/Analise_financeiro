// src/components/DespesasList.tsx
// 🧾 Componente: DespesasList
// Exibe uma lista de cards de despesas (gastos) com valores, datas e categorias.
// Pode ser reposicionado entre telas (ex.: Home, Histórico) e dentro de diferentes containers.
// Os cards se redimensionam automaticamente conforme a largura da tela.

import React from "react";

import { Box, VStack, Text, HStack } from "@gluestack-ui/themed";

import { Despesa } from "../../context/ExpensesContext";

interface DespesasListProps {
  despesas: Despesa[];
}

export function DespesasList({ despesas }: DespesasListProps) {
  return (
    <VStack space="md">
      {/* 🔽 Bloco principal - pode ser movido e ter o espaçamento ajustado via props */}
      {/* 🏷️ Título - pode ser removido caso o título seja controlado pela tela */}

      <Text fontSize="$xl" fontWeight="bold" color="$gray900" mb="$2">
        Gastos
      </Text>

      {/* 📜 Lista de despesas - pode ser reposicionada abaixo/ao lado de outros cards */}

      {despesas.map((d) => (
        <Box
          key={d.id}
          borderWidth={1}
          borderColor="$blue500"
          borderRadius="$md"
          bg="$white"
          p="$4"
        >
          {/* 📦 Card de despesa - redimensiona automaticamente e pode ser reordenado */}
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
