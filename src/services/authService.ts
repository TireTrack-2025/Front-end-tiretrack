// src/services/authService.ts

import { api } from './api';
import { type User, type TipoAcesso } from '@/contexts/AuthContext'; // Tipos definidos no AuthContext

/**
 * Tipagem das credenciais esperadas no formulário de login.
 */
export interface LoginCredentials {
  email: string;
  senha: string;
}

/**
 * Tipagem da resposta de autenticação que a API deve retornar.
 */
export interface AuthResponse {
  user: User; // O objeto User completo com tipoAcesso e permissões
  token: string;
}


// --- MOCK DE DADOS DE LOGIN PARA TESTES RÁPIDOS ---
// O backend usaria o endpoint real, mas o mock permite testar a lógica do AuthContext.

const MOCK_USERS: { [key: string]: User } = {
    // 1. Usuário da Empresa Proprietária (Vê tudo)
    'proprietaria@track.com': {
        id: 1,
        nome: 'Super Administrador',
        permissao: 'SuperAdmin',
        tipoAcesso: 'Proprietaria',
        empresaId: null, // Proprietária não tem ID de cliente
    },
    // 2. Usuário da Empresa Cliente (Vê apenas sua frota)
    'cliente@arrecife.com': {
        id: 101,
        nome: 'João Gerente Cliente',
        permissao: 'Admin',
        tipoAcesso: 'Cliente',
        empresaId: 'cliente-arrecife-123', // ID da empresa a que ele pertence
    },
    // 3. Usuário Cliente com Acesso Limitado
    'operador@arrecife.com': {
        id: 102,
        nome: 'Maria Operadora',
        permissao: 'Operador',
        tipoAcesso: 'Cliente',
        empresaId: 'cliente-arrecife-123',
    }
};

/**
 * Função responsável por enviar as credenciais para a API e receber o token/usuário.
 * * Em produção, esta função faria a chamada real usando o 'api' do Axios.
 */
export const login = async (credentials: LoginCredentials): Promise<{ data: AuthResponse }> => {
    // 1. Em Produção (Comente o MOCK abaixo e use este código):
    // const response = await api.post<AuthResponse>('/auth/login', credentials);
    // return response;

    // 2. MOCK PARA TESTES:
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula latência de rede
    
    // Procura o usuário no mock pelo email e verifica a senha
    const mockUser = MOCK_USERS[credentials.email];

    // Aqui, a senha é sempre '123' para simplificar o mock.
    if (mockUser && credentials.senha === '123') {
        return {
            data: {
                token: `mock-token-${mockUser.permissao}-${mockUser.id}`,
                user: mockUser
            }
        };
    }
    
    // Se falhar
    throw new Error('Credenciais inválidas. Tente proprietaria@track.com / 123');
};


// Função de logout (Opcional: pode ser tratada apenas no AuthContext)
// export const logout = () => api.post('/auth/logout');