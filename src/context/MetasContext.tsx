import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Alert } from "react-native";
import { useDespesas, Despesa } from "./ExpensesContext";
import { metasService } from "../services/metasService";
import { useAuth } from "./AuthContext";

export type Meta = {
  id: number | string; // Aceita number (do backend) ou string (para compatibilidade)
  nome: string;
  valor: number;
  prazo: Date;
  criadoEm: Date;
  valorAtual: number;
  categoria: string;
};

interface MetasContextType {
  metas: Meta[];
  adicionarMeta: (
    meta: Omit<Meta, "id" | "criadoEm" | "valorAtual">
  ) => Promise<void>;
  adicionarValorNaMeta: (metaId: number | string, valor: number) => Promise<void>;
  excluirMeta: (metaId: number | string) => Promise<void>;
  carregarMetas: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const MetasContext = createContext<MetasContextType | undefined>(undefined);

// Função auxiliar para validar se uma meta é válida
function isValidMeta(meta: any): boolean {
  return (
    meta &&
    typeof meta === "object" &&
    (typeof meta.id === "string" || typeof meta.id === "number") &&
    typeof meta.nome === "string" &&
    typeof meta.valor === "number" &&
    !isNaN(meta.valor) &&
    meta.valor > 0 &&
    typeof meta.valorAtual === "number" &&
    !isNaN(meta.valorAtual) &&
    meta.valorAtual >= 0 &&
    typeof meta.categoria === "string" &&
    (meta.prazo || meta.criadoEm)
  );
}

// Função auxiliar para converter data de string para Date
function parseDate(dateStr: string | Date): Date {
  if (dateStr instanceof Date) {
    return dateStr;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Data inválida");
  }
  return date;
}

export function MetasProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userId } = useAuth();
  const [metas, setMetas] = useState<Meta[]>([]);
  const { adicionarDespesa } = useDespesas();
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar metas quando o usuário estiver autenticado
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setMetas([]);
      return;
    }

    carregarMetas();
  }, [isAuthenticated, userId]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Carregar metas do servidor
  const carregarMetas = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const metasData = await metasService.getAll();

      if (!isMounted.current) return;

      // Converter datas de string para Date
      const metasConvertidas = metasData
        .filter((meta: any) => {
          const isValid = isValidMeta(meta);
          if (!isValid) {
            console.warn("Meta inválida encontrada, ignorando:", meta);
          }
          return isValid;
        })
        .map((meta: any) => ({
          ...meta,
          prazo: parseDate(meta.prazo),
          criadoEm: parseDate(meta.criadoEm || new Date()),
        }));

      setMetas(metasConvertidas);
    } catch (err) {
      console.error("Erro ao carregar metas:", err);
      if (isMounted.current) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar metas do servidor"
        );
        setMetas([]);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, userId]);

  // Adicionar nova meta
  const adicionarMeta = useCallback(
    async (novaMeta: Omit<Meta, "id" | "criadoEm" | "valorAtual">) => {
      if (!isAuthenticated || !userId) {
        setError("Você precisa estar autenticado para criar metas");
        Alert.alert("Erro", "Você precisa estar autenticado para criar metas");
        return;
      }

      try {
        // Converter prazo para ISO string
        const prazoISO =
          novaMeta.prazo instanceof Date
            ? novaMeta.prazo.toISOString()
            : new Date(novaMeta.prazo).toISOString();

        const metaCriada = await metasService.create({
          nome: novaMeta.nome,
          valor: novaMeta.valor,
          prazo: prazoISO,
          categoria: novaMeta.categoria,
        });

        // Converter datas de volta para Date
        const meta: Meta = {
          ...metaCriada,
          prazo: parseDate(metaCriada.prazo),
          criadoEm: parseDate(metaCriada.criadoEm || new Date()),
        };

        setMetas((prev) => [meta, ...prev]);
        setError(null);
        Alert.alert("Sucesso", "Meta adicionada com sucesso!");
      } catch (err) {
        console.error("Erro ao adicionar meta:", err);
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Erro ao adicionar meta. Tente novamente.";
        setError(errorMsg);
        Alert.alert("Erro", errorMsg);
        throw err;
      }
    },
    [isAuthenticated, userId]
  );

  // Função auxiliar para confirmar e adicionar valor
  const confirmarEAdicionarValor = useCallback(
    async (metaId: number | string, valor: number, meta: Meta) => {
      try {
        if (!isMounted.current || !isAuthenticated || !userId) return;

        // Atualizar meta no servidor
        const metaAtualizada = await metasService.addValue(metaId, valor);

        // Atualizar estado local
        setMetas((prev) =>
          prev.map((m) =>
            m.id === metaId
              ? {
                  ...m,
                  valorAtual: metaAtualizada.valorAtual,
                }
              : m
          )
        );

        // Registrar como gasto
        adicionarDespesa({
          id: Date.now(),
          nome: `Meta: ${meta.nome}`,
          valor: valor,
          data: new Date().toLocaleDateString("pt-BR"),
          icone: "🎯",
          descricao: `Valor adicionado à meta: ${meta.nome}`,
          tipo: "variavel",
        });

        setError(null);
        Alert.alert(
          "Sucesso",
          "Valor adicionado à meta e registrado como gasto!"
        );
      } catch (error) {
        console.error("Erro ao adicionar valor na meta:", error);
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Não foi possível adicionar o valor à meta.";
        setError(errorMsg);
        Alert.alert("Erro", errorMsg);
        throw error;
      }
    },
    [adicionarDespesa, isAuthenticated, userId]
  );

  // Adicionar valor à meta
  const adicionarValorNaMeta = useCallback(
    async (metaId: number | string, valor: number) => {
      try {
        if (!isMounted.current || !isAuthenticated || !userId) return;

        if (!valor || isNaN(valor) || valor <= 0) {
          Alert.alert("Erro", "Valor inválido.");
          return;
        }

        // Buscar a meta atual
        const meta = metas.find((m) => m.id === metaId);
        if (!meta) {
          Alert.alert("Erro", "Meta não encontrada.");
          return;
        }

        // Verificar se excede o valor da meta
        if (meta.valorAtual + valor > meta.valor) {
          Alert.alert(
            "Aviso",
            "O valor adicionado excederá a meta. Deseja continuar?",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Continuar",
                onPress: () => confirmarEAdicionarValor(metaId, valor, meta),
              },
            ]
          );
          return;
        }

        // Adicionar valor normalmente
        await confirmarEAdicionarValor(metaId, valor, meta);
      } catch (error) {
        console.error("Erro ao adicionar valor na meta:", error);
        Alert.alert("Erro", "Ocorreu um erro ao adicionar o valor.");
      }
    },
    [metas, confirmarEAdicionarValor, isAuthenticated, userId]
  );

  // Excluir meta
  const excluirMeta = useCallback(
    async (metaId: number | string) => {
      if (!isMounted.current || !isAuthenticated || !userId) return;

      Alert.alert(
        "Confirmar exclusão",
        "Tem certeza que deseja excluir esta meta?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                await metasService.delete(metaId);
                setMetas((prev) => prev.filter((m) => m.id !== metaId));
                setError(null);
                Alert.alert("Sucesso", "Meta excluída!");
              } catch (error) {
                console.error("Erro ao excluir meta:", error);
                const errorMsg =
                  error instanceof Error
                    ? error.message
                    : "Não foi possível excluir a meta.";
                setError(errorMsg);
                Alert.alert("Erro", errorMsg);
              }
            },
          },
        ]
      );
    },
    [isAuthenticated, userId]
  );

  // Memoizar o valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(
    () => ({
      metas,
      adicionarMeta,
      adicionarValorNaMeta,
      excluirMeta,
      carregarMetas,
      isLoading,
      error,
    }),
    [
      metas,
      adicionarMeta,
      adicionarValorNaMeta,
      excluirMeta,
      carregarMetas,
      isLoading,
      error,
    ],
  );

  return (
    <MetasContext.Provider value={contextValue}>{children}</MetasContext.Provider>
  );
}

export function useMetas() {
  const context = useContext(MetasContext);
  if (!context) {
    throw new Error("useMetas deve ser usado dentro do MetasProvider");
  }
  return context;
}
