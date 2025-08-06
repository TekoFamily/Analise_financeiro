// Tela de Metas: permite ao usuário criar e acompanhar metas financeiras
import React, { useState } from "react";
import {
  Center,
  ScrollView,
  VStack,
  HStack,
  Box,
  Text,
  Input,
  InputField,
  Button,
  Image,
} from "@gluestack-ui/themed";
import { Alert } from "react-native";
import { useDespesas } from "../context/ExpensesContext";

// Tipo para representar uma meta financeira
// nome: nome da meta
// valor: valor objetivo
// prazo: prazo para atingir
// criadoEm: data de criação
// valorAtual: quanto já foi acumulado
//acho que isso só , se faltar algo coloco aqui



type Meta = {
  nome: string;
  valor: number;
  prazo: string;
  criadoEm: string;
  valorAtual: number;
};

// Componente principal da tela de metas
export function Profile() {
  // Estado para lista de metas
  const [metas, setMetas] = useState<Meta[]>([]);
  // Estado para inputs do formulário de nova meta
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState("");
  // Estado para modal de adicionar valor à meta
  const [modalVisible, setModalVisible] = useState(false);
  const [valorAdicionar, setValorAdicionar] = useState("");
  const [metaSelecionada, setMetaSelecionada] = useState<number | null>(null);
  // Hook do contexto de despesas para registrar gastos
  const { adicionarDespesa, despesas } = useDespesas();

  // Função para adicionar uma nova meta
  const adicionarMeta = () => {
    if (!nome || !valor || !prazo) return;
    const novaMeta: Meta = {
      nome,
      valor: Number(valor),
      prazo,
      criadoEm: new Date().toLocaleDateString(),
      valorAtual: 0,
    };
    setMetas([novaMeta, ...metas]);
    setNome("");
    setValor("");
    setPrazo("");
    Alert.alert("Sucesso", "Meta adicionada com sucesso!");
  };

  // Abre o modal para adicionar valor a uma meta específica
  const abrirModalAdicionarValor = (idx: number) => {
    setMetaSelecionada(idx);
    setValorAdicionar("");
    setModalVisible(true);
  };

  // Adiciona valor à meta selecionada e registra como gasto
  const adicionarValorNaMeta = () => {
    if (metaSelecionada === null || !valorAdicionar) return;
    const valorNum = Number(valorAdicionar);
    setMetas((prev) =>
      prev.map((meta, idx) =>
        idx === metaSelecionada
          ? { ...meta, valorAtual: meta.valorAtual + valorNum }
          : meta
      )
    );
    const meta = metas[metaSelecionada];
    adicionarDespesa({
      id: Date.now(),
      nome: meta.nome,
      valor: valorNum,
      data: new Date().toLocaleDateString(),
      icone: "🎯",
      descricao: `Valor usado na meta: ${meta.nome}`,
      tipo: "variavel", // Alterado para um valor permitido conforme definido em Despesa
    });
    setModalVisible(false);
    setValorAdicionar("");
    setMetaSelecionada(null);
    Alert.alert("Sucesso", "Valor adicionado à meta e registrado como gasto!");
  };

  // Renderização da tela
  return (
    <Center flex={1} bg="$gray100">
      {/* Modal para adicionar valor à meta */}
      {modalVisible && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="$black"
          opacity={0.7}
          zIndex={10}
          justifyContent="center"
          alignItems="center"
        >
          <Center bg="$white" p="$6" borderRadius="$lg">
            <Text fontSize="$md" mb="$2">Adicionar valor à meta</Text>
            <Input mb="$2">
              <InputField
                placeholder="Valor a adicionar"
                keyboardType="numeric"
                value={valorAdicionar}
                onChangeText={setValorAdicionar}
              />
            </Input>
            <HStack space="md">
              <Button bg="$green500" onPress={adicionarValorNaMeta}>
                <Text color="$white">Adicionar</Text>
              </Button>
              <Button bg="$gray500" onPress={() => setModalVisible(false)}>
                <Text color="$white">Cancelar</Text>
              </Button>
            </HStack>
          </Center>
        </Box>
      )}
      {/* Conteúdo principal da tela */}
      <ScrollView w="100%">
        <Center mt="$8" mb="$4">
          {/* Logo do app */}
          <Image
            source={require("@assets/logotko.png")}
            alt="Logo"
            w={100}
            h={100}
            resizeMode="contain"
          />
        </Center>
        <VStack space="md" p="$4" mt="$2">
          {/* Lista de metas cadastradas */}
          {metas.map((meta, idx) => {
            const progresso = meta.valorAtual / meta.valor;
            return (
              <Box
                key={idx}
                borderWidth={1}
                borderColor="$blue500"
                borderRadius="$md"
                bg="$white"
                p="$4"
                mb="$2"
              >
                <Text fontSize="$md" fontWeight="bold" color="$gray900">
                  {meta.nome}
                </Text>
                <Text fontSize="$sm" color="$gray700" mb="$1">
                  Prazo: {meta.prazo}
                </Text>
                <Text fontSize="$xs" color="$gray600" mb="$2">
                  Criado em: {meta.criadoEm}
                </Text>
                {/* Barra de progresso */}
                <Box
                  bg="$gray300"
                  h={4}
                  borderRadius="$full"
                  overflow="hidden"
                >
                  <Box
                    bg="$green500"
                    h="100%"
                    w={`${Math.round(progresso * 100)}%`}
                  />
                </Box>
                <HStack justifyContent="space-between" mt="$2">
                  <Text fontSize="$xs" color="$gray600">
                    {Math.round(progresso * 100)}% concluído
                  </Text>
                  <Text fontSize="$xs" color="$gray600">
                    R$ {meta.valorAtual} de R$ {meta.valor}
                  </Text>
                </HStack>
                {/* Botão para adicionar valor à meta */}
                <Button
                  mt="$2"
                  bg="$orange500"
                  onPress={() => abrirModalAdicionarValor(idx)}
                >
                  <Text color="$white">Adicionar valor</Text>
                </Button>
              </Box>
            );
          })}

          {/* Formulário para adicionar nova meta */}
          <Box bg="$white" borderRadius="$lg" p="$4">
            <Text fontSize="$lg" fontWeight="bold" color="$gray900" mb="$2">
              Adicionar meta
            </Text>
            <Input mb="$2">
              <InputField
                placeholder="Nome:"
                value={nome}
                onChangeText={setNome}
              />
            </Input>
            <Input mb="$2">
              <InputField
                placeholder="Valor necessário:"
                keyboardType="numeric"
                value={valor}
                onChangeText={setValor}
              />
            </Input>
            <Input mb="$2">
              <InputField
                placeholder="Prazo:"
                value={prazo}
                onChangeText={setPrazo}
              />
            </Input>
            <Button mt="$3" bg="$orange500" onPress={adicionarMeta}>
              <Text color="$white">Adicionar meta</Text>
            </Button>
          </Box>
        </VStack>
      </ScrollView>
    </Center>
  );
}
