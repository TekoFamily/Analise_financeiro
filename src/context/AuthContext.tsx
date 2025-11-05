import React, { createContext, useState, useContext, ReactNode } from "react";

type User = {
  name: string;
  email: string;
  // Adicione outros campos se necessário
};

type AuthContextData = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  console.log('[AuthProvider] Renderizado, isAuthenticated:', isAuthenticated);

  async function signIn(token: string, userData: User) {
    try {
      // Salvar os dados do usuário
      setUser(userData);
      // Atualizar o estado de autenticação
      setIsAuthenticated(true);
      console.log('Login realizado com sucesso:', { token, userData });
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw error;
    }
  }

  function signOut() {
    setIsAuthenticated(false);
    setUser(null);
    // Remova o token do AsyncStorage se estiver usando
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}