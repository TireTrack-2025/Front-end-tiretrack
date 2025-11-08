import type { RelatorioData } from '@/modules/reportsPage/api/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RelatorioResultadosProps {
  dados: RelatorioData;
}

export function RelatorioResultados({ dados }: RelatorioResultadosProps) {
  
  // Função para formatar o valor como R$ 0,023
  const formatarCPK = (valor: number) => `R$ ${valor.toFixed(3)}`;
  const formatarDinheiro = (valor: number) => `R$ ${valor.toFixed(2)}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resultado: Desempenho por Modelo</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> Imprimir</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Baixar PDF</Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* GRÁFICO VISUAL */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados}>
              <XAxis dataKey="modelo" tick={{ fontSize: 12 }} />
              <YAxis dataKey="cpk" tickFormatter={formatarCPK} />
              <Tooltip formatter={(value: number) => [formatarCPK(value), "CPK"]} />
              <Bar dataKey="cpk" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TABELA DETALHADA */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modelo do Pneu</TableHead>
              <TableHead>KM Total Rodado</TableHead>
              <TableHead>Custo Total (R$)</TableHead>
              <TableHead>CPK Calculado (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.modelo}</TableCell>
                <TableCell>{item.kmTotalRodado.toFixed(2)} km</TableCell>
                <TableCell>{formatarDinheiro(item.custoTotal)}</TableCell>
                <TableCell className="font-bold">{formatarCPK(item.cpk)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}