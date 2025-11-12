import React, { useCallback } from "react";
import {
  Box,
  Text,
  VStack,
  Center,
  FlatList, // Importa FlatList
} from "@gluestack-ui/themed";
import { Dimensions } from "react-native";
import { Despesa } from "../../context/ExpensesContext";
import { EmptyState } from "../feedback/EmptyState";

interface UltimosGastosProps {
  despesas: Despesa[];
}

const screenWidth = Dimensions.get("window").width;

// 1. Componente de item memoizado para performance
// React.memo evita que o item seja renderizado novamente se suas props não mudarem.
const GastoItem = React.memo(({ item }: { item: Despesa }) => {
  return (
    <Box
      bg="$white"
      p="$3"
      rounded="$lg"
      width={screenWidth * 0.4} // Largura do item
      borderWidth={1}
      borderColor="$gray100"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={4}
      elevation={2}
    >
      <Center>
        <Box
          w={48}
          h={48}
          bg="$orange100"
          rounded="$full"
          alignItems="center"
          justifyContent="center"
          mb="$2"
        >
          <Text fontSize="$2xl">{item.icone}</Text>
        </Box>
        <Text
          fontSize="$sm"
          fontWeight="$bold"
          color="$coolGray700"
          textAlign="center"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.nome}
        </Text>
        <Text fontSize="$lg" fontWeight="bold" color="$coolGray800" mt="$1">
          R$ {item.valor.toFixed(2).replace(".", ",")}
        </Text>
        <Text fontSize="$xs" color="$gray500" mt="$1">
          {item.data}
        </Text>
      </Center>
    </Box>
  );
});

export function UltimosGastos({ despesas }: UltimosGastosProps) {
  // 2. Define a função de renderização com useCallback para estabilidade
  const renderGasto = useCallback(({ item }: { item: Despesa }) => {
    return <GastoItem item={item} />;
  }, []);

  // 3. Define o extrator de chave com useCallback
  const keyExtractor = useCallback((item: Despesa) => item.id.toString(), []);

  // 4. Lida com o estado vazio, mostrando uma mensagem clara
  if (!despesas || despesas.length === 0) {
    return (
      <VStack w="100%" mt="$4" px="$4">
        <Text mb="$3" fontSize="$lg" fontWeight="bold" color="$black">
          Últimos gastos
        </Text>
        <EmptyState
          icon="💸"
          title="Nenhum Gasto Recente"
          message="Quando você adicionar um novo gasto, ele aparecerá aqui."
        />
      </VStack>
    );
  }

  // 5. Usa FlatList em vez de ScrollView + map para performance
  return (
    <VStack w="100%" mt="$4">
      <Text px="$4" mb="$3" fontSize="$lg" fontWeight="bold" color="$black">
        Últimos gastos
      </Text>
      <FlatList
        data={despesas.slice(0, 10)} // Limita a 10 itens para performance
        horizontal
        renderItem={renderGasto}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}
        ItemSeparatorComponent={() => <Box w="$3" />} // Espaço entre os itens
        initialNumToRender={3} // Otimização: renderiza 3 itens inicialmente
        maxToRenderPerBatch={5} // Otimização: renderiza 5 itens por lote
        windowSize={5} // Otimização: mantém uma janela menor de itens renderizados
      />
    </VStack>
  );
}
