import React, { useEffect, useState } from 'react';
import { getPneus, createPneu, getPneuStatusResumo, type PneuData } from '../services/pneuService'; 
import { Wrench, Warehouse, Trash2, Calendar, DollarSign } from 'lucide-react';

interface Pneu {
 id: number; 
 numero_serie: string;
 marca: string; 
 modelo: string; 
 dimensoes: string;
 indice_carga_velocidade: string;
 status_atual: 'Em uso' | 'Em estoque' | 'Em manutenção' | 'Descartado';
 quilometragem_total_acumulada: number;
 limite_recapeamentos: number;
 valor_compra: number;
 data_aquisicao: string;
}

interface PneuStatusResumo {
  emUso: number;
  emEstoque: number;
  emManutencao: number;
  descartado: number;
}

interface StatusCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

export function PneusPage() {
    // 1. ESTADOS FALTANTES E CORRIGIDOS:
  const [pneus, setPneus] = useState<Pneu[]>([]);
  const [resumoStatus, setResumoStatus] = useState<PneuStatusResumo | null>(null); 
  const [loading, setLoading] = useState(true); 

  // Função para Buscar Pneus da API (NOME UNIFICADO: fetchPneusData)
  const fetchPneusData = async () => {
    try {
            setLoading(true); 
      const [pneusResponse, resumoResponse] = await Promise.all([
        getPneus(), 
        getPneuStatusResumo(), 
      ]);
      
      setPneus(pneusResponse.data);
      setResumoStatus(resumoResponse.data);
      
    } catch (error) {
      console.error("Erro ao buscar dados de pneus:", error);
    } finally {
            setLoading(false); 
        }
  };

  
  useEffect(() => {
    fetchPneusData();
  }, []);


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Wrench className="size-6" /> Gestão de Pneus e Rastreamento
      </h1>
      
      {/* A. DASHBOARD DE STATUS */}
      <h2 className="text-xl font-semibold mb-3">Status Rápido da Frota</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
      {/* O resumoStatus foi declarado acima e agora funciona */}
        <StatusCard icon={<Wrench />} title="Em Uso" value={resumoStatus?.emUso || 0} color="border-l-blue-500" />
        <StatusCard icon={<Warehouse />} title="Em Estoque" value={resumoStatus?.emEstoque || 0} color="border-l-green-500" />
        <StatusCard icon={<Wrench />} title="Em Manutenção" value={resumoStatus?.emManutencao || 0} color="border-l-yellow-500" />
        <StatusCard icon={<Trash2 />} title="Descartados" value={resumoStatus?.descartado || 0} color="border-l-red-500" />
      </div>

      {/* B. CADASTRO DETALHADO */}
      <h2 className="text-xl font-semibold mb-4">Cadastrar Novo Pneu</h2>
      {/* fetchPneusData é passado como prop */}
      <CadastroForm fetchPneusData={fetchPneusData} />
      
      <hr className="my-8" />

      {/* C. TABELA/LISTAGEM */}
      <h2 className="text-xl font-semibold mb-4">Inventário Completo de Pneus</h2>
      {loading ? (
        <p>Carregando inventário...</p>
      ) : (
        <TabelaPneus pneus={pneus} />
      )}
    </div>
  );
}


const StatusCard = ({ title, value, icon, color }: StatusCardProps) => (
  <div className={`p-4 bg-white rounded-lg shadow border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      {icon}
    </div>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const CadastroForm = ({ fetchPneusData }: { fetchPneusData: () => Promise<void> }) => {
    // 2. ESTADOS DO FORMULÁRIO
  const [numeroSerie, setNumeroSerie] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
  const [dimensoes, setDimensoes] = useState('');
    const [indiceCarga, setIndiceCarga] = useState('');
    const [dataAquisicao, setDataAquisicao] = useState('');
  const [valorCompra, setValorCompra] = useState('');
  const [limiteRecap, setLimiteRecap] = useState(1);
    const [mensagemForm, setMensagemForm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        setMensagemForm("Cadastrando...");

        const data: PneuData = {
            numero_serie: numeroSerie,
            marca: marca,
            modelo: modelo,
            dimensoes: dimensoes,
            indice_carga_velocidade: indiceCarga,
            data_aquisicao: dataAquisicao,
            valor_compra: parseFloat(valorCompra),
            limite_recapeamentos: limiteRecap,
            // status_atual será 'Em estoque' por padrão no service
        };

        try {
            await createPneu(data); 
            setMensagemForm("Pneu cadastrado com sucesso!");
            // Limpa o formulário
            setNumeroSerie('');
            setMarca('');
            setModelo('');
            setDimensoes('');
            setIndiceCarga('');
            setDataAquisicao('');
            setValorCompra('');
            setLimiteRecap(0);
            
      fetchPneusData(); // Atualiza a lista da página pai
        } catch (error) {
            setMensagemForm("Falha ao cadastrar o pneu.");
            console.error("Erro no cadastro:", error);
        }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
      {/* Linha 1: Identificação */}
      <input placeholder="Nº de Série (Único)" required value={numeroSerie} onChange={e => setNumeroSerie(e.target.value)} />
      <input placeholder="Marca" required value={marca} onChange={e => setMarca(e.target.value)} />
      <input placeholder="Modelo" required value={modelo} onChange={e => setModelo(e.target.value)} />

      {/* Linha 2: Especificações Técnicas */}
      <input placeholder="Dimensões (ex: 295/80R22.5)" required value={dimensoes} onChange={e => setDimensoes(e.target.value)} />
      <input placeholder="Índice Carga/Velocidade" value={indiceCarga} onChange={e => setIndiceCarga(e.target.value)} />
      <input type="number" placeholder="Limite Recapeamentos" min="0" value={limiteRecap} onChange={e => setLimiteRecap(parseInt(e.target.value))} />

      {/* Linha 3: Financeiro e Data */}
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" />
        <input type="date" required value={dataAquisicao} onChange={e => setDataAquisicao(e.target.value)} /> 
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="size-4 text-muted-foreground" />
        <input type="number" placeholder="Valor de Compra" min="0" required value={valorCompra} onChange={e => setValorCompra(e.target.value)} />
      </div>
            <div className="flex flex-col gap-1">
          <button type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition">
            Cadastrar Pneu
          </button>
                {mensagemForm && <p className={`text-xs mt-1 ${mensagemForm.startsWith('Falha') ? 'text-red-500' : 'text-green-500'}`}>{mensagemForm}</p>}
            </div>
    </form>
  );
};

const TabelaPneus = ({ pneus }: { pneus: Pneu[] }) => (
  <div className="overflow-x-auto rounded-lg border">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
                <tr className="bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Série</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca/Modelo</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensões</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Atual</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM Acumulada</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {pneus.map(pneu => (
          <tr key={pneu.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pneu.numero_serie}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pneu.marca} / {pneu.modelo}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pneu.dimensoes}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                pneu.status_atual === 'Em uso' ? 'bg-blue-100 text-blue-800' :
                pneu.status_atual === 'Em estoque' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {pneu.status_atual}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pneu.quilometragem_total_acumulada.toLocaleString()} km</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button className="text-indigo-600 hover:text-indigo-900 mr-3">Detalhes</button>
              <button className="text-red-600 hover:text-red-900">Mudar Status</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);