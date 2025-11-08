// src/features/dashboard/components/ClientAdminDashboard.tsx

import React, { useEffect, useState } from "react";
import { getDashboardData } from "../api/dashboardService";
import type { DashboardData } from "@/modules/dashboard/api/types";

// SHADCN/UI Components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// LUCIDE-REACT Icons
import {
  AlertTriangle,
  ArchiveX,
  Plus,
  ClipboardPen,
  Move,
} from "lucide-react";

// RECHARTS Components
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

export function ClientAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setData(response);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Carregando dados do dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Não foi possível carregar os dados do dashboard.
      </div>
    );
  }

  // --- RENDERING DO DASHBOARD ---
  return (
    <div className="space-y-6">
      {/* 1. SEÇÃO DE ALERTAS E AÇÕES IMEDIATAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.alertas.map((alert, index) => (
          <Alert
            key={index}
            variant={alert.tipo === "critico" ? "destructive" : "default"}
          >
            {" "}
            {/* Default para aviso, destructive para crítico */}
            {alert.tipo === "critico" ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <ArchiveX className="h-4 w-4" />
            )}
            <AlertTitle>{alert.titulo}</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{alert.descricao}</span>
              {alert.link && (
                <Button variant="link" className="px-2 py-0 h-auto text-sm">
                  Ver Detalhes
                </Button>
              )}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Seção de Acessos Rápidos (Botões) - OPCIONAL: você pode querer isso mais acima */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-20 text-lg flex flex-col justify-center items-center">
          <ClipboardPen className="h-6 w-6 mb-1" /> Registrar Inspeção
        </Button>
        <Button className="h-20 text-lg flex flex-col justify-center items-center">
          <Move className="h-6 w-6 mb-1" /> Movimentar Pneu
        </Button>
        <Button className="h-20 text-lg flex flex-col justify-center items-center">
          <Plus className="h-6 w-6 mb-1" /> Adicionar Pneu
        </Button>
      </div>

      {/* 2. SEÇÃO DE KPIS (Indicadores-Chave) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <KpiCard
          titulo="CPK Médio da Frota"
          valor={`R$ ${data.kpis.cpk_medio.toFixed(2)}`}
          descricao="↓ 3% vs. Mês Passado"
        />
        <KpiCard titulo="Pneus em Uso" valor={data.kpis.pneus_em_uso} />
        <KpiCard titulo="Pneus em Estoque" valor={data.kpis.pneus_em_estoque} />
        <KpiCard
          titulo="Custo Manutenção (Mês)"
          valor={`R$ ${data.kpis.custo_manutencao_mes.toFixed(2)}`}
        />
      </div>

      {/* 3. SEÇÃO DE GRÁFICOS RÁPIDOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de Pizza: Distribuição por Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status da Frota de Pneus</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.grafico_status}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent as number) * 100).toFixed(0)}%`
                  }
                >
                  {data.grafico_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} Pneus`,
                    props.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras: Top Modelos por CPK */}
        <Card>
          <CardHeader>
            <CardTitle>CPK por Modelo de Pneu</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.grafico_cpk_modelo}>
                <XAxis dataKey="modelo" tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="cpk"
                  tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
                />
                <Tooltip
                  formatter={(value) => {
                    // 1. Converte o 'value' (que pode ser string ou number) para um número.
                    const numValue = Number(value);

                    // 2. Verifica se a conversão falhou (ex: se o valor era um texto inválido)
                    if (isNaN(numValue)) {
                      return value; // Se não for um número, retorna o valor original
                    }

                    // 3. Se for um número, formata com segurança
                    return `R$ ${numValue.toFixed(3)}`;
                  }}
                />
                <Bar dataKey="cpk" fill="#82ca9d" />{" "}
                {/* Cor padrão, pode ser ajustada dinamicamente */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sub-componente KpiCard (para organizar melhor)
interface KpiCardProps {
  titulo: string;
  valor: string | number;
  descricao?: string;
}

function KpiCard({ titulo, valor, descricao }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{valor}</div>
        {descricao && (
          <p className="text-xs text-muted-foreground">{descricao}</p>
        )}
      </CardContent>
    </Card>
  );
}
