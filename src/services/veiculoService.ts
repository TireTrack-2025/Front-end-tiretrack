import { api } from './api';
import { type AxiosResponse } from 'axios'; // Importar tipos para clareza

// --- 1. Definição das Interfaces (Baseado no RF01 e Tabela Veiculos) ---

export interface Veiculo {
  id: number;
  placa: string;                  // Tabela Veiculos: Placa 
  marca: string;                  // Campo não na Tabela, mas essencial (mantido do seu código)
  modelo: string;                 // Tabela Veiculos: Modelo 
  ano: number;                    // Tabela Veiculos: Ano 
  configuracao_eixos: string;     // Tabela Veiculos: Configuração de eixos 
  quilometragem_atual: number;    // Tabela Veiculos: Quilometragem 
  ativo: boolean;                 // Tabela Veiculos: Ativo 
  data_cadastro: string;          // Tabela Veiculos: Data de cadastro [cite: 249]
}

// Interface de Dados para Criação (sem ID e sem campos automáticos)
export interface VeiculoData {
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  configuracao_eixos: string;
  quilometragem_atual: number;
  ativo?: boolean; // Opção para o formulário
}


// --- 2. Variável de Configuração ---

const VEICULOS_API_URL = '/veiculos'; 


// --- 3. MOCK DE DADOS (Para Desenvolvimento) ---

const mockVeiculos: Veiculo[] = [
    {
        id: 1, placa: 'ABC-1234', marca: 'Volvo', modelo: 'FH 540', ano: 2022,
        configuracao_eixos: '3 eixos, truck simples', quilometragem_atual: 155000,
        ativo: true, data_cadastro: '2025-01-10'
    },
    {
        id: 2, placa: 'DEF-5678', marca: 'Scania', modelo: 'R 450', ano: 2021,
        configuracao_eixos: '2 eixos, cavalo toco', quilometragem_atual: 210000,
        ativo: true, data_cadastro: '2025-03-20'
    },
    {
        id: 3, placa: 'GHI-9012', marca: 'Mercedes-Benz', modelo: 'Axor 2544', ano: 2018,
        configuracao_eixos: '4 eixos, bitrem', quilometragem_atual: 450000,
        ativo: false, data_cadastro: '2025-05-01'
    },
];

// --- 4. Funções de Serviço (com Mocks para o desenvolvimento) ---

/**
 * Busca todos os veículos cadastrados (RF01: consulta).
 */
export const getVeiculos = async (): Promise<AxiosResponse<Veiculo[]>> => {
  // Em produção, seria: return api.get<Veiculo[]>(VEICULOS_API_URL);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay
  return { data: mockVeiculos, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse<Veiculo[]>;
};

/**
 * Cadastra um novo veículo (RF01: cadastro).
 */
export const createVeiculo = (veiculoData: VeiculoData) => {
  // Em produção, seria: return api.post<Veiculo>(VEICULOS_API_URL, veiculoData);
  // Simula o sucesso e adiciona ao mock
  const newVeiculo: Veiculo = {
      id: Math.floor(Math.random() * 1000) + 200,
      ...veiculoData,
      ativo: veiculoData.ativo !== undefined ? veiculoData.ativo : true,
      data_cadastro: new Date().toISOString().split('T')[0]
  };
  mockVeiculos.push(newVeiculo);
  return Promise.resolve({ data: newVeiculo } as AxiosResponse<Veiculo>);
};


// --- Funções Adicionais de CRUD (RF01) ---

/**
 * Busca um veículo pelo ID.
 */
export const getVeiculoById = (id: number) => {
  return api.get<Veiculo>(`${VEICULOS_API_URL}/${id}`);
};

/**
 * Atualiza um veículo existente (RF01: edição).
 */
export const updateVeiculo = (id: number, veiculoData: VeiculoData) => {
  return api.put<Veiculo>(`${VEICULOS_API_URL}/${id}`, veiculoData);
};

/**
 * Remove um veículo pelo ID (RF01: exclusão).
 */
export const deleteVeiculo = (id: number) => {
  return api.delete(`${VEICULOS_API_URL}/${id}`);
};