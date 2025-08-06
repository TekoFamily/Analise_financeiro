import React from "react";
import { Box, Text, VStack, HStack, ScrollView, Center } from "@gluestack-ui/themed";
import { Dimensions } from "react-native";

interface Despesa {
  id: number;
  nome: string;
  valor: number;
  data: string;
  icone: string;
}

interface UltimosGastosProps {
  despesas: Despesa[];
}

export function UltimosGastos({ despesas }: UltimosGastosProps) {
  const screenWidth = Dimensions.get("window").width;

  return (
    <VStack w="100%" mt="$6">
      <Text
        px="$4"
        mb="$2"
        fontSize="$lg"
        fontWeight="bold"
        color="$black"
      >
        Últimos gastos
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        px="$4"
      >
        <HStack space="md">
          {despesas.map((d) => (
            <Box
              key={d.id}
              bg="$white"
              p="$3"
              rounded="$lg"
              width={screenWidth * 0.4}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.1}
              shadowRadius={2}
              elevation={2}
            >
              <Center>
                <Box
                  w={12}
                  h={12}
                  bg="$orange200"
                  rounded="$full"
                  alignItems="center"
                  justifyContent="center"
                  mb="$3"
                >
                  <Text fontSize="$2xl">{d.icone}</Text>
                </Box>
                <Text
                  fontSize="$md"
                  fontWeight="bold"
                  color="$black"
                  textAlign="center"
                >
                  R$ {d.valor.toFixed(2)}
                </Text>
                <Text fontSize="$xs" color="$gray500" mt="$1">
                  {d.data}
                </Text>
              </Center>
            </Box>
          ))}
        </HStack>
      </ScrollView>
    </VStack>
  );
}