// src/services/estoqueService.ts

import {api} from './api';

interface EstoqueResumo {
    totalVeiculos: number;
    totalPneus: number;
    pneusEmUso: number;
    pneusEmEstoque: number;
    veiculosAtivos: number;
}

export const getEstoqueResumo = () => {
  return api.get<EstoqueResumo>('/inventario/resumo'); 
};