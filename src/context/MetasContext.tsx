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

export function MetasProvider({ children }: { children: React.ReactNode }) {
  const [metas, setMetas] = useState<Meta[]>([]);
  const { adicionarDespesa } = useDespesas();

  // Carregar metas do AsyncStorage
  const carregarMetas = useCallback(async () => {
    try {
      const metasSalvas = await AsyncStorage.getItem("@metas");
      if (metasSalvas) {
        const metasParsed = JSON.parse(metasSalvas);
        const metasConvertidas = metasParsed.map((meta: any) => ({
          ...meta,
          prazo: new Date(meta.prazo),
          criadoEm: new Date(meta.criadoEm),
        }));
        setMetas(metasConvertidas);
      }
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
    }
  }, []);

  // Flag para controlar carregamento inicial
  const hasLoaded = useRef(false);

  // Carregar metas ao iniciar (apenas uma vez)
  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      carregarMetas();
    }
  }, []);

  // Flag para evitar salvar durante o carregamento inicial
  const isInitialMount = useRef(true);

  // Salvar metas no AsyncStorage sempre que mudar (mas não durante o carregamento inicial)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const salvarMetas = async () => {
      try {
        await AsyncStorage.setItem("@metas", JSON.stringify(metas));
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
        icone: "��",
        descricao: `Valor adicionado à meta: ${meta.nome}`,
        tipo: "variavel",
      });

      Alert.alert(
        "Sucesso",
        "Valor adicionado à meta e registrado como gasto!",
      );
    },
    [adicionarDespesa],
  );

  // Adicionar valor à meta
  const adicionarValorNaMeta = useCallback(
    (metaId: string, valor: number) => {
      // Buscar a meta atual
      const meta = metas.find((m) => m.id === metaId);
      if (!meta) return;

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
    },
    [metas, confirmarEAdicionarValor],
  );

  // Excluir meta
  const excluirMeta = useCallback((metaId: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta meta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setMetas((prev) => prev.filter((m) => m.id !== metaId));
            Alert.alert("Sucesso", "Meta excluída!");
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
