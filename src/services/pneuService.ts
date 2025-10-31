import {api} from './api'; 

//1. Definição das Interfaces
interface Pneu {
  id: number;
  marca: string;
  modelo: string;
  dot: string;
  status: string;
}

interface PneuData {
  marca: string;
  modelo: string;
  dot: string;
  status: string;
}

// 2. Variável de Configuração

const PNEUS_API_URL = '/pneus'; 

// 3. Funções de Serviço

/**
 * Busca todos os pneus cadastrados.
 * @returns {Promise<axios.AxiosResponse<Pneu[]>>} Lista de pneus.
 */
export const getPneus = () => {
  return api.get<Pneu[]>(PNEUS_API_URL);
};

/**
 * Cadastra um novo pneu.
 * @param {PneuData} pneuData - Os dados do novo pneu (marca, modelo, dot, status).
 * @returns {Promise<axios.AxiosResponse<Pneu>>} O pneu recém-criado.
 */
export const createPneu = (pneuData: PneuData) => {
  return api.post<Pneu>(PNEUS_API_URL, pneuData);
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