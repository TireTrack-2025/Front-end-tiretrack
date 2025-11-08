// src/features/dashboard/api/dashboardService.ts

import type { DashboardData } from '@/modules/dashboard/api/types';

const MOCK_DATA: DashboardData = {
  kpis: {
    cpk_medio: 0.19, // R$ 0,19
    pneus_em_uso: 152,
    pneus_em_estoque: 34,
    custo_manutencao_mes: 4520.00, // R$ 4.520,00
  },
  alertas: [
    {
      titulo: "ALERTA: PNEUS EM ESTADO CRÍTICO",
      descricao: "3 pneus estão com o sulco abaixo do limite de segurança.",
      tipo: "critico",
      link: "/pneus?status=critico",
    },
    {
      titulo: "INSPEÇÕES ATRASADAS",
      descricao: "Existem 5 inspeções de veículos vencidas esta semana.",
      tipo: "aviso",
      link: "/inspecoes?status=atrasado",
    },
  ],
  grafico_status: [
    { name: "Em Uso", value: 152, color: "#2563eb" }, // Azul
    { name: "Em Estoque", value: 34, color: "#9ca3af" }, // Cinza
    { name: "Em Manutenção", value: 12, color: "#f59e0b" }, // Laranja
  ],
  grafico_cpk_modelo: [
    { modelo: "Michelin X Multi Z+", cpk: 0.17 },
    { modelo: "Goodyear KMAX S", cpk: 0.18 },
    { modelo: "Pirelli FR88", cpk: 0.21 },
    { modelo: "Bridgestone R164", cpk: 0.23 },
  ],
};

export const getDashboardData = (): Promise<DashboardData> => {
  console.log('CHAMANDO API (MOCK): getDashboardData');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA);
    }, 1000); // 1 segundo de atraso
  });
};