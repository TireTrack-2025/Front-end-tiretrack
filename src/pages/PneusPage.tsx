import React, { useEffect, useState } from 'react';
import { getPneus, createPneu, getPneuStatusResumo, type PneuData } from '../services/pneuService'; 
import { Wrench, Warehouse, Trash2 } from 'lucide-react';

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
    <div className="p-8 bg-[#0D202C]">
      <h1 className="text-2xl text-white font-bold mb-6 flex items-center gap-3">
        <Wrench className="size-6" /> Gestão de Pneus e Rastreamento
      </h1>
      
      {/* A. DASHBOARD DE STATUS */}
      <h2 className="text-xl text-white font-semibold mb-3">Status Rápido da Frota</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
      {/* O resumoStatus foi declarado acima e agora funciona */}
        <StatusCard icon={<Wrench />} title="Em Uso" value={resumoStatus?.emUso || 0} color="border-l-blue-500" />
        <StatusCard icon={<Warehouse />} title="Em Estoque" value={resumoStatus?.emEstoque || 0} color="border-l-green-500" />
        <StatusCard icon={<Wrench />} title="Em Manutenção" value={resumoStatus?.emManutencao || 0} color="border-l-orange-500" />
        <StatusCard icon={<Trash2 />} title="Descartados" value={resumoStatus?.descartado || 0} color="border-l-red-500" />
      </div>

      {/* B. CADASTRO DETALHADO */}
      <h2 className="text-xl text-white font-semibold mb-4">Cadastrar Novo Pneu</h2>
      {/* fetchPneusData é passado como prop */}
      <CadastroForm fetchPneusData={fetchPneusData} />

      {/* C. TABELA/LISTAGEM */}
      <h2 className="text-xl text-white font-semibold mb-4 mt-8">Inventário Completo de Pneus</h2>
      {loading ? (
        <p>Carregando inventário...</p>
      ) : (
        <TabelaPneus pneus={pneus} />
      )}
    </div>
  );
}


const StatusCard = ({ title, value, icon, color }: StatusCardProps) => (
  <div className={`p-4 bg-[#1B2D3B] text-white rounded-lg shadow border-l-4 ${color}`}>
    <div className="flex items-center justify-between ">
      <span className="text-sm font-medium ">{title}</span>
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
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-[#1B2D3B]">
      {/* Linha 1: Identificação */}
      <div className="flex flex-col gap-1">
        <label htmlFor="placa-veiculo" className="text-sm font-medium text-white">Placa do Veículo *</label>
        <input placeholder="Nº de Série (Único)" className='text-white' required value={numeroSerie} onChange={e => setNumeroSerie(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor='marca' className='text-sm font-medium text-white'>Marca do Veículo *</label>
        <input placeholder="Ex: Michelin" className='text-white' required value={marca} onChange={e => setMarca(e.target.value)} />
      </div>
      
      <div className="flex flex-col gap-1">
        <label htmlFor='modelo' className='text-sm font-medium text-white'>Modelo do Veículo *</label>
        <input placeholder="Ex: G88" className='text-white' required value={modelo} onChange={e => setModelo(e.target.value)} />
      </div>

      {/* Linha 2: Especificações Técnicas */}
      <div className="flex flex-col gap-1">
        <label htmlFor='dimensoes' className='text-sm font-medium text-white'>Dimensões *</label>
        <input placeholder="Ex: 295/80R22.5" className='text-white' required value={dimensoes} onChange={e => setDimensoes(e.target.value)} />
      </div>
      
      <div className="flex flex-col gap-1">
        <label htmlFor='indice-carga' className='text-sm font-medium text-white'>Índice</label>
        <input placeholder="Índice Carga/Velocidade" className='text-white' value={indiceCarga} onChange={e => setIndiceCarga(e.target.value)} />
      </div>
      
      <div className="flex flex-col gap-1">
        <label htmlFor='limite-recap' className='text-sm font-medium text-white'>Limite de Recapeamentos</label>
        <input type="number" placeholder="Limite Recapeamentos" className='text-white' min="0" value={limiteRecap} onChange={e => setLimiteRecap(parseInt(e.target.value))} />
      </div>

      {/* Linha 3: Financeiro e Data */}
      <div className="flex flex-col gap-1">
        <label htmlFor='data-aquisicao' className='text-sm font-medium text-white'>Data de Aquisição *</label>
        <input type="date" className='text-white' required value={dataAquisicao} onChange={e => setDataAquisicao(e.target.value)} /> 
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor='valor-compra' className='text-sm font-medium text-white'>Valor da Compra</label>
        <input type="number" placeholder="0,00" className='text-white' min="0" required value={valorCompra} onChange={e => setValorCompra(e.target.value)} />
      </div>
            <div className="flex flex-col gap-1">
          <button type="submit" className="bg-[#2b4c7e] text-white font-bold rounded p-2 hover:bg-orange-400 transition">
            Cadastrar Pneu
          </button>
                {mensagemForm && <p className={`text-xs mt-1 ${mensagemForm.startsWith('Falha') ? 'text-red-500' : 'text-green-500'}`}>{mensagemForm}</p>}
            </div>
    </form>
  );
};

const TabelaPneus = ({ pneus }: { pneus: Pneu[] }) => (
  <div className="overflow-x-auto rounded-lg bg-[#1B2D3B]">
    <table className="min-w-full divide-y divide-border">
      <thead >
          <tr className="bg-[#1B2D3B]">
          <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nº Série</th> 
          <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marca/Modelo</th>
          <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dimensões</th>
          <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status Atual</th>
          <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">KM Acumulada</th>
          <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
        </tr>
        
      </thead>
      
      <tbody className="bg-[#1B2D3B]">
        {pneus.map(pneu => (
          <tr key={pneu.id}>
            <td className="px-6 py-4 text-white whitespace-nowrap text-sm font-medium text-gray-900">{pneu.numero_serie}</td>
            <td className="px-6 py-4 text-white whitespace-nowrap text-sm text-gray-500">{pneu.marca} / {pneu.modelo}</td>
            <td className="px-6 py-4 text-white whitespace-nowrap text-sm text-gray-500">{pneu.dimensoes}</td>
            <td className="px-6 py-4  whitespace-nowrap text-sm">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                pneu.status_atual === 'Em uso' ? 'bg-blue-300 text-blue-800' :
                pneu.status_atual === 'Em estoque' ? 'bg-green-300 text-green-800' :
                'bg-orange-300 text-orange-800'
              }`}>
                {pneu.status_atual}
              </span>
            </td>
            <td className="px-6 py-4 text-white whitespace-nowrap text-sm text-gray-500">{pneu.quilometragem_total_acumulada.toLocaleString()} km</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button className="text-blue-300 hover:text-blue-500 mr-3">Detalhes</button>
              <button className="text-red-500 hover:text-red-800">Mudar Status</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);