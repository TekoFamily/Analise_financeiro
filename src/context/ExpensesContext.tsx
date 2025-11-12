// src/context/ExpensesContext.tsx
// 📦 Pasta: src/context
// Responsável por: Contexto global de despesas (criação, listagem, persistência e limpeza)
// Observações: Usa AsyncStorage para persistir dados; expõe hook useDespesas.
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface que define o formato de uma despesa

export interface Despesa {
  id: number; // Identificador único da despesa
  nome: string; // Nome da despesa
  valor: number; // Valor da despesa
  data: string; // Data da despesa
  icone: string; // Ícone associado à despesa
  descricao: string; // Descrição detalhada da despesa
  tipo: "fixo" | "variavel"; // Tipo da despesa
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
    tipo: "fixo" | "variavel";
  }) => void; // Função para criar despesa a partir dos dados do formulário
  renda: number; // Valor da renda total
  setRenda: (valor: number) => void; // Função para atualizar a renda
  limparDados: () => Promise<void>; // Função para limpar todos os dados de despesas
  categorias: string[]; // Lista de categorias disponíveis
}

// Cria o contexto das despesas, inicialmente indefinido
const DespesasContext = createContext<DespesasContextType | undefined>(
  undefined,
);

// Função auxiliar para validar se uma despesa é válida
function isValidDespesa(despesa: any): despesa is Despesa {
  return (
    despesa &&
    typeof despesa === "object" &&
    typeof despesa.id === "number" &&
    typeof despesa.nome === "string" &&
    typeof despesa.valor === "number" &&
    !isNaN(despesa.valor) &&
    typeof despesa.data === "string" &&
    typeof despesa.icone === "string" &&
    typeof despesa.descricao === "string" &&
    (despesa.tipo === "fixo" || despesa.tipo === "variavel")
  );
}

// Função auxiliar para validar array de despesas
function validateDespesas(data: any): Despesa[] {
  if (!Array.isArray(data)) {
    console.warn("Dados de despesas não são um array, retornando array vazio");
    return [];
  }

  const validDespesas = data.filter((despesa) => {
    const isValid = isValidDespesa(despesa);
    if (!isValid) {
      console.warn("Despesa inválida encontrada, ignorando:", despesa);
    }
    return isValid;
  });

  return validDespesas;
}

