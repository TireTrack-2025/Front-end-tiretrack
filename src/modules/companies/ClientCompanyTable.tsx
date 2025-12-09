import React from 'react';
import { type Empresa } from '@/services/empresaService';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientCompanyTableProps {
  companies: Empresa[];
  onDelete: (id: number) => void;
}

const StatusBadge: React.FC<{ ativo: boolean }> = ({ ativo }) => {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        ativo
          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      )}
    >
      {ativo ? 'Ativo' : 'Inativo'}
    </span>
  );
};

export const ClientCompanyTable: React.FC<ClientCompanyTableProps> = ({ companies, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-secondary/20 text-secondary-foreground">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome da Empresa</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">CNPJ</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-secondary/10">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">
                {company.nome_fantasia || company.username}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                {company.cnpj || '-'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <StatusBadge ativo={company.status_assinatura} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                {company.email}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onDelete(company.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
          {companies.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-muted-foreground">
                Nenhuma empresa encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};