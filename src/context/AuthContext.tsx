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

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  function signIn(token: string, userData: User) {
    setIsAuthenticated(true);
    setUser(userData);
    // Você pode salvar o token no AsyncStorage se quiser
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