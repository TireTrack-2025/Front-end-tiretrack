// src/modules/companies/ClientCompanyPage.tsx

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { type ClientCompany } from '@/types/company';
import { getEmpresas } from '@/services/empresaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientCompanyTable } from './ClientCompanyTable'; // Importa a tabela

export function ClientCompanyPage() {
  const [empresas, setEmpresas] = useState<ClientCompany[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Função de Carregamento de Dados (Fetch)
  const fetchEmpresas = async () => {
    setIsLoading(true);
    try {
      const response = await getEmpresas();
      setEmpresas(response.data);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  // Lógica de Busca/Filtro
  const filteredEmpresas = useMemo(() => {
    if (!searchTerm) return empresas;
    const lowerCaseSearch = searchTerm.toLowerCase();

    return empresas.filter(empresa =>
      empresa.nome.toLowerCase().includes(lowerCaseSearch) ||
      empresa.cnpj.includes(searchTerm)
    );
  }, [empresas, searchTerm]);

  const handleCadastrarEmpresa = () => {
    // Redireciona para a rota de cadastro (a ser implementada)
    navigate('/empresas/cadastrar'); 
  };
  
  // O número de empresas cadastradas total (antes do filtro)
  const totalEmpresas = empresas.length;

  return (
    // O p-8 pt-6 simula o padding interno da área de conteúdo
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* HEADER DA PÁGINA: Título e Botão de Ação */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Empresas Clientes</h1>
        <Button onClick={handleCadastrarEmpresa}>
          <Plus className="mr-2 size-4" /> Cadastrar Empresa
        </Button>
      </div>

      {/* Estatísticas (170 empresas cadastradas) */}
      <p className="text-muted-foreground">
        {totalEmpresas} empresas cadastradas
      </p>

      {/* BARRA DE BUSCA E AÇÕES */}
      <div className="flex items-center gap-4">
        {/* Input de Busca */}
        <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10" // Adiciona padding para o ícone
            />
        </div>
        {/* Botão de Busca (Opcional: A busca já é feita em tempo real no input) */}
        <Button variant="outline">Buscar</Button> 
      </div>

      {/* CONTEÚDO PRINCIPAL: Tabela */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="ml-2">Carregando dados...</p>
        </div>
      ) : (
        <ClientCompanyTable companies={filteredEmpresas} />
      )}
    </div>
  );
}