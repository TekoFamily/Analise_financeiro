import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface que define o formato de uma despesa
export interface Despesa {
  id: number; // Identificador único da despesa
  nome: string; // Nome da despesa
  valor: number; // Valor da despesa
  data: string; // Data da despesa
  icone: string; // Ícone associado à despesa
  descricao: string; // Descrição detalhada da despesa
  tipo: 'fixo' | 'variavel'; // Tipo da despesa
}

// Interface que define o formato do contexto das despesas
interface DespesasContextType {
  despesas: Despesa[]; // Lista de despesas
  adicionarDespesa: (despesa: Despesa) => void; // Função para adicionar uma nova despesa
  criarDespesa: (dados: {
    valor: string;
    categoria: string;
    data: string;
    descricao: string;
    tipo: 'fixo' | 'variavel';
  }) => void; // Função para criar despesa a partir dos dados do formulário
  renda: number; // Valor da renda total
  setRenda: (valor: number) => void; // Função para atualizar a renda
  limparDados: () => Promise<void>; // Função para limpar todos os dados de despesas
  categorias: string[]; // Lista de categorias disponíveis
}

// Cria o contexto das despesas, inicialmente indefinido
const DespesasContext = createContext<DespesasContextType | undefined>(undefined);

// Componente provedor do contexto das despesas
export function DespesasProvider({ children }: { children: React.ReactNode }) {
  // Estado para armazenar a lista de despesas
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  // Estado para armazenar o valor da renda
  const [renda, setRenda] = useState<number>(0);
  // Flag para evitar salvar durante o carregamento inicial
  const isInitialMount = useRef(true);

  // Carregar despesas e renda ao iniciar o app
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedDespesas = await AsyncStorage.getItem("despesas");
        if (savedDespesas) {
          let parsed = [];
          try {
            parsed = JSON.parse(savedDespesas);
            if (!Array.isArray(parsed)) parsed = [];
          } catch (e) {
            parsed = [];
          }
          setDespesas(parsed);
        }
        const savedRenda = await AsyncStorage.getItem("renda");
        if (savedRenda) {
          const rendaNum = Number(savedRenda);
          setRenda(isNaN(rendaNum) ? 0 : rendaNum);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
        setDespesas([]);
        setRenda(0);
      } finally {
        // Marca que o carregamento inicial terminou
        isInitialMount.current = false;
      }
    };
    loadData();
  }, []);

  // Salvar despesas sempre que mudar (mas não durante o carregamento inicial)
  useEffect(() => {
    // Não salva durante o carregamento inicial para evitar loops
    if (isInitialMount.current) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem("despesas", JSON.stringify(despesas));
      } catch (error) {
        console.error("Erro ao salvar despesas:", error);
      }
    };
    saveData();
  }, [despesas]);

  // Salvar renda sempre que mudar (mas não durante o carregamento inicial)
  useEffect(() => {
    // Não salva durante o carregamento inicial para evitar loops
    if (isInitialMount.current) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem("renda", renda.toString());
      } catch (error) {
        console.error("Erro ao salvar renda:", error);
      }
    };
    saveData();
  }, [renda]);

  // Lista de categorias padrão - memoizada para evitar recriação
  const categorias = useMemo(() => ["Mercado", "Lazer", "Transporte"], []);

  // Função para obter ícone da categoria - memoizada
  const getIconForCategory = useCallback((categoria: string): string => {
    const categoriaLower = categoria.toLowerCase();
    if (categoriaLower === "mercado") return "🛒";
    if (categoriaLower === "lazer") return "🎉";
    if (categoriaLower === "transporte") return "🚗";
    return "💰";
  }, []);

  // Função para adicionar uma nova despesa à lista - memoizada
  const adicionarDespesa = useCallback((despesa: Despesa) => {
    setDespesas((prev) => [despesa, ...prev]);
  }, []);

  // Função para criar despesa a partir dos dados do formulário - memoizada
  const criarDespesa = useCallback((dados: {
    valor: string;
    categoria: string;
    data: string;
    descricao: string;
    tipo: 'fixo' | 'variavel';
  }) => {
    const novaDespesa: Despesa = {
      id: Date.now(),
      nome: dados.categoria.charAt(0).toUpperCase() + dados.categoria.slice(1),
      valor: parseFloat(dados.valor.replace(",", ".")),
      data: dados.data,
      icone: getIconForCategory(dados.categoria),
      descricao: dados.descricao,
      tipo: dados.tipo,
    };
    adicionarDespesa(novaDespesa);
  }, [adicionarDespesa, getIconForCategory]);

  // Função para limpar todos os dados de despesas e renda - memoizada
  const limparDados = useCallback(async () => {
    await AsyncStorage.removeItem("despesas");
    await AsyncStorage.removeItem("renda");
    setDespesas([]);
    setRenda(0);
  }, []);

  // Memoizar o setRenda para evitar recriações
  const setRendaMemo = useCallback((valor: number) => {
    setRenda(valor);
  }, []);





  
  // Memoizar o valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(() => ({
    despesas,
    adicionarDespesa,
    criarDespesa,
    renda,
    setRenda: setRendaMemo,
    limparDados,
    categorias,
  }), [despesas, adicionarDespesa, criarDespesa, renda, setRendaMemo, limparDados, categorias]);

  // Retorna o provedor do contexto, disponibilizando os valores e funções para os componentes filhos
  return (
    <DespesasContext.Provider value={contextValue}>
      {children}
    </DespesasContext.Provider>
  );
}

// Hook personalizado para acessar o contexto das despesas
export function useDespesas() {
  const context = useContext(DespesasContext);
  // Garante que o hook seja usado dentro do provedor
  if (!context) throw new Error("useDespesas deve ser usado dentro do DespesasProvider");
  return context;
}