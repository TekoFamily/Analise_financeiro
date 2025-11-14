// src/context/ExpensesContext.tsx
// 📦 Pasta: src/context
// Responsável por: Contexto global de despesas (criação, listagem, persistência e limpeza)
// Observações: Usa API para persistir dados; expõe hook useDespesas.
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { despesasService } from "../services/despesasService";
import { userService } from "../services/userService";
import { useAuth } from "./AuthContext";

// Interface que define o formato de uma despesa
export interface Despesa {
  id: number; // Identificador único da despesa
  nome: string; // Nome da despesa
  valor: number; // Valor da despesa
  data: string; // Data da despesa (formato ISO ou "DD/MM/YYYY")
  icone: string; // Ícone associado à despesa
  descricao: string; // Descrição detalhada da despesa
  tipo: "fixo" | "variavel"; // Tipo da despesa
  categoria?: string; // Categoria da despesa
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
  }) => Promise<void>; // Função para criar despesa a partir dos dados do formulário
  renda: number; // Valor da renda total
  setRenda: (valor: number) => Promise<void>; // Função para atualizar a renda
  limparDados: () => Promise<void>; // Função para limpar todos os dados de despesas
  categorias: string[]; // Lista de categorias disponíveis
  isLoading: boolean; // Indica se está carregando dados
  error: string | null; // Mensagem de erro, se houver
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

// Função auxiliar para converter data do formato brasileiro para ISO
function convertDateToISO(dateStr: string): string {
  // Se já estiver em formato ISO, retorna
  if (dateStr.includes("T") || dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }

  // Tenta converter de DD/MM/YYYY para YYYY-MM-DD
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return dateStr;
}

// Função auxiliar para converter data de ISO para formato brasileiro
function convertDateFromISO(dateStr: string): string {
  // Se já estiver em formato brasileiro, retorna
  if (dateStr.includes("/")) {
    return dateStr;
  }

  // Converte de YYYY-MM-DD para DD/MM/YYYY
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return dateStr;
}

// Componente provedor do contexto das despesas
export function DespesasProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userId } = useAuth();

  // Estado para armazenar a lista de despesas
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  // Estado para armazenar o valor da renda
  const [renda, setRenda] = useState<number>(0);
  // Estado para indicar se está carregando
  const [isLoading, setIsLoading] = useState(false);
  // Estado para mensagens de erro
  const [error, setError] = useState<string | null>(null);
  // Flag para verificar se o componente está montado
  const isMounted = useRef(true);

  // Carregar despesas e renda quando o usuário estiver autenticado
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      // Se não estiver autenticado, limpa os dados
      setDespesas([]);
      setRenda(0);
      return;
    }

    let isSubscribed = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Carregar despesas e renda em paralelo
        const [despesasData, rendaData] = await Promise.all([
          despesasService.getAll(),
          userService.getRenda(),
        ]);

        if (!isSubscribed || !isMounted.current) return;

        // Converter datas de ISO para formato brasileiro para exibição
        const despesasConvertidas = despesasData.map((despesa) => ({
          ...despesa,
          data: convertDateFromISO(despesa.data),
        }));

        setDespesas(despesasConvertidas);
        setRenda(rendaData || 0);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        if (isSubscribed && isMounted.current) {
          setError(
            err instanceof Error
              ? err.message
              : "Erro ao carregar dados do servidor"
          );
          setDespesas([]);
          setRenda(0);
        }
      } finally {
        if (isSubscribed && isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [isAuthenticated, userId]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  // Função para adicionar uma nova despesa à lista (otimista)
  const adicionarDespesa = useCallback((despesa: Despesa) => {
    if (!isValidDespesa(despesa)) {
      console.error("Tentativa de adicionar despesa inválida:", despesa);
      return;
    }

    // Atualização otimista - adiciona imediatamente à lista
    setDespesas((prev) => [despesa, ...prev]);
  }, []);

  // Função para criar despesa a partir dos dados do formulário - memoizada
  const criarDespesa = useCallback(
    async (dados: {
      valor: string;
      categoria: string;
      data: string;
      descricao: string;
      tipo: "fixo" | "variavel";
    }) => {
      if (!isAuthenticated || !userId) {
        setError("Você precisa estar autenticado para criar despesas");
        throw new Error("Usuário não autenticado");
      }

      try {
        const valorNum = parseFloat(dados.valor.replace(",", "."));

        if (isNaN(valorNum) || valorNum <= 0) {
          const errorMsg = "Valor inválido para despesa";
          setError(errorMsg);
          throw new Error(errorMsg);
        }

        // Converter data para formato ISO
        const dataISO = convertDateToISO(dados.data);

        // Criar despesa na API
        const novaDespesa = await despesasService.create({
          nome:
            dados.categoria.charAt(0).toUpperCase() + dados.categoria.slice(1),
          valor: valorNum,
          data: dataISO,
          icone: getIconForCategory(dados.categoria),
          descricao: dados.descricao,
          tipo: dados.tipo,
          categoria: dados.categoria,
        });

        // Converter data de volta para formato brasileiro
        const despesaConvertida = {
          ...novaDespesa,
          data: convertDateFromISO(novaDespesa.data),
        };

        // Adicionar à lista local
        setDespesas((prev) => [despesaConvertida, ...prev]);
        setError(null);
      } catch (err) {
        console.error("Erro ao criar despesa:", err);
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Erro ao criar despesa. Tente novamente.";
        setError(errorMsg);
        throw err;
      }
    },
    [isAuthenticated, userId, getIconForCategory]
  );

  // Função para atualizar renda
  const setRendaMemo = useCallback(
    async (valor: number) => {
      if (!isAuthenticated || !userId) {
        setError("Você precisa estar autenticado para atualizar a renda");
        return;
      }

      if (typeof valor !== "number" || isNaN(valor) || valor < 0) {
        console.error("Tentativa de definir renda inválida:", valor);
        setError("Valor de renda inválido");
        return;
      }

      try {
        await userService.updateRenda(valor);
        setRenda(valor);
        setError(null);
      } catch (err) {
        console.error("Erro ao atualizar renda:", err);
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Erro ao atualizar renda. Tente novamente.";
        setError(errorMsg);
      }
    },
    [isAuthenticated, userId]
  );

  // Função para limpar todos os dados de despesas e renda - memoizada
  const limparDados = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      return;
    }

    try {
      // Deletar todas as despesas
      await Promise.all(despesas.map((d) => despesasService.delete(d.id)));

      // Limpar renda
      await userService.updateRenda(0);

      setDespesas([]);
      setRenda(0);
      setError(null);
    } catch (err) {
      console.error("Erro ao limpar dados:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erro ao limpar dados. Tente novamente.";
      setError(errorMsg);
      throw err;
    }
  }, [isAuthenticated, userId, despesas]);

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
      isLoading,
      error,
    }),
    [
      despesas,
      adicionarDespesa,
      criarDespesa,
      renda,
      setRendaMemo,
      limparDados,
      categorias,
      isLoading,
      error,
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
