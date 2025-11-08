// src/features/dashboard/api/types.ts

// Tipos para os dados específicos do dashboard
interface KpiData {
  cpk_medio: number;
  pneus_em_uso: number;
  pneus_em_estoque: number;
  custo_manutencao_mes: number;
}

interface AlertaItem {
  titulo: string;
  descricao: string;
  tipo: "critico" | "aviso";
  link?: string;
}

interface GraficoStatusItem {
  name: string;
  value: number;
  color: string; // Adicione uma cor para as fatias do gráfico
  [key: string]: any;
}

interface GraficoCpkModeloItem {
  modelo: string;
  cpk: number;
  color?: string; // Para destacar o melhor/pior
}

// O DTO completo que a tela espera
export interface DashboardData {
  kpis: KpiData;
  alertas: AlertaItem[];
  grafico_status: GraficoStatusItem[];
  grafico_cpk_modelo: GraficoCpkModeloItem[];
}
