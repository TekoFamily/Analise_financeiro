import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  VStack,
  Text,
  Input,
  InputField,
  Button,
  HStack,
  Box,
  Pressable,
} from "@gluestack-ui/themed";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

// Interface que define as propriedades que o componente deve receber
// categorias: array de strings com as categorias disponíveis
// onSalvar: função callback que será chamada quando um gasto for salvo
interface AdicionarGastoFormProps {
  categorias: string[];
  onSalvar: (gasto: {
    valor: string;
    categoria: string;
    data: string;
    descricao: string;
    tipo: 'fixo' | 'variavel' | '';
  }) => void;
}

// Componente principal do formulário de adição de gastos
export function AdicionarGastoForm({
  categorias,
  onSalvar,
}: AdicionarGastoFormProps) {
  // Estados para controlar os valores dos campos do formulário
  const [valor, setValor] = useState("");
  const [valorDisplay, setValorDisplay] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  // Estado para categorias customizadas
  const [categoriasCustom, setCategoriasCustom] = useState<string[]>([]);
  // Estado para mostrar input de nova categoria
  const [adicionandoCategoria, setAdicionandoCategoria] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");
  // Estado para tipo de gasto
  const [tipo, setTipo] = useState<'fixo' | 'variavel' | ''>('');

  // Date picker state
  const [actualDate, setActualDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dataDisplay, setDataDisplay] = useState("DD/MM/AAAA"); // For displaying selected date

  // Currency formatting functions
  const formatCurrency = (rawValue: string) => {
    if (!rawValue) return "";
    // First, parse the cleaned string to a number, then divide
    const numericValueInput = parseFloat(rawValue.replace(/[^\d]/g, ''));
    if (isNaN(numericValueInput)) return ""; // if input is not a number after cleaning

    const numericValue = (numericValueInput / 100).toFixed(2);
    // numericValue is now a string like "123.45"
    const [integerPart, decimalPart] = numericValue.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${formattedInteger},${decimalPart}`;
  };

  const parseCurrency = (formattedValue: string) => {
    if (!formattedValue) return "";
    return formattedValue.replace(/[^\d,]/g, '').replace(',', '.'); // Keep only digits and comma, then replace comma with dot
  };
  
  const handleValorChange = (text: string) => {
    const rawValue = text.replace(/[^\d]/g, ''); // Remove non-digits
    setValor(rawValue); // Store the raw numeric string
    if (rawValue) {
      const num = parseFloat(rawValue) / 100;
      setValorDisplay(`R$ ${num.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`);
    } else {
      setValorDisplay('');
    }
  };

  // Handle date selection
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS until dismissed
    if (event.type === 'dismissed') {
        setShowDatePicker(false);
        return;
    }
    if (selectedDate) {
      const currentDate = selectedDate || actualDate;
      setActualDate(currentDate);
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      setDataDisplay(`${day}/${month}/${year}`);
    }
    // For Android, picker is hidden after selection automatically
    if (Platform.OS !== 'ios') {
        setShowDatePicker(false);
    }
  };

  const showMode = () => {
    setShowDatePicker(true);
  };
  
  // Função que lida com o salvamento dos dados
  // Valida se todos os campos estão preenchidos antes de salvar
  const handleSalvar = () => {
    const valorNumerico = parseCurrency(valorDisplay); // Parse the display value for saving
    if (!valorNumerico || !categoria || dataDisplay === "DD/MM/AAAA" || !descricao || !tipo) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }
    // Chama a função onSalvar passada via props com os dados do formulário
    onSalvar({ valor: valorNumerico, categoria, data: dataDisplay, descricao, tipo });
    // Limpa os campos após salvar
    setValor("");
    setValorDisplay(""); // Clear display value
    setCategoria("");
    setDataDisplay("DD/MM/AAAA");
    setActualDate(new Date());
    setDescricao("");
    setTipo('');
  };

  // Função para limpar todos os campos do formulário
  const handleCancelar = () => {
    setValor("");
    setValorDisplay(""); // Clear display value
    setCategoria("");
    setDataDisplay("DD/MM/AAAA");
    setActualDate(new Date());
    setDescricao("");
    setTipo('');
  };

  // Função para adicionar nova categoria
  const handleAdicionarCategoria = () => {
    if (novaCategoria.trim() && !categoriasCustom.includes(novaCategoria.trim())) {
      setCategoriasCustom([...categoriasCustom, novaCategoria.trim()]);
      setCategoria(novaCategoria.trim().toLowerCase());
      setNovaCategoria("");
      setAdicionandoCategoria(false);
    }
  };

  // Renderização do formulário
  return (
    <VStack space="sm">
      {/* Campo para inserir o valor do gasto */}
      <Text fontSize="$sm" color="$gray700">
        Valor:
      </Text>
      <Input bg="$gray100">
        <InputField
          placeholder="R$ 0,00"
          keyboardType="numeric"
          value={valorDisplay}
          onChangeText={handleValorChange}
          placeholderTextColor="$gray400"
        />
      </Input>
      {/* Campo de seleção de categoria usando Picker nativo */}
      <Text fontSize="$sm" color="$gray700">
        Categoria:
      </Text>
      <Box
        // envolvemos o Picker num Box para poder estilizar fundo/padding
        bg="$gray100"
        borderRadius="$sm"
        overflow="hidden"
      >
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
        >
          <Picker.Item label="Selecione a categoria" value="" />
          {[...categorias, ...categoriasCustom].map((cat) => (
            <Picker.Item
              key={cat}
              label={cat}
              value={cat.toLowerCase()}
            />
          ))}
        </Picker>
      </Box>
      {/* Botão para adicionar nova categoria */}
      {!adicionandoCategoria ? (
        <Button mt="$2" bg="$orange500" onPress={() => setAdicionandoCategoria(true)}>
          <Text color="$white">Adicionar nova categoria</Text>
        </Button>
      ) : (
        <HStack space="sm" mt="$2" alignItems="center">
          <Input flex={2} bg="$gray100">
            <InputField
              placeholder="Nova categoria"
              value={novaCategoria}
              onChangeText={setNovaCategoria}
            />
          </Input>
          <Button flex={1} bg="$green500" onPress={handleAdicionarCategoria}>
            <Text color="$white">Salvar</Text>
          </Button>
          <Button flex={1} bg="$gray400" onPress={() => { setAdicionandoCategoria(false); setNovaCategoria(""); }}>
            <Text color="$white">Cancelar</Text>
          </Button>
        </HStack>
      )}
      {/* Campo para selecionar tipo de gasto */}
      <Text fontSize="$sm" color="$gray700" mt="$2">
        Tipo de gasto:
      </Text>
      <HStack space="md" mb="$2">
        <Button
          flex={1}
          bg={tipo === 'fixo' ? "$orange500" : "$gray200"}
          onPress={() => setTipo('fixo')}
        >
          <Text color={tipo === 'fixo' ? "$white" : "$gray900"}>Fixo</Text>
        </Button>
        <Button
          flex={1}
          bg={tipo === 'variavel' ? "$orange500" : "$gray200"}
          onPress={() => setTipo('variavel')}
        >
          <Text color={tipo === 'variavel' ? "$white" : "$gray900"}>Variável</Text>
        </Button>
      </HStack>
      {/* Campo para inserir a data do gasto */}
      <Text fontSize="$sm" color="$gray700">
        Data:
      </Text>
      <Pressable onPress={showMode} bg="$gray100" p="$3" borderRadius="$sm">
        <Text color={dataDisplay === "DD/MM/AAAA" ? "$gray400" : "$black"}>
          {dataDisplay}
        </Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={actualDate}
          mode={'date'}
          display="default"
          onChange={onDateChange}
        />
      )}
      {/* Campo para inserir a descrição do gasto */}
      <Text fontSize="$sm" color="$gray700">
        Descrição:
      </Text>
      <Input bg="$gray100">
        <InputField
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          placeholderTextColor="$gray400"
        />
      </Input>
      {/* Botões de ação do formulário */}
      <HStack space="sm" mt="$4">
        {/* Botão Salvar - Cor laranja com efeito de pressionar */}
        <Button
          flex={1}
          bg="$orange500"
          $pressed={{ bg: "$orange600" }}
          onPress={handleSalvar}
        >
          <Text color="$white" fontWeight="bold">
            Salvar
          </Text>
        </Button>
        {/* Botão Cancelar - Cor cinza com efeito de pressionar */}
        <Button
          flex={1}
          bg="$gray400"
          $pressed={{ bg: "$gray500" }}
          onPress={handleCancelar}
        >
          <Text color="$white" fontWeight="bold">
            Cancelar
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