// Componente provedor do contexto das despesas
export function DespesasProvider({ children }: { children: React.ReactNode }) {
  // Estado para armazenar a lista de despesas
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  // Estado para armazenar o valor da renda
  const [renda, setRenda] = useState<number>(0);
  // Flag para evitar salvar durante o carregamento inicial
  const isInitialMount = useRef(true);
  // Flag para verificar se o componente está montado
  const isMounted = useRef(true);

  // Carregar despesas e renda ao iniciar o app
  useEffect(() => {
    let isSubscribed = true;

    const loadData = async () => {
      try {
        // Carregar despesas
        const savedDespesas = await AsyncStorage.getItem("despesas");
        if (savedDespesas && isSubscribed && isMounted.current) {
          try {
            const parsed = JSON.parse(savedDespesas);
            const validatedDespesas = validateDespesas(parsed);
            setDespesas(validatedDespesas);
          } catch (parseError) {
            console.error("Erro ao fazer parse das despesas:", parseError);
            // Em caso de erro de parse, limpa os dados corrompidos
            await AsyncStorage.removeItem("despesas");
            setDespesas([]);
          }
        }

        // Carregar renda
        const savedRenda = await AsyncStorage.getItem("renda");
        if (savedRenda && isSubscribed && isMounted.current) {
          try {
            const rendaNum = Number(savedRenda);
            if (!isNaN(rendaNum) && rendaNum >= 0) {
              setRenda(rendaNum);
            } else {
              console.warn("Valor de renda inválido, usando 0");
              setRenda(0);
            }
          } catch (parseError) {
            console.error("Erro ao processar renda:", parseError);
            setRenda(0);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
        if (isSubscribed && isMounted.current) {
          setDespesas([]);
          setRenda(0);
        }
      } finally {
        if (isSubscribed && isMounted.current) {
          // Marca que o carregamento inicial terminou
          isInitialMount.current = false;
        }
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Salvar despesas sempre que mudar (mas não durante o carregamento inicial)
  useEffect(() => {
    // Não salva durante o carregamento inicial para evitar loops
    if (isInitialMount.current || !isMounted.current) return;

    const saveData = async () => {
      try {
        // Validar despesas antes de salvar
        const validDespesas = validateDespesas(despesas);
        await AsyncStorage.setItem("despesas", JSON.stringify(validDespesas));
      } catch (error) {
        console.error("Erro ao salvar despesas:", error);
      }
    };

    // Debounce para evitar muitas escritas
    const timeoutId = setTimeout(saveData, 300);
    return () => clearTimeout(timeoutId);
  }, [despesas]);

  // Salvar renda sempre que mudar (mas não durante o carregamento inicial)
  useEffect(() => {
    // Não salva durante o carregamento inicial para evitar loops
    if (isInitialMount.current || !isMounted.current) return;

    const saveData = async () => {
      try {
        // Validar renda antes de salvar
        if (typeof renda === "number" && !isNaN(renda) && renda >= 0) {
          await AsyncStorage.setItem("renda", renda.toString());
        } else {
          console.warn("Tentativa de salvar renda inválida:", renda);
        }
      } catch (error) {
        console.error("Erro ao salvar renda:", error);
      }
    };

    // Debounce para evitar muitas escritas
    const timeoutId = setTimeout(saveData, 300);
    return () => clearTimeout(timeoutId);
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
    if (!isValidDespesa(despesa)) {
      console.error("Tentativa de adicionar despesa inválida:", despesa);
      return;
    }

    setDespesas((prev) => [despesa, ...prev]);
  }, []);

  // Função para criar despesa a partir dos dados do formulário - memoizada
  const criarDespesa = useCallback(
    (dados: {
      valor: string;
      categoria: string;
      data: string;
      descricao: string;
      tipo: "fixo" | "variavel";
    }) => {
      try {
        const valorNum = parseFloat(dados.valor.replace(",", "."));

        if (isNaN(valorNum) || valorNum <= 0) {
          console.error("Valor inválido para despesa:", dados.valor);
          return;
        }

        const novaDespesa: Despesa = {
          id: Date.now(),
          nome:
            dados.categoria.charAt(0).toUpperCase() + dados.categoria.slice(1),
          valor: valorNum,
          data: dados.data,
          icone: getIconForCategory(dados.categoria),
          descricao: dados.descricao,
          tipo: dados.tipo,
        };

        adicionarDespesa(novaDespesa);
      } catch (error) {
        console.error("Erro ao criar despesa:", error);
      }
    },
    [adicionarDespesa, getIconForCategory],
  );

  // Função para limpar todos os dados de despesas e renda - memoizada
  const limparDados = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem("despesas"),
        AsyncStorage.removeItem("renda"),
      ]);
      setDespesas([]);
      setRenda(0);
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
      throw error;
    }
  }, []);

  // Memoizar o setRenda para evitar recriações
  const setRendaMemo = useCallback((valor: number) => {
    if (typeof valor === "number" && !isNaN(valor) && valor >= 0) {
      setRenda(valor);
    } else {
      console.error("Tentativa de definir renda inválida:", valor);
    }
  }, []);

  // Memoizar o valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(
    () => ({
      despesas,
      adicionarDespesa,
      criarDespesa,
      renda,
      setRenda: setRendaMemo,
      limparDados,
      categorias,
    }),
    [
      despesas,
      adicionarDespesa,
      criarDespesa,
      renda,
      setRendaMemo,
      limparDados,
      categorias,
    ],
  );

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
  if (!context)
    throw new Error("useDespesas deve ser usado dentro do DespesasProvider");
  return context;
}
