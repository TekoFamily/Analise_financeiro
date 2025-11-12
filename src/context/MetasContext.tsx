import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDespesas, Despesa } from "./ExpensesContext";
import { Alert } from "react-native";

export type Meta = {
  id: string;
  nome: string;
  valor: number;
  prazo: Date;
  criadoEm: Date;
  valorAtual: number;
  categoria: string;
};

interface MetasContextType {
  metas: Meta[];
  adicionarMeta: (meta: Omit<Meta, "id" | "criadoEm" | "valorAtual">) => void;
  adicionarValorNaMeta: (metaId: string, valor: number) => void;
  excluirMeta: (metaId: string) => void;
  carregarMetas: () => Promise<void>;
}

const MetasContext = createContext<MetasContextType | undefined>(undefined);

// Função auxiliar para validar se uma meta é válida
function isValidMeta(meta: any): boolean {
  return (
    meta &&
    typeof meta === "object" &&
    typeof meta.id === "string" &&
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

export function MetasProvider({ children }: { children: React.ReactNode }) {
  const [metas, setMetas] = useState<Meta[]>([]);
  const { adicionarDespesa } = useDespesas();
  const isMounted = useRef(true);

  // Carregar metas do AsyncStorage
  const carregarMetas = useCallback(async () => {
    try {
      const metasSalvas = await AsyncStorage.getItem("@metas");
      if (metasSalvas && isMounted.current) {
        try {
          const metasParsed = JSON.parse(metasSalvas);

          if (!Array.isArray(metasParsed)) {
            console.warn("Dados de metas não são um array, limpando dados");
            await AsyncStorage.removeItem("@metas");
            return;
          }

          const metasConvertidas = metasParsed
            .filter((meta: any) => {
              const isValid = isValidMeta(meta);
              if (!isValid) {
                console.warn("Meta inválida encontrada, ignorando:", meta);
              }
              return isValid;
            })
            .map((meta: any) => ({
              ...meta,
              prazo: new Date(meta.prazo),
              criadoEm: new Date(meta.criadoEm),
            }));

          if (isMounted.current) {
            setMetas(metasConvertidas);
          }
        } catch (parseError) {
          console.error("Erro ao fazer parse das metas:", parseError);
          await AsyncStorage.removeItem("@metas");
          if (isMounted.current) {
            setMetas([]);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
      if (isMounted.current) {
        setMetas([]);
      }
    }
  }, []);

  // Flag para controlar carregamento inicial
  const hasLoaded = useRef(false);

  // Carregar metas ao iniciar (apenas uma vez)
  useEffect(() => {
    if (!hasLoaded.current && isMounted.current) {
      hasLoaded.current = true;
      carregarMetas();
    }
  }, [carregarMetas]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Flag para evitar salvar durante o carregamento inicial
  const isInitialMount = useRef(true);

  // Salvar metas no AsyncStorage sempre que mudar (mas não durante o carregamento inicial)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isMounted.current) return;

    const salvarMetas = async () => {
      try {
        // Validar metas antes de salvar
        const metasValidas = metas.filter((meta) => {
          const isValid = isValidMeta(meta);
          if (!isValid) {
            console.warn("Meta inválida detectada ao salvar:", meta);
          }
          return isValid;
        });

        await AsyncStorage.setItem("@metas", JSON.stringify(metasValidas));
      } catch (error) {
        console.error("Erro ao salvar metas:", error);
      }
    };

    // Debounce: aguarda 300ms antes de salvar para evitar muitas escritas
    const timeoutId = setTimeout(salvarMetas, 300);
    return () => clearTimeout(timeoutId);
  }, [metas]);

  // Adicionar nova meta
  const adicionarMeta = useCallback(
    (novaMeta: Omit<Meta, "id" | "criadoEm" | "valorAtual">) => {
      const meta: Meta = {
        ...novaMeta,
        id: Date.now().toString(),
        criadoEm: new Date(),
        valorAtual: 0,
      };
      setMetas((prev) => [meta, ...prev]);
      Alert.alert("Sucesso", "Meta adicionada com sucesso!");
    },
    [],
  );

  // Função auxiliar para confirmar e adicionar valor
  const confirmarEAdicionarValor = useCallback(
    (metaId: string, valor: number, meta: Meta) => {
      try {
        if (!isMounted.current) return;

        // Atualizar meta
        setMetas((prev) =>
          prev.map((m) =>
            m.id === metaId ? { ...m, valorAtual: m.valorAtual + valor } : m,
          ),
        );

        // Registrar como gasto imediatamente (não usar setTimeout)
        adicionarDespesa({
          id: Date.now(),
          nome: `Meta: ${meta.nome}`,
          valor: valor,
          data: new Date().toLocaleDateString("pt-BR"),
          icone: "🎯",
          descricao: `Valor adicionado à meta: ${meta.nome}`,
          tipo: "variavel",
        });

        Alert.alert(
          "Sucesso",
          "Valor adicionado à meta e registrado como gasto!",
        );
      } catch (error) {
        console.error("Erro ao adicionar valor na meta:", error);
        Alert.alert("Erro", "Não foi possível adicionar o valor à meta.");
      }
    },
    [adicionarDespesa],
  );

  // Adicionar valor à meta
  const adicionarValorNaMeta = useCallback(
    (metaId: string, valor: number) => {
      try {
        if (!isMounted.current) return;

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
            ],
          );
          return;
        }

        // Adicionar valor normalmente
        confirmarEAdicionarValor(metaId, valor, meta);
      } catch (error) {
        console.error("Erro ao adicionar valor na meta:", error);
        Alert.alert("Erro", "Ocorreu um erro ao adicionar o valor.");
      }
    },
    [metas, confirmarEAdicionarValor],
  );

  // Excluir meta
  const excluirMeta = useCallback((metaId: string) => {
    if (!isMounted.current) return;

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta meta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            try {
              setMetas((prev) => prev.filter((m) => m.id !== metaId));
              Alert.alert("Sucesso", "Meta excluída!");
            } catch (error) {
              console.error("Erro ao excluir meta:", error);
              Alert.alert("Erro", "Não foi possível excluir a meta.");
            }
          },
        },
      ],
    );
  }, []);

  // Memoizar o valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(
    () => ({
      metas,
      adicionarMeta,
      adicionarValorNaMeta,
      excluirMeta,
      carregarMetas,
    }),
    [metas, adicionarMeta, adicionarValorNaMeta, excluirMeta, carregarMetas],
  );

  return (
    <MetasContext.Provider value={contextValue}>
      {children}
    </MetasContext.Provider>
  );
}

export function useMetas() {
  const context = useContext(MetasContext);
  if (!context) {
    throw new Error("useMetas deve ser usado dentro do MetasProvider");
  }
  return context;
}
