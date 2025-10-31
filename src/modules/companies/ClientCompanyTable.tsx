
import React from 'react';
import { type ClientCompany } from '@/types/company';
import { cn } from '@/lib/utils'; 

interface ClientCompanyTableProps {
  companies: ClientCompany[];
}

// Subcomponente para estilizar o status
const StatusBadge: React.FC<{ status: ClientCompany['status'] }> = ({ status }) => {
  const isActive = status === 'Ativo';
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      )}
    >
      {status}
    </span>
  );
};

export const ClientCompanyTable: React.FC<ClientCompanyTableProps> = ({ companies }) => {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-secondary/20 text-secondary-foreground">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome da Empresa</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">CNPJ</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Usuários ativos</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Data Cadastro</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-secondary/10 cursor-pointer">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">{company.nome}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{company.cnpj}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <StatusBadge status={company.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{company.usuariosAtivos}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{company.dataCadastro}</td>
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