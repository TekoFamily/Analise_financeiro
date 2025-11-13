import React, { useState, useMemo } from "react";
import {
  Center,
  Text,
  Box,
  HStack,
  VStack,
  ScrollView,
  Pressable,
  Icon,
} from "@gluestack-ui/themed";
import { Platform } from "react-native";
import { CalendarDays as CalendarDaysIcon } from "lucide-react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useDespesas } from "../../context/ExpensesContext";
import { useFinancialCalculations } from "../../hooks/useFinancialCalculations";

interface CategoriaData {
  name: string;
  percentage: number;
  color: string;
  value: number;
}

// Função utilitária para cor da barra
const getDynamicColor = (percentage: number): string => {
  if (percentage <= 5) return "#FEF3C7";
  if (percentage <= 15) return "#FDBA74";
  if (percentage <= 30) return "#FB923C";
  if (percentage <= 50) return "#F97316";
  if (percentage <= 75) return "#EA580C";
  return "#DC2626";
};

// Função para calcular altura da barra
const calculateBarHeight = (
  value: number,
  percentage: number,
  renda: number,
  maxExpense: number,
  MAX_BAR_HEIGHT: number,
  MIN_BAR_HEIGHT: number,
  EXP_FACTOR: number,
) => {
  if (value > 0 && renda > 0 && percentage >= 0) {
    const powered = Math.pow(percentage / 100, EXP_FACTOR);
    return Math.max(
      MIN_BAR_HEIGHT,
      Math.min(MAX_BAR_HEIGHT, MAX_BAR_HEIGHT * powered),
    );
  } else if (value > 0) {
    const powered = Math.pow(Math.max(0, value / maxExpense), EXP_FACTOR);
    return Math.max(
      MIN_BAR_HEIGHT,
      Math.min(MAX_BAR_HEIGHT, MAX_BAR_HEIGHT * powered),
    );
  }
  return 0;
};

export function ResumoDoMes() {
  const { renda } = useDespesas();
  const { getDespesasPorPeriodo, getTotalGastosPorPeriodo } =
    useFinancialCalculations();
  const [currentFilterDate, setCurrentFilterDate] = useState(new Date());
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  const MAX_BAR_HEIGHT = 120;
  const MIN_BAR_HEIGHT = 8;
  const EXP_FACTOR = 1.2;

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowMonthYearPicker(Platform.OS === "ios");
    if (event.type === "dismissed") {
      setShowMonthYearPicker(false);
      return;
    }
    if (selectedDate) setCurrentFilterDate(selectedDate);
    if (Platform.OS !== "ios") setShowMonthYearPicker(false);
  };

  const formattedMonthYear = useMemo(
    () =>
      currentFilterDate.toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
      }),
    [currentFilterDate],
  );

  // Obtém despesas e totais do período selecionado
  const mes = useMemo(() => currentFilterDate.getMonth(), [currentFilterDate]);
  const ano = useMemo(
    () => currentFilterDate.getFullYear(),
    [currentFilterDate],
  );

  const filteredDespesas = useMemo(() => {
    return getDespesasPorPeriodo(mes, ano);
  }, [getDespesasPorPeriodo, mes, ano]);

  const totalGastos = useMemo(() => {
    return getTotalGastosPorPeriodo(mes, ano);
  }, [getTotalGastosPorPeriodo, mes, ano]);

  // Soma por categoria
  const totalPorCategoria = useMemo(() => {
    const totals: { [key: string]: number } = {};
    filteredDespesas.forEach((d: any) => {
      totals[d.nome] = (totals[d.nome] || 0) + d.valor;
    });
    return totals;
  }, [filteredDespesas]);

  const categoriasData: CategoriaData[] = useMemo(
    () =>
      Object.keys(totalPorCategoria).map((cat) => {
        const value = totalPorCategoria[cat];
        const percentage = renda > 0 ? Math.round((value / renda) * 100) : 0;
        return {
          name: cat,
          percentage,
          value,
          color: getDynamicColor(percentage),
        };
      }),
    [totalPorCategoria, renda],
  );

  const maxExpense = useMemo(() => {
    const vals = categoriasData.map((c) => c.value).filter((v) => v > 0);
    return vals.length > 0 ? Math.max(...vals) : 1;
  }, [categoriasData]);

  return (
    <Center w="100%" mb="$4">
      <Box w="100%" bg="$orange100" p="$4" rounded="$lg">
        <HStack justifyContent="space-between" alignItems="center" mb="$4">
          <Text color="$black" fontWeight="bold">
            Resumo de {formattedMonthYear}
          </Text>
          <Pressable onPress={() => setShowMonthYearPicker(true)} ml="$2">
            <Icon as={CalendarDaysIcon} size="lg" color="$black" />
          </Pressable>
        </HStack>

        {showMonthYearPicker && (
          <DateTimePicker
            testID="monthYearPicker"
            value={currentFilterDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack>
            {categoriasData.length === 0 || totalGastos === 0 ? (
              <Text color="$gray600">
                Nenhum gasto registrado para {formattedMonthYear}.
              </Text>
            ) : (
              categoriasData.map((item, idx) => (
                <VStack
                  key={item.name}
                  alignItems="center"
                  minWidth={80}
                  py="$2"
                  justifyContent="flex-end"
                  height={MAX_BAR_HEIGHT + 70}
                  ml={idx > 0 ? 8 : 0}
                >
                  <Text
                    color="$black"
                    fontSize="$xs"
                    numberOfLines={1}
                    textAlign="center"
                  >
                    {item.name}
                  </Text>
                  <Text color="$gray700" fontSize="$xs" textAlign="center">
                    R${item.value.toFixed(2)}
                  </Text>
                  <Text color="$gray700" fontSize="$xs" textAlign="center">
                    ({item.percentage}%)
                  </Text>
                  <Box
                    height={calculateBarHeight(
                      item.value,
                      item.percentage,
                      renda,
                      maxExpense,
                      MAX_BAR_HEIGHT,
                      MIN_BAR_HEIGHT,
                      EXP_FACTOR,
                    )}
                    width={40}
                    bg={item.color}
                    rounded="$sm"
                  />
                </VStack>
              ))
            )}
          </HStack>
        </ScrollView>
      </Box>
    </Center>
  );
}
