// src/pages/EstoquePage.tsx

import React, { useEffect, useState } from 'react';
import { getEstoqueResumo, type EstoqueResumo } from '../services/estoqueService';
import { Link } from 'react-router-dom';
import { Truck, Warehouse, CheckCircle, Car, Wrench, Cog, Archive} from 'lucide-react';


interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, color }) => (
  <div className={`p-5 rounded-lg shadow-md flex flex-col justify-between h-40 border-l-4 ${color} bg-white transition-shadow hover:shadow-lg`}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      {icon}
    </div>
    <p className="text-4xl font-bold text-gray-900 mt-2">{value.toLocaleString('pt-BR')}</p>
    <span className="text-xs text-muted-foreground mt-1">{description}</span>
  </div>
);

export function EstoquePage() {
  const [resumo, setResumo] = useState<EstoqueResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ... (função fetchResumo e useEffect permanecem iguais) ...
  const fetchResumo = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getEstoqueResumo(); 
      setResumo(response.data);
    } catch (err) {
      console.error("Erro ao buscar resumo de estoque:", err);
      setError("Não foi possível carregar os dados de resumo do estoque.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumo();
  }, []);

 return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
            <Archive className="size-8" /> 
            Inventário Geral
        </h1>
      </header>
      
      {loading && <p className="text-lg text-blue-500">Carregando dados...</p>}
      {error && <p className="text-lg text-red-500">Erro: {error}</p>}

      {!loading && resumo && (
        <>
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Frota e Veículos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <StatCard 
                        title="Total de Veículos"
                        value={resumo.totalVeiculos}
                        icon={<Truck className="size-6 text-indigo-500" />}
                        description="Caminhões e carretas cadastrados."
                        color="border-l-indigo-500"
                    />

                    <StatCard 
                        title="Veículos Ativos"
                        value={resumo.veiculosAtivos}
                        icon={<CheckCircle className="size-6 text-green-500" />}
                        description="Veículos aptos a rodar."
                        color="border-l-green-500"
                    />

                    {/* Adicionar mais cards de veículos aqui (ex: Veículos em Manutenção) */}
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Estoque e Status dos Pneus</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <StatCard 
                        title="Total de Pneus"
                        value={resumo.totalPneus}
                        icon={<Cog className="size-6 text-gray-500" />}
                        description="Total de pneus gerenciados pelo sistema."
                        color="border-l-gray-500"
                    />

                    <StatCard 
                        title="Em Uso"
                        value={resumo.pneusEmUso}
                        icon={<Truck className="size-6 text-blue-500" />}
                        description="Pneus atualmente montados nos veículos."
                        color="border-l-blue-500"
                    />
                    
                    <StatCard 
                        title="Em Estoque"
                        value={resumo.pneusEmEstoque}
                        icon={<Warehouse className="size-6 text-teal-500" />}
                        description="Pneus disponíveis para montagem."
                        color="border-l-teal-500"
                    />
                    
                    <StatCard 
                        title="Em Manutenção"
                        value={resumo.pneusEmManutencao + resumo.pneusDescartados}
                        icon={<Wrench className="size-6 text-red-500" />}
                        description="Pneus em conserto ou descartados."
                        color="border-l-red-500"
                    />
                    
                </div>
            </section>
        </>
      )}
      
      <hr className="my-8" />
      
      {/* Links Rápidos de Gestão */}
      <footer className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Links Rápidos</h2>
        <div className="flex flex-wrap gap-4">
            <Link to="/veiculos" className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition">
                <Car className="size-5" /> Gerenciar Frota
            </Link>
            <Link to="/pneus" className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition">
                <Wrench className="size-5" /> Gerenciar Pneus
            </Link>
        </div>
      </footer>
    </div>
  );
}