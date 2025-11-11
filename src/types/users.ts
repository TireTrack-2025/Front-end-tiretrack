// src/types/user.ts

// Tipos de permissão que o sistema terá
export type UserRole = 'SuperAdmin' | 'Gerente' | 'Operador';

// Estrutura de dados de um Usuário
export interface User {
  id: string;
  nome: string;
  email: string;
  permissao: UserRole;
  // O SuperAdmin não tem empresaId. Gerentes e Operadores sim.
  empresaId?: string; 
  status: 'Ativo' | 'Inativo';
  dataCadastro: string;
}

// Dados que serão enviados pela tela de cadastro (SuperAdmin -> Cadastra Gerente)
export interface RegisterManagerData {
  nome: string;
  email: string;
  senha: string; // Senha inicial
  empresaId: string; // A empresa à qual este gerente pertencerá
}