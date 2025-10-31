// Localização: src/contexts/AuthContext.tsx

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as apiLogin, type LoginCredentials } from '@/services/authService';
import { api } from '@/services/api'; 

//1. DEFINIÇÃO DOS TIPOS
export type Permissao = 'SuperAdmin' | 'Admin' | 'Operador';
export type TipoAcesso = 'Proprietaria' | 'Cliente'; 

export interface User {
 id: number;
 nome: string;
 permissao: Permissao;
 tipoAcesso: TipoAcesso; 
 empresaId: string | null; 
}

// CORREÇÃO 1: Adicionar 'loading' à interface do Contexto
interface AuthContextType {
 user: User | null;
 isAuthenticated: boolean;
 login: (credentials: LoginCredentials) => Promise<void>; 
 logout: () => void;
 loading: boolean; // <--- PROPRIEDADE OBRIGATÓRIA PARA O PrivateRoute
}

// 2. Criando o Contexto
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Criando o "Provedor"
interface AuthProviderProps {
 children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
 const [user, setUser] = useState<User | null>(null); 
 const [token, setToken] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);

 const isAuthenticated = !!user;

 // Função de LOGOUT
 const logout = () => {
   setUser(null);
   setToken(null);
   delete api.defaults.headers.Authorization;
   localStorage.removeItem('@tiretrack:token');
   localStorage.removeItem('@tiretrack:user'); 
 };
 
 // Função de LOGIN
 const login = async (credentials: LoginCredentials) => {
   const response = await apiLogin(credentials);
   
   const { user: userData, token: userToken } = response.data;
   
   setUser(userData);
   setToken(userToken);
   api.defaults.headers.Authorization = `Bearer ${userToken}`;
   localStorage.setItem('@tiretrack:token', userToken); 
   localStorage.setItem('@tiretrack:user', JSON.stringify(userData));
 };
 
 // EFEITO: Tenta carregar o usuário do localStorage ao iniciar a aplicação
 useEffect(() => {
   const storedToken = localStorage.getItem('@tiretrack:token');
   const storedUser = localStorage.getItem('@tiretrack:user');
   
   if (storedToken && storedUser) {
     try {
       const userData = JSON.parse(storedUser);
       setUser(userData);
       setToken(storedToken);
       api.defaults.headers.Authorization = `Bearer ${storedToken}`;
     } catch (e) {
       console.error("Erro ao parsear dados de usuário do localStorage:", e);
       logout(); // Limpa dados inválidos
     }
   }
   setLoading(false); 
 }, []); 
 
 if (loading) {
   return <div>Carregando sessão...</div>; 
 }

 return (
  // CORREÇÃO 2: Adicionar 'loading', 'login' e 'logout' ao objeto value
  <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
   {children}
  </AuthContext.Provider>
 );
};

// 5. Criando o "atalho" (hook customizado)
export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
  throw new Error('useAuth deve ser usado dentro de um AuthProvider');
 }
 return context;
};