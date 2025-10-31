import React, { useEffect, useState } from 'react';
import { getPneus, createPneu } from '../services/pneuService';

interface Pneu {
  id: number; // Exemplo 
  marca: string; // Exemplo 
  modelo: string; // Exemplo 
  dot: string; // Exemplo 
  status: string; // Exemplo: 'Novo', 'Em Uso', 'Reformado'
}

export function PneusPage() {
  //Estados para Gerenciamento de Dados e UI 
  const [pneus, setPneus] = useState<Pneu[]>([]);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [dot, setDot] = useState('');
  const [status, setStatus] = useState('Novo'); // Valor inicial
  const [mensagem, setMensagem] = useState('');

  //Função para Buscar Pneus da API 
  const fetchPneus = async () => {
    try {
      // Assumindo que getPneus() retorna uma resposta com data: Pneu[]
      const response = await getPneus(); 
      setPneus(response.data);
    } catch (error) {
      console.error("Erro ao buscar pneus:", error);
      setMensagem("Erro ao carregar o estoque de pneus.");
    }
  };

  //Efeito: Carregar Pneus ao Montar o Componente 
  useEffect(() => {
    fetchPneus();
  }, []);

  //Função para Enviar o Formulário de Cadastro 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("Cadastrando pneu...");
    try {
      // Envia os dados para a API
      await createPneu({ marca, modelo, dot, status });
      
      setMensagem("Pneu cadastrado com sucesso!");
      
      // Limpa os campos e atualiza a lista
      setMarca('');
      setModelo('');
      setDot('');
      setStatus('Novo'); 
      fetchPneus(); // Recarrega a lista para mostrar o novo item
      
    } catch (error) {
      console.error("Erro ao cadastrar pneu:", error);
      setMensagem("Falha ao cadastrar o pneu.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* Seção de Cadastro */}
      <div>
        <h2>Cadastrar Novo Pneu</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          
          <input 
            value={marca} 
            onChange={e => setMarca(e.target.value)} 
            placeholder="Marca (ex: Pirelli)" 
            required 
          />
          <input 
            value={modelo} 
            onChange={e => setModelo(e.target.value)} 
            placeholder="Modelo (ex: G:88)" 
            required 
          />
          <input 
            value={dot} 
            onChange={e => setDot(e.target.value)} 
            placeholder="Número DOT" 
            required 
          />
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value)}
            required
          >
            <option value="Novo">Novo</option>
            <option value="Em Uso">Em Uso</option>
            <option value="Reformado">Reformado</option>
            <option value="Descartado">Descartado</option>
          </select>

          <button type="submit">Adicionar Pneu</button>
          {mensagem && <p>{mensagem}</p>}
        </form>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* Seção de Listagem */}
      <div>
        <h2>Estoque de Pneus</h2>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          {pneus.length > 0 ? (
            <ul>
              {pneus.map(pneu => (
                <li key={pneu.id}>
                  <strong>{pneu.marca} {pneu.modelo}</strong> - DOT: {pneu.dot} - Status: {pneu.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>Carregando estoque ou nenhum pneu cadastrado...</p>
          )}
        </div>
      </div>
    </div>
  );
}