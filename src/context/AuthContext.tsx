// Importa recursos do React e do AsyncStorage (armazenamento local do React Native)
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define o tipo (interface) do usuário que será usado para armazenar informações no contexto
type User = {
  name: string;
  email: string;
  username?: string; // Campo opcional
  id?: number;       // Campo opcional
  phone?: string;    // Campo opcional
  // Você pode adicionar outros campos se precisar
};

// Define o formato dos dados que o contexto de autenticação vai disponibilizar
type AuthContextData = {
  isAuthenticated: boolean;             // Indica se o usuário está logado
  user: User | null;                    // Guarda os dados do usuário logado
  signIn: (token: string, user: User) => Promise<void>; // Função para logar
  signOut: () => Promise<void>;         // Função para sair
};

// Cria o contexto de autenticação com o tipo definido acima
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Cria o componente que vai prover o contexto para toda a aplicação
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado que indica se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estado que guarda as informações do usuário logado
  const [user, setUser] = useState<User | null>(null);

  // useRef usado como flag para garantir que o efeito de carregamento rode apenas uma vez
  const hasLoaded = useRef(false);
  const isMounted = useRef(true);

  // useEffect é executado ao iniciar o app — serve para verificar se há dados salvos no AsyncStorage
  useEffect(() => {
    // Se já carregou antes ou componente foi desmontado, não faz nada
    if (hasLoaded.current || !isMounted.current) return;
    hasLoaded.current = true;

    // Função assíncrona que tenta recuperar token e usuário salvos
    const loadAuthData = async () => {
      try {
        // Busca token e dados do usuário ao mesmo tempo
        const [token, userData] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user")
        ]);

        // Verificar se ainda está montado antes de atualizar estado
        if (!isMounted.current) return;
        
        // Se encontrou token e dados do usuário
        if (token && userData) {
          try {
            // Faz o parse do JSON do usuário
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);         // Armazena no estado
            setIsAuthenticated(true);    // Define que está autenticado
          } catch (parseError) {
            // Caso os dados do usuário estejam corrompidos, remove tudo do AsyncStorage
            console.error('Erro ao fazer parse do usuário:', parseError);
            await Promise.all([
              AsyncStorage.removeItem("token"),
              AsyncStorage.removeItem("user")
            ]);
          }
        }
      } catch (error) {
        // Se der erro ao tentar carregar, mostra no console
        console.error('Erro ao carregar dados de autenticação:', error);
      }
    };

    // Executa a função de carregamento
    loadAuthData();
  }, []);

  // Cleanup para marcar quando componente é desmontado
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Função que realiza o login e salva as informações no AsyncStorage
  const signIn = useCallback(async (token: string, userData: User) => {
    try {
      // Limpa dados antigos antes de salvar os novos
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      // Armazena o novo token e dados do usuário
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      // Atualiza os estados locais
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Caso algo dê errado, faz limpeza e mostra erro
      console.error('Erro ao realizar login:', error);
      setUser(null);
      setIsAuthenticated(false);
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      } catch (clearError) {
        console.error('Erro ao limpar dados após falha de login:', clearError);
      }
      throw error; // Repassa o erro para ser tratado em outro lugar
    }
  }, []);

  // Função que realiza o logout, limpando o AsyncStorage e os estados
  const signOut = useCallback(async () => {
    try {
      // Remove token e usuário do armazenamento local
      await Promise.all([
        AsyncStorage.removeItem("token"),
        AsyncStorage.removeItem("user")
      ]);

      // Limpa os estados locais
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      // Em caso de erro, também garante que o estado volte ao padrão
      console.error('Erro ao fazer logout:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // useMemo evita recriar o objeto do contexto em cada renderização (otimização de performance)
  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    signIn,
    signOut,
  }), [isAuthenticated, user, signIn, signOut]);

  // Retorna o provedor do contexto, permitindo que toda a árvore de componentes acesse as informações de autenticação
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado que facilita o uso do AuthContext dentro de outros componentes
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Garante que o hook só seja usado dentro de um AuthProvider
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
