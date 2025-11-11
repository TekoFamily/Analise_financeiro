import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  name: string;
  email: string;
  username?: string;
  id?: number;
  phone?: string;
  // Adicione outros campos se necessário
};

type AuthContextData = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const hasLoaded = useRef(false);

  // Verifica se há dados salvos ao iniciar (apenas uma vez)
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadAuthData = async () => {
      try {
        const [token, userData] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user")
        ]);
        
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log('Sessão restaurada do storage');
          } catch (parseError) {
            console.error('Erro ao fazer parse do usuário:', parseError);
            // Limpa dados corrompidos
            await Promise.all([
              AsyncStorage.removeItem("token"),
              AsyncStorage.removeItem("user")
            ]);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    
    loadAuthData();
  }, []); // Dependências vazias - só executa uma vez

  const signIn = useCallback(async (token: string, userData: User) => {
    try {
      // Limpa dados antigos primeiro
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      
      // Salva novos dados
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      
      // Atualiza estado apenas após salvar com sucesso
      setUser(userData);
      setIsAuthenticated(true);
      console.log('Login realizado com sucesso:', { token, userData });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      // Em caso de erro, limpa tudo
      setUser(null);
      setIsAuthenticated(false);
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      } catch (clearError) {
        console.error('Erro ao limpar dados após falha de login:', clearError);
      }
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Primeiro limpa o storage
      await Promise.all([
        AsyncStorage.removeItem("token"),
        AsyncStorage.removeItem("user")
      ]);
      
      // Depois atualiza o estado (isso causa a mudança de navegação)
      setUser(null);
      setIsAuthenticated(false);
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpa o estado para garantir
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Memoizar o valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    signIn,
    signOut,
  }), [isAuthenticated, user, signIn, signOut]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}