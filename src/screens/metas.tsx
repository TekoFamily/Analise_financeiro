// Tela de Metas: permite ao usuário criar e acompanhar metas financeiras
import React, { useState, useEffect } from "react";
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
  Pressable,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Icon,
  Progress,
  ProgressFilledTrack,
} from "@gluestack-ui/themed";
import { Alert, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDespesas } from "../context/ExpensesContext";
import { CalendarDays as CalendarIcon, X } from "lucide-react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

// Tipo para representar uma meta financeira
type Meta = {
  id: string;
  nome: string;
  valor: number; // Valor em reais (número)
  prazo: Date; // Data do prazo (tipo Date)
  criadoEm: Date; // Data de criação (tipo Date)
  valorAtual: number; // Valor acumulado em reais (número)
  categoria: string; // Categoria da meta
};

// Componente principal da tela de metas
export function Metas() {
  // Estado para lista de metas
  const [metas, setMetas] = useState<Meta[]>([]);
  // Estado para inputs do formulário de nova meta
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState<Date | null>(null);
  const [categoria, setCategoria] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false); // ✅ NOVO: Controle do DatePicker
  
  // Estado para modal de adicionar valor à meta
  const [modalVisible, setModalVisible] = useState(false);
  const [valorAdicionar, setValorAdicionar] = useState("");
  const [metaSelecionada, setMetaSelecionada] = useState<string | null>(null);
  
  // Hook do contexto de despesas para registrar gastos
  const { adicionarDespesa } = useDespesas();

  // Carregar metas salvas ao iniciar
  useEffect(() => {
    const carregarMetas = async () => {
      try {
        const metasSalvas = await AsyncStorage.getItem('@metas');
        if (metasSalvas) {
          const metasParsed = JSON.parse(metasSalvas);
          // Converter strings de data para objetos Date
          const metasConvertidas = metasParsed.map((meta: any) => ({
            ...meta,
            prazo: new Date(meta.prazo),
            criadoEm: new Date(meta.criadoEm),
          }));
          setMetas(metasConvertidas);
        }
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
      }
    };
    
    carregarMetas();
  }, []);

  // Salvar metas sempre que houver mudanças
  useEffect(() => {
    const salvarMetas = async () => {
      try {
        await AsyncStorage.setItem('@metas', JSON.stringify(metas));
      } catch (error) {
        console.error('Erro ao salvar metas:', error);
      }
    };
    
    if (metas.length > 0) {
      salvarMetas();
    }
  }, [metas]);

  // Função para formatar valor monetário
  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para formatar data
  const formatarData = (data: Date): string => {
    return data.toLocaleDateString('pt-BR');
  };

  // Função para validar e formatar entrada de valor
  const handleValorChange = (text: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const valorLimpo = text.replace(/[^0-9.,]/g, '');
    setValor(valorLimpo);
  };

  // ✅ NOVO: Função para lidar com mudança de data
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    if (selectedDate) {
      setPrazo(selectedDate);
      setShowDatePicker(false);
    }
  };

  // Função para abrir DatePicker
  const abrirDatePicker = () => {
    setShowDatePicker(true);
  };

  // Função para adicionar uma nova meta
  const adicionarMeta = () => {
    if (!nome.trim() || !valor || !prazo || !categoria.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }

    // Converter valor para número
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert("Erro", "Digite um valor válido maior que zero!");
      return;
    }

    const novaMeta: Meta = {
      id: Date.now().toString(),
      nome: nome.trim(),
      valor: valorNumerico,
      prazo,
      criadoEm: new Date(),
      valorAtual: 0,
      categoria: categoria.trim(),
    };

    setMetas([novaMeta, ...metas]);
    // Limpar formulário
    setNome("");
    setValor("");
    setPrazo(null);
    setCategoria("");
    
    Alert.alert("Sucesso", "Meta adicionada com sucesso!");
  };

  // Abre o modal para adicionar valor a uma meta específica
  const abrirModalAdicionarValor = (metaId: string) => {
    setMetaSelecionada(metaId);
    setValorAdicionar("");
    setModalVisible(true);
  };

  // Adiciona valor à meta selecionada e registra como gasto
  const adicionarValorNaMeta = () => {
    if (!metaSelecionada || !valorAdicionar) return;

    const valorNum = parseFloat(valorAdicionar.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) {
      Alert.alert("Erro", "Digite um valor válido!");
      return;
    }

    const meta = metas.find(m => m.id === metaSelecionada);
    if (!meta) return;

    // Verificar se não excede o valor da meta
    if (meta.valorAtual + valorNum > meta.valor) {
      Alert.alert("Aviso", "O valor adicionado excederá a meta. Deseja continuar?", [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Continuar", 
          onPress: () => confirmarAdicaoValor(meta, valorNum) 
        }
      ]);
      return;
    }

    confirmarAdicaoValor(meta, valorNum);
  };

  const confirmarAdicaoValor = (meta: Meta, valorNum: number) => {
    setMetas(prev => 
      prev.map(m => 
        m.id === metaSelecionada 
          ? { ...m, valorAtual: m.valorAtual + valorNum }
          : m
      )
    );

    // Registrar como gasto
    adicionarDespesa({
      id: Date.now(),
      nome: `Meta: ${meta.nome}`,
      valor: valorNum,
      data: new Date().toLocaleDateString('pt-BR'),
      icone: "🎯",
      descricao: `Valor adicionado à meta: ${meta.nome}`,
      tipo: "variavel",
    });

    setModalVisible(false);
    setValorAdicionar("");
    setMetaSelecionada(null);
    
    Alert.alert("Sucesso", "Valor adicionado à meta e registrado como gasto!");
  };

  // Função para excluir uma meta
  const excluirMeta = (metaId: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta meta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: () => {
            setMetas(prev => prev.filter(m => m.id !== metaId));
            Alert.alert("Sucesso", "Meta excluída!");
          }
        }
      ]
    );
  };

  // Renderização da tela
  return (
    // ✅ NOVO: KeyboardAvoidingView para scroll quando teclado aparece
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Center flex={1} bg="$gray100">
        {/* Modal para adicionar valor à meta */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Text fontSize="$lg" fontWeight="bold">Adicionar valor à meta</Text>
              <ModalCloseButton>
                <Icon as={X} size="md" />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Input>
                <InputField
                  placeholder="Valor a adicionar (ex: 150,50)"
                  keyboardType="numeric"
                  value={valorAdicionar}
                  onChangeText={(text) => {
                    const valorLimpo = text.replace(/[^0-9.,]/g, '');
                    setValorAdicionar(valorLimpo);
                  }}
                />
              </Input>
            </ModalBody>
            <ModalFooter>
              <HStack space="md">
                <Button 
                  bg="$gray400" 
                  onPress={() => setModalVisible(false)}
                  flex={1}
                >
                  <Text color="$white">Cancelar</Text>
                </Button>
                <Button 
                  bg="$green600" 
                  onPress={adicionarValorNaMeta}
                  flex={1}
                >
                  <Text color="$white">Adicionar</Text>
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* ✅ NOVO: DatePicker para seleção de data */}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={prazo || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()} // Não permite datas passadas
          />
        )}

        {/* Conteúdo principal da tela */}
        <ScrollView 
          w="100%" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // ✅ NOVO: Permite tocar nos campos mesmo com teclado
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} // ✅ NOVO: Espaço extra no final
        >
          <Center mt="$8" mb="$4">
            {/* Logo do app */}
            <Image
              source={require("@assets/logotko.png")}
              alt="Logo"
              w={100}
              h={100}
              resizeMode="contain"
            />
            <Text fontSize="$xl" fontWeight="bold" color="$orange600" mt="$2">
              Minhas Metas
            </Text>
          </Center>

          <VStack space="md" p="$4" pb="$8">
            {/* Lista de metas cadastradas */}
            {metas.length === 0 ? (
              <Box bg="$white" borderRadius="$lg" p="$6" alignItems="center">
                <Text fontSize="$md" color="$gray600" textAlign="center">
                  Você ainda não tem metas cadastradas.
                </Text>
                <Text fontSize="$sm" color="$gray500" textAlign="center" mt="$2">
                  Crie sua primeira meta abaixo!
                </Text>
              </Box>
            ) : (
              metas.map((meta) => {
                const progresso = meta.valor > 0 ? (meta.valorAtual / meta.valor) * 100 : 0;
                const diasRestantes = Math.ceil((meta.prazo.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const prazoExpirado = diasRestantes < 0;
                
                return (
                  <Box
                    key={meta.id}
                    borderWidth={1}
                    borderColor={prazoExpirado ? "$red400" : "$blue500"}
                    borderRadius="$lg"
                    bg="$white"
                    p="$4"
                    shadowColor="$black"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={4}
                    elevation={3}
                  >
                    <VStack space="sm">
                      <HStack justifyContent="space-between" alignItems="flex-start">
                        <VStack flex={1}>
                          <Text fontSize="$lg" fontWeight="bold" color="$gray900">
                            {meta.nome}
                          </Text>
                          <Text fontSize="$sm" color="$gray600">
                            📂 {meta.categoria}
                          </Text>
                        </VStack>
                        <Pressable onPress={() => excluirMeta(meta.id)} p="$1">
                          <Icon as={X} size="md" color="$red600" />
                        </Pressable>
                      </HStack>

                      <HStack justifyContent="space-between" alignItems="center">
                        <Text fontSize="$sm" color="$gray700">
                          ⏰ Prazo: {formatarData(meta.prazo)}
                        </Text>
                        <Text 
                          fontSize="$sm" 
                          color={prazoExpirado ? "$red600" : "$green600"}
                          fontWeight="bold"
                        >
                          {prazoExpirado ? `${Math.abs(diasRestantes)} dias atrasado` : `${diasRestantes} dias restantes`}
                        </Text>
                      </HStack>

                      <Text fontSize="$xs" color="$gray500">
                        Criado em: {formatarData(meta.criadoEm)}
                      </Text>

                      {/* Barra de progresso */}
                      <VStack space="xs">
                        <Progress value={Math.min(progresso, 100)} size="md">
                          <ProgressFilledTrack bg={progresso >= 100 ? "$green600" : "$orange600"} />
                        </Progress>
                        <HStack justifyContent="space-between">
                          <Text fontSize="$xs" color="$gray600">
                            {progresso.toFixed(1)}% concluído
                          </Text>
                          <Text fontSize="$xs" color="$gray600">
                            {formatarMoeda(meta.valorAtual)} / {formatarMoeda(meta.valor)}
                          </Text>
                        </HStack>
                      </VStack>

                      {/* Status da meta */}
                      <Box 
                        bg={progresso >= 100 ? "$green100" : prazoExpirado ? "$red100" : "$orange100"}
                        borderRadius="$md"
                        p="$2"
                      >
                        <Text 
                          fontSize="$sm" 
                          fontWeight="bold"
                          color={progresso >= 100 ? "$green700" : prazoExpirado ? "$red700" : "$orange700"}
                          textAlign="center"
                        >
                          {progresso >= 100 ? "🎉 Meta alcançada!" : 
                           prazoExpirado ? "⚠️ Prazo expirado" : 
                           "📈 Em andamento"}
                        </Text>
                      </Box>

                      {/* Botão para adicionar valor à meta */}
                      <Button
                        mt="$2"
                        bg="$orange600"
                        onPress={() => abrirModalAdicionarValor(meta.id)}
                        isDisabled={progresso >= 100}
                      >
                        <Text color="$white">
                          {progresso >= 100 ? "Meta concluída" : "Adicionar valor"}
                        </Text>
                      </Button>
                    </VStack>
                  </Box>
                );
              })
            )}

            {/* Formulário para adicionar nova meta */}
            <Box bg="$white" borderRadius="$lg" p="$4" shadowColor="$black" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.1} shadowRadius={4} elevation={3}>
              <Text fontSize="$lg" fontWeight="bold" color="$gray900" mb="$4">
                ➕ Nova Meta
              </Text>
              
              <VStack space="md">
                <Input>
                  <InputField
                    placeholder="Nome da meta"
                    value={nome}
                    onChangeText={setNome}
                  />
                </Input>

                <Input>
                  <InputField
                    placeholder="Categoria (ex: Viagem, Carro, Casa)"
                    value={categoria}
                    onChangeText={setCategoria}
                  />
                </Input>

                <Input>
                  <InputField
                    placeholder="Valor necessário (ex: 2500,50)"
                    keyboardType="numeric"
                    value={valor}
                    onChangeText={handleValorChange}
                  />
                </Input>

                {/* ✅ CORRIGIDO: DatePicker real ao invés de data automática */}
                <Pressable 
                  onPress={abrirDatePicker}
                  bg="$gray200"
                  p="$3"
                  borderRadius="$md"
                >
                  <HStack alignItems="center" space="sm">
                    <Icon as={CalendarIcon} size="sm" color="$gray600" />
                    <Text color={prazo ? "$gray900" : "$gray500"}>
                      {prazo ? `Prazo: ${formatarData(prazo)}` : "Selecionar prazo"}
                    </Text>
                  </HStack>
                </Pressable>

                <Button 
                  mt="$2" 
                  bg="$orange600" 
                  onPress={adicionarMeta}
                  isDisabled={!nome.trim() || !valor || !prazo || !categoria.trim()}
                >
                  <Text color="$white">Criar Meta</Text>
                </Button>
              </VStack>
            </Box>
          </VStack>
        </ScrollView>
      </Center>
    </KeyboardAvoidingView>
  );
}