// src/services/authService.ts

import { api } from './api';
import { type User } from '@/contexts/AuthContext'; 

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthResponse {
  user: User; 
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<{ data: AuthResponse }> => {
  
  try {
    const payload = {
      username: credentials.email, 
      password: credentials.senha
    };

    const response = await api.post('/token/', payload);

    const token = response.data.access;
    const user = response.data.user; 

    localStorage.setItem('token', token);

    return {
      data: {
        token: token,
        user: user
      }
    };

  } catch (error: any) {
    console.error("Erro ao tentar fazer login:", error);
    
    if (error.response && error.response.status === 401) {
       throw new Error('Usuário ou senha incorretos.');
    }
    
    throw new Error('Falha ao conectar com o servidor. Verifique se o Django está rodando.');
  }
};