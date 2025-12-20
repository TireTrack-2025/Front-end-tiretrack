// src/services/estoqueService.ts
import { type AxiosResponse } from 'axios';

// Interface de Resumo (Baseada na sua definição)
export interface EstoqueResumo {
  totalVeiculos: number;
  totalPneus: number;
  pneusEmUso: number;
  pneusEmEstoque: number;
  veiculosAtivos: number;
  // Adicionamos um campo para pneus em manutenção/descartados para refletir o RF08
  pneusEmManutencao: number; 
  pneusDescartados: number;
}

// MOCK DE DADOS
const mockEstoqueResumo: EstoqueResumo = {
    totalVeiculos: 150,
    totalPneus: 850,
    veiculosAtivos: 125,
    pneusEmUso: 600,
    pneusEmEstoque: 150,
    pneusEmManutencao: 80,
    pneusDescartados: 20,
};

/**
 * Busca o resumo consolidado do Inventário (Frota e Pneus).
 * (RF08: Dashboard)
 */
export const getEstoqueResumo = async (): Promise<AxiosResponse<EstoqueResumo>> => {
  // Simula um delay de rede
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  // Em produção, seria: return api.get<EstoqueResumo>('/inventario/resumo');
  return { 
      data: mockEstoqueResumo, 
      status: 200, 
      statusText: 'OK', 
      headers: {}, 
      config: {} 
  } as AxiosResponse<EstoqueResumo>;
};