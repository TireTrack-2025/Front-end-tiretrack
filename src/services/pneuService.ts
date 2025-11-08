import {api} from './api'; 
import { type AxiosResponse } from 'axios';

//1. Definição das Interfaces
export interface Pneu {
  id: number;
  numero_serie: string;
  marca: string;
  modelo: string;
  dimensoes: string;
  indice_carga_velocidade: string;
  data_aquisicao: string;
  valor_compra: number;
  limite_recapeamentos: number;
  status_atual: 'Em estoque' | 'Em uso' | 'Em manutenção' | 'Descartado';
  quilometragem_total_acumulada: number;

}

export interface PneuData {
  numero_serie: string;
  marca: string;
  modelo: string;
  dimensoes: string;
  indice_carga_velocidade: string;
  data_aquisicao: string;
  valor_compra: number;
  limite_recapeamentos: number;
  status_atual?: 'Em estoque' | 'Em uso' | 'Em manutenção' | 'Descartado';
}

export interface PneuStatusResumo {
  emUso: number;        // Pneus associados a um veículo [cite: 34]
  emEstoque: number;    // Pneus armazenados [cite: 34]
  emManutencao: number; // Pneus em recapeamento/conserto [cite: 34]
  descartado: number;   // Pneus fora de uso [cite: 34]
}

// 2. Variável de Configuração

const PNEUS_API_URL = '/pneus'; 

// --- 3. MOCK DE DADOS (Para Desenvolvimento Inicial) ---

const mockPneus: Pneu[] = [
    {
        id: 101, numero_serie: 'FG123456', marca: 'Pirelli', modelo: 'G:88', dimensoes: '295/80R22.5',
        indice_carga_velocidade: '152/148M', data_aquisicao: '2024-01-15', valor_compra: 2500.00,
        limite_recapeamentos: 2, status_atual: 'Em uso', quilometragem_total_acumulada: 55000
    },
    {
        id: 102, numero_serie: 'FG123457', marca: 'Goodyear', modelo: 'KMAX S', dimensoes: '275/80R22.5',
        indice_carga_velocidade: '149/146M', data_aquisicao: '2024-03-20', valor_compra: 2100.00,
        limite_recapeamentos: 3, status_atual: 'Em estoque', quilometragem_total_acumulada: 0
    },
    {
        id: 103, numero_serie: 'FG123458', marca: 'Michelin', modelo: 'X Multi Z', dimensoes: '295/80R22.5',
        indice_carga_velocidade: '152/148M', data_aquisicao: '2023-10-01', valor_compra: 2800.00,
        limite_recapeamentos: 2, status_atual: 'Em manutenção', quilometragem_total_acumulada: 120000
    },
    {
        id: 104, numero_serie: 'FG123459', marca: 'Pirelli', modelo: 'G:88', dimensoes: '295/80R22.5',
        indice_carga_velocidade: '152/148M', data_aquisicao: '2023-05-10', valor_compra: 2600.00,
        limite_recapeamentos: 1, status_atual: 'Descartado', quilometragem_total_acumulada: 180000
    }
];


// 4. Funções de Serviço

/**
 * Busca todos os pneus cadastrados.
 * @returns {Promise<axios.AxiosResponse<Pneu[]>>} Lista de pneus.
 */
export const getPneus = async (): Promise<AxiosResponse<Pneu[]>> => {
  // Em produção, seria: return api.get<Pneu[]>(PNEUS_API_URL);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay
  return { data: mockPneus, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse<Pneu[]>;
};

/**
 * Cadastra um novo pneu.
 * @param {PneuData} pneuData - Os dados do novo pneu (marca, modelo, dot, status).
 * @returns {Promise<axios.AxiosResponse<Pneu>>} O pneu recém-criado.
 */
export const createPneu = (pneuData: PneuData) => {
  // Em produção, seria: return api.post<Pneu>(PNEUS_API_URL, pneuData);
  // No mock, simulamos o sucesso
  const newPneu: Pneu = {
      id: Math.floor(Math.random() * 1000) + 200,
      ...pneuData,
      status_atual: pneuData.status_atual || 'Em estoque',
      quilometragem_total_acumulada: 0
  };
  mockPneus.push(newPneu);
  return Promise.resolve({ data: newPneu } as AxiosResponse<Pneu>);
};


export const getPneuStatusResumo = async (): Promise<AxiosResponse<PneuStatusResumo>> => {
    // Calcula o resumo a partir dos dados mockados
    const resumo: PneuStatusResumo = mockPneus.reduce((acc, pneu) => {
        if (pneu.status_atual === 'Em uso') acc.emUso++;
        else if (pneu.status_atual === 'Em estoque') acc.emEstoque++;
        else if (pneu.status_atual === 'Em manutenção') acc.emManutencao++;
        else if (pneu.status_atual === 'Descartado') acc.descartado++;
        return acc;
    }, { emUso: 0, emEstoque: 0, emManutencao: 0, descartado: 0 });

    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: resumo, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse<PneuStatusResumo>;
};



//Funções Adicionais (Opcionais)

/**
 * Busca um pneu pelo ID.
 */
export const getPneuById = (id: number) => {
  return api.get<Pneu>(`${PNEUS_API_URL}/${id}`);
};

/**
 * Atualiza um pneu existente.
 */
export const updatePneu = (id: number, pneuData: PneuData) => {
  return api.put<Pneu>(`${PNEUS_API_URL}/${id}`, pneuData);
};

/**
 * Remove um pneu pelo ID.
 */
export const deletePneu = (id: number) => {
  return api.delete(`${PNEUS_API_URL}/${id}`);
};