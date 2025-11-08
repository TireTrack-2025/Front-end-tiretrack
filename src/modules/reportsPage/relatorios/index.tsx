import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Importe o DatePicker do Shadcn se já o tiver configurado
// import { DatePicker } from '@/components/ui/date-picker';

import type { RelatorioData } from "@/modules/reportsPage/api/types";
import { getRelatorioCpkPorModelo } from "@/modules/reportsPage/api/reportService";
import { RelatorioResultados } from "@/modules/reportsPage/relatorios/components/RelatorioResultados";

export function RelatoriosPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dadosRelatorio, setDadosRelatorio] = useState<RelatorioData | null>(
    null
  );

  // Estados para os filtros
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date());
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date());

  const handleGerarRelatorio = async () => {
    setIsLoading(true);
    setDadosRelatorio(null);

    try {
      // A tela chama o serviço sem saber que é um mock
      const resposta = await getRelatorioCpkPorModelo(dataInicio!, dataFim!);
      setDadosRelatorio(resposta);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. SEÇÃO DE FILTROS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gerador de Relatórios</CardTitle>
          <CardDescription>
            Selecione os filtros desejados para gerar uma nova análise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select onValueChange={setTipoRelatorio} value={tipoRelatorio}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpk_por_modelo">
                  Desempenho por Modelo de Pneu
                </SelectItem>
                <SelectItem value="custo_por_veiculo" disabled>
                  Custo por Veículo (em breve)
                </SelectItem>
              </SelectContent>
            </Select>

            {/* <DatePicker date={dataInicio} setDate={setDataInicio} /> */}
            {/* <DatePicker date={dataFim} setDate={setDataFim} /> */}

            <Button
              onClick={handleGerarRelatorio}
              disabled={isLoading || !tipoRelatorio}
            >
              {isLoading ? "Gerando..." : "Gerar Relatório"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. SEÇÃO DE RESULTADOS (Renderização Condicional) */}
      {isLoading && (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <p>Analisando dados, por favor aguarde...</p>
        </div>
      )}

      {dadosRelatorio && <RelatorioResultados dados={dadosRelatorio} />}
    </>
  );
}
