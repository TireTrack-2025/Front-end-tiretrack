// Define o formato do resultado do nosso relatório
export interface RelatorioCpkModelo {
  id: string | number;
  modelo: string;
  kmTotalRodado: number;
  custoTotal: number;
  cpk: number;
}

// O tipo de dado que o backend (mesmo o mock) retornará
export type RelatorioData = RelatorioCpkModelo[];