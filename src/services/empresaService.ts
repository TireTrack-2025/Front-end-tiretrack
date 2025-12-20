// src/services/empresaService.ts
import { api } from './api';
import { type ClientCompany, type CompanyFormData } from '../types/company';

// --- MOCK DE DADOS ---
const mockEmpresas: ClientCompany[] = [
  { id: '1', nome: 'Logística Arrecife', cnpj: '00.111.222/0001-33', status: 'Ativo', usuariosAtivos: 5, dataCadastro: '10/09/2025' },
  { id: '2', nome: 'Logística Marlim', cnpj: '11.222.333/0001-44', status: 'Ativo', usuariosAtivos: 12, dataCadastro: '05/08/2025' },
  { id: '3', nome: 'TransSul Express', cnpj: '22.333.444/0001-55', status: 'Inativo', usuariosAtivos: 0, dataCadastro: '22/07/2025' },
  { id: '4', nome: 'Cargas Urbanas SP', cnpj: '33.444.555/0001-66', status: 'Ativo', usuariosAtivos: 8, dataCadastro: '01/10/2025' },
  // Repetindo um para simular 5 registros na tela, como na imagem
  { id: '5', nome: 'Logística Arrecife', cnpj: '00.111.222/0001-33', status: 'Ativo', usuariosAtivos: 5, dataCadastro: '10/09/2025' },
];
// ---------------------

// Função para buscar a lista de empresas (simulando uma chamada com delay)
export const getEmpresas = async () => {
    // Em produção, seria: return api.get<ClientCompany[]>('/empresas');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay de rede
    return { data: mockEmpresas }; // Retorna o mock
};

// Função para criar uma nova empresa
export const createEmpresa = (data: CompanyFormData) => {
  return api.post('/empresas', data);
};

// Funções de atualização e exclusão (a serem implementadas)
export const updateEmpresa = (id: string, data: CompanyFormData) => {
  return api.put(`/empresas/${id}`, data);
};

export const deleteEmpresa = (id: string) => {
  return api.delete(`/empresas/${id}`);
};