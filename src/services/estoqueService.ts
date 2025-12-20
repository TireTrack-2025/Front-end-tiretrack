// src/services/estoqueService.ts
import { api } from './api';
import { type AxiosResponse } from 'axios';

export interface EstoqueResumo {
  totalVeiculos: number;
  totalPneus: number;
  pneusEmUso: number;
  pneusEmEstoque: number;
  veiculosAtivos: number;
  pneusEmManutencao: number; 
  pneusDescartados: number;
}

export const getEstoqueResumo = async (): Promise<AxiosResponse<EstoqueResumo>> => {
  return api.get<EstoqueResumo>('/inventario/resumo/');
};