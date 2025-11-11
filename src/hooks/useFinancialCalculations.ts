import { useMemo, useCallback } from "react";
import { useDespesas } from "../context/ExpensesContext";

export function useFinancialCalculations() {
  const { despesas, renda } = useDespesas();

  // Calcula total de gastos
  const gastosTotais = useMemo(() => {
    return despesas.reduce((sum, d) => sum + (d.valor || 0), 0);
  }, [despesas]);

  // Calcula saldo disponível
  const saldo = useMemo(() => {
    return (renda || 0) - gastosTotais;
  }, [renda, gastosTotais]);

  // Calcula gastos por categoria
  const gastosPorCategoria = useMemo(() => {
    const totals: { [key: string]: number } = {};
    despesas.forEach(d => {
      totals[d.nome] = (totals[d.nome] || 0) + d.valor;
    });
    return totals;
  }, [despesas]);

  // Filtra despesas por mês/ano - memoizada
  const getDespesasPorPeriodo = useCallback((mes: number, ano: number) => {
    return despesas.filter(d => {
      if (!d.data || typeof d.data !== 'string') return false;
      const parts = d.data.split('/');
      if (parts.length !== 3) return false;
      const mesDespesa = parseInt(parts[1], 10) - 1;
      const anoDespesa = parseInt(parts[2], 10);
      return mesDespesa === mes && anoDespesa === ano;
    });
  }, [despesas]);

  // Filtra despesas por ano - memoizada
  const getDespesasPorAno = useCallback((ano: number) => {
    return despesas.filter(d => {
      if (!d.data || typeof d.data !== 'string') return false;
      const parts = d.data.split('/');
      if (parts.length !== 3) return false;
      const anoDespesa = parseInt(parts[2], 10);
      return anoDespesa === ano;
    });
  }, [despesas]);

  // Calcula total de gastos filtrados por período - memoizada
  const getTotalGastosPorPeriodo = useCallback((mes: number, ano: number) => {
    const despesasFiltradas = getDespesasPorPeriodo(mes, ano);
    return despesasFiltradas.reduce((sum, d) => sum + d.valor, 0);
  }, [getDespesasPorPeriodo]);

  // Calcula gastos por tipo
  const gastosPorTipo = useMemo(() => {
    const fixos = despesas.filter(d => d.tipo === 'fixo').reduce((sum, d) => sum + d.valor, 0);
    const variaveis = despesas.filter(d => d.tipo === 'variavel').reduce((sum, d) => sum + d.valor, 0);
    return { fixos, variaveis };
  }, [despesas]);

  return {
    gastosTotais,
    saldo,
    gastosPorCategoria,
    getDespesasPorPeriodo,
    getDespesasPorAno,
    getTotalGastosPorPeriodo,
    gastosPorTipo,
  };
}

