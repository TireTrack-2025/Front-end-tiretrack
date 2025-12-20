import React, { useEffect, useState } from 'react';
import { getVeiculos, createVeiculo, type Veiculo, type VeiculoData } from '../services/veiculoService';
import { Truck } from 'lucide-react';

export function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [quilometragemAtual, setQuilometragemAtual] = useState(0);
  const [configuracaoEixos, setConfiguracaoEixos] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVeiculos = async () => {
    try {
      setLoading(true);
      const response = await getVeiculos();
      setVeiculos(response.data);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      setMensagem("Erro ao carregar a frota.");
    } finally {
            setLoading(false); 
        }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("Cadastrando...");

    const data: VeiculoData = { 
        placa, 
        marca, 
        modelo, 
        ano, 
        quilometragem_atual: quilometragemAtual, 
        configuracao_eixos: configuracaoEixos
    };

    try {
     await createVeiculo(data); 
      setMensagem("Veículo cadastrado com sucesso!");
      // Limpa os campos e atualiza a lista de veículos na tela
      fetchVeiculos(); 
    } catch (error) {
      console.error("Erro ao cadastrar veículo:", error);
      setMensagem("Falha ao cadastrar o veículo.");
    }
  };


  return ( 
    
    <div className='p-8 bg-[#0D202C]'>
      <div>
        <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-3">
          <Truck className='size-6 '/>
          Cadastrar Novo Veículo 
          </h2>

        <form onSubmit={handleSubmit} className="p-6 rounded-lg bg-[#1B2D3B]">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 ">
            <div className="flex flex-col gap-1 ">
            <label htmlFor="placa-veiculo" className="text-sm font-medium text-white">Placa do Veículo *</label>
            <input value={placa} onChange={e => setPlaca(e.target.value)} className='text-white' placeholder="Ex: ABC-1234" required />
            </div>
            
            <div className="flex flex-col gap-1">
            <label htmlFor="marca" className="text-sm font-medium text-white">Marca do Veículo *</label>
            <input value={marca} onChange={e => setMarca(e.target.value)} className='text-white' placeholder="Ex: Volvo" required />
            </div>
            
            <div className="flex flex-col gap-1">
            <label htmlFor="modelo" className="text-sm font-medium text-white">Modelo do Veículo *</label>
            <input value={modelo} onChange={e => setModelo(e.target.value)} className='text-white' placeholder="Modelo (ex: FH 540)" required />
            </div>

            <div className="flex flex-col gap-1">
            <label htmlFor="numero-km" className="text-sm font-medium text-white">Quilometragem Atual *</label>
            <input type="number" value={quilometragemAtual} onChange={e => setQuilometragemAtual(parseInt(e.target.value))} className='text-white' placeholder="KM Atual" required min="0" />
            </div>
            
            <div className="flex flex-col gap-1">
            <label htmlFor="ano" className="text-sm font-medium text-white">Ano *</label>
            <input type="number" value={ano} onChange={e => setAno(parseInt(e.target.value))} className='text-white' placeholder="Ex: 2022" required min="1900" max={new Date().getFullYear() + 1} />
            </div>

            <div className="flex flex-col gap-1">
            <label htmlFor="eixos" className="text-sm font-medium text-white">Configuração dos Eixos *</label>
            <input value={configuracaoEixos} onChange={e => setConfiguracaoEixos(e.target.value)} className='text-white' placeholder="Ex: 3 eixos, truck" required />
            </div>

          </div>

          <div className="flex items-center mt-4 gap-2">
          <button type="submit"className="w-100 bg-[#003b5c] hover:bg-orange-400 text-white rounded p-2 transition">
            Adicionar Veículo</button>
          {mensagem && <p className={`text-sm mt-2 text-center ${mensagem.includes('Falha') ? 'text-red-500' : 'text-green-600'}`}>{mensagem}</p>}
          </div>
        </form>
      </div>

      {/* ... (Listagem de Frota Atual) ... */}
      <div>
        <h2 className="text-2xl text-white font-bold mb-4 mt-8 flex items-center gap-3 text-gray-800">
          Frota Atual
          </h2>
        
        <div className=" overflow-x-auto rounded-lg bg-[#1B2D3B]">
          {veiculos.length > 0 ? (
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-[#1B2D3B]">
                            <th className="px-6 py-3 text-left text-white text-xs font-bold text-gray-500 uppercase tracking-wider">Placa</th>
                            <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marca/Modelo</th>
                            <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ano</th>
                            <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Config. Eixos</th>
                            <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">KM Atual</th>
                            <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-white text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
              </thead>
              <tbody className="bg-[#1B2D3B]">
                        {veiculos.map(veiculo => (
                            <tr key={veiculo.id}>
                                {/* Placa */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{veiculo.placa}</td>
                                
                                {/* Marca/Modelo */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                    <strong>{veiculo.marca}</strong> {veiculo.modelo}
                                </td>
                                
                                {/* Ano */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{veiculo.ano}</td>
                                
                                {/* Configuração de Eixos */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{veiculo.configuracao_eixos}</td>
                                
                                {/* KM Atual */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{veiculo.quilometragem_atual.toLocaleString('pt-BR')} km</td>
                                
                                {/* Status (Ativo/Inativo) */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        veiculo.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {veiculo.ativo ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                
                                {/* Ações */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-300 hover:text-blue-500 mr-3">Gerenciar Pneus</button>
                                    <button className="text-orange-500 hover:text-orange-800">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </table>
          ) : (
            <p className="p-4 text-center text-gray-500">
                    {/* Se o loading for false e não houver veículos */}
                    {veiculos.length === 0 && !loading ? 'Nenhum veículo cadastrado na frota.' : 'Carregando frota...'}
                </p>
            )}
        </div>
      </div>
    </div>
  );
}