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

  const fetchVeiculos = async () => {
    try {
      const response = await getVeiculos();
      setVeiculos(response.data);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      setMensagem("Erro ao carregar a frota.");
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
    
    <div style={{ padding: '2rem' }}>
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Truck className='size-6'/>
          Cadastrar Novo Veículo 
          </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input value={placa} onChange={e => setPlaca(e.target.value)} placeholder="Placa (ex: ABC-1234)" required />
            <input value={marca} onChange={e => setMarca(e.target.value)} placeholder="Marca (ex: Volvo)" required />
            <input value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Modelo (ex: FH 540)" required />
            <input type="number" value={ano} onChange={e => setAno(parseInt(e.target.value))} placeholder="Ano (ex: 2022)" required min="1900" max={new Date().getFullYear() + 1} />
            <input type="number" value={quilometragemAtual} onChange={e => setQuilometragemAtual(parseInt(e.target.value))} placeholder="KM Atual (RF06)" required min="0" />
            <input value={configuracaoEixos} onChange={e => setConfiguracaoEixos(e.target.value)} placeholder="Config. Eixos (ex: 3 eixos, truck) (RF01)" required />
          </div>

          <button type="submit">Adicionar Veículo</button>
          {mensagem && <p>{mensagem}</p>}
        </form>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* ... (Listagem de Frota Atual) ... */}
      <div>
        <h2>Frota Atual</h2>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          {veiculos.length > 0 ? (
            <ul>
              {veiculos.map(veiculo => (
                <li key={veiculo.id}>
                  <strong>{veiculo.marca} {veiculo.modelo}</strong> - Placa: {veiculo.placa} | KM: {veiculo.quilometragem_atual.toLocaleString()} | Eixos: {veiculo.configuracao_eixos}
                </li>
              ))}
            </ul>
          ) : (
            <p>Carregando frota...</p>
          )}
        </div>
      </div>
    </div>
  );
}