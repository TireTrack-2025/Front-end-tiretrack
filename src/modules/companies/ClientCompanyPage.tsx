// src/modules/companies/ClientCompanyPage.tsx

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


import { getEmpresas, deleteEmpresa, type Empresa } from '@/services/empresaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientCompanyTable } from './ClientCompanyTable';

export function ClientCompanyPage() {
  
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  
  const fetchEmpresas = async () => {
    setIsLoading(true);
    try {
      const dados = await getEmpresas();
      setEmpresas(dados); 
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  
  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta empresa?")) {
      try {
        await deleteEmpresa(id);
        alert("Empresa excluída com sucesso!");
        fetchEmpresas(); 
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir. Verifique se você tem permissão de SuperAdmin.");
      }
    }
  };

  
  const filteredEmpresas = useMemo(() => {
    if (!searchTerm) return empresas;
    const lowerCaseSearch = searchTerm.toLowerCase();

   
    return empresas.filter(empresa =>
      (empresa.nome_fantasia || empresa.username).toLowerCase().includes(lowerCaseSearch) ||
      (empresa.cnpj && empresa.cnpj.includes(searchTerm))
    );
  }, [empresas, searchTerm]);

  const handleCadastrarEmpresa = () => {
    navigate('/empresas/cadastrar'); 
  };
  
  const totalEmpresas = empresas.length;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* HEADER DA PÁGINA */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Empresas Clientes</h1>
        <Button onClick={handleCadastrarEmpresa}>
          <Plus className="mr-2 size-4" /> Cadastrar Empresa
        </Button>
      </div>

     
      <p className="text-muted-foreground">
        {totalEmpresas} empresas cadastradas
      </p>

      {/* BARRA DE BUSCA */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
        </div>
      </div>

      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="ml-2">Carregando dados...</p>
        </div>
      ) : (
    
        <ClientCompanyTable companies={filteredEmpresas} onDelete={handleDelete} />
      )}
    </div>
  );
}