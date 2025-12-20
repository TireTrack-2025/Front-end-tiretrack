// src/services/simulacaoService.ts
import { api } from './api';

export interface SimulacaoParams {
  pressao: number;
  temperatura: number;
  carga: number;
  terreno: 'Asfalto' | 'Terra' | 'Misto';
  velocidade_media: number;
}

export interface ResultadoSimulacao {
  vida_util_restante: number;
  desgaste_previsto: number;
  status_risco: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  tempo_calculo_gpu: string;
}

export const executarSimulacaoGPU = async (params: SimulacaoParams): Promise<ResultadoSimulacao> => {
  const response = await api.post<ResultadoSimulacao>('/simulacao/calcular/', params);
  return response.data;
};