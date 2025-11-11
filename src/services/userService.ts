// src/services/userService.ts

import { api } from './api';
import { type RegisterManagerData, type User } from '../types/users'; 

// ----------------------------------------------------
// SIMULAÇÃO: Lista de Usuários (Apenas para exibir na tela)
// ----------------------------------------------------
const mockUsers: User[] = [
  { id: 'u1', nome: 'José da Silva (Gerente Logística Arrecife)', email: 'jose@logarrecife.com', permissao: 'Gerente', empresaId: '1', status: 'Ativo', dataCadastro: '15/10/2025' },
  { id: 'u2', nome: 'Maria de Souza (Operador Marlim)', email: 'maria@logmarlim.com', permissao: 'Operador', empresaId: '2', status: 'Ativo', dataCadastro: '16/10/2025' },
];
// ----------------------------------------------------


/**
 * Função para buscar a lista de todos os usuários (Apenas para SuperAdmin)
 */
export async function getUsers(): Promise<{ data: User[] }> {
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Na aplicação real, seria: return api.get<User[]>('/users');
    return { data: mockUsers };
}

/**
 * Função para cadastrar um novo Gerente (Apenas para SuperAdmin)
 * @param data Dados do novo gerente (inclui nome, email, senha e empresaId)
 */
export async function registerManager(data: RegisterManagerData): Promise<void> {
    // Simula a chamada à API para criar o usuário
    console.log("Chamada à API: Cadastrando novo Gerente", data);

    // Na aplicação real, seria: await api.post('/users/register-manager', data);

    // Adiciona o novo usuário ao mock (somente para fins de visualização rápida)
    const newUser: User = {
        id: `u${mockUsers.length + 1}`,
        nome: data.nome,
        email: data.email,
        permissao: 'Gerente',
        empresaId: data.empresaId,
        status: 'Ativo',
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
    };
    mockUsers.push(newUser);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula tempo de processamento
    alert(`Gerente ${data.nome} cadastrado com sucesso para a Empresa ID: ${data.empresaId}!`);
}