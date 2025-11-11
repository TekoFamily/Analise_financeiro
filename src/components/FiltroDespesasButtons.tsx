import React from "react";
import { HStack, Button, Text } from "@gluestack-ui/themed";

interface FiltroDespesasButtonsProps {
  filtro: 'todos' | 'fixo' | 'variavel';
  setFiltro: (tipo: 'todos' | 'fixo' | 'variavel') => void;
}

export function FiltroDespesasButtons({ filtro, setFiltro }: FiltroDespesasButtonsProps) {
  return (
    <HStack space="sm" mb="$2" justifyContent="center" mt="$8">
      <Button bg={filtro === 'todos' ? "$orange500" : "$gray200"} p="$2" borderRadius="$md" onPress={() => setFiltro('todos')}>
        <Text color={filtro === 'todos' ? "$white" : "$gray900"}>Todos</Text>
      </Button>
      <Button bg={filtro === 'fixo' ? "$orange500" : "$gray200"} p="$2" borderRadius="$md" onPress={() => setFiltro('fixo')}>
        <Text color={filtro === 'fixo' ? "$white" : "$gray900"}>Fixos</Text>
      </Button>
      <Button bg={filtro === 'variavel' ? "$orange500" : "$gray200"} p="$2" borderRadius="$md" onPress={() => setFiltro('variavel')}>
        <Text color={filtro === 'variavel' ? "$white" : "$gray900"}>Variáveis</Text>
      </Button>
    </HStack>
  );
}
