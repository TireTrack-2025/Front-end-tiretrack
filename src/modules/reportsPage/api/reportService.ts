import type { RelatorioData } from './types'; // Importando o TIPO

// Nossos dados falsos
const MOCK_DATA: RelatorioData = [
  { id: 1, modelo: 'Michelin X Multi Z+', kmTotalRodado: 120500.50, custoTotal: 2800.00, cpk: 0.023 },
  { id: 2, modelo: 'Pirelli FR88', kmTotalRodado: 95300.00, custoTotal: 2450.00, cpk: 0.025 },
  { id: 3, modelo: 'Goodyear KMAX S', kmTotalRodado: 110000.00, custoTotal: 2700.00, cpk: 0.024 },
  { id: 4, modelo: 'Bridgestone R164', kmTotalRodado: 89000.00, custoTotal: 2300.00, cpk: 0.026 },
];

// A função de serviço "mockada"
export const getRelatorioCpkPorModelo = (dataInicio: Date, dataFim: Date): Promise<RelatorioData> => {
  console.log('CHAMANDO API (MOCK): getRelatorioCpkPorModelo', { dataInicio, dataFim });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA);
    }, 1200); // 1.2 segundos de atraso
  });
};