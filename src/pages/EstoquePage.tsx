// src/pages/EstoquePage.tsx

import React, { useEffect, useState } from 'react';
import { getEstoqueResumo } from '../services/estoqueService';

// Exemplo
interface EstoqueResumo {
  totalVeiculos: number;
  totalPneus: number;
  pneusEmUso: number;
  pneusEmEstoque: number;
  veiculosAtivos: number;
}

export function EstoquePage() {
  const [resumo, setResumo] = useState<EstoqueResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <div style={{ padding: '2rem' }}>
      <h1>Inventário Geral</h1>
      <p className="text-muted-foreground">Visão consolidada de veículos e pneus da frota.</p>

      {loading && <p>Carregando dados de estoque...</p>}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

      {!loading && resumo && (
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          
          {/* Card de Veículos */}
          <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', minWidth: '250px' }}>
            <h2>Frota</h2>
            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{resumo.totalVeiculos}</p>
            <p>Veículos cadastrados.</p>
            <p>Veículos ativos: {resumo.veiculosAtivos}</p>
          </div>

          {/* Card de Pneus */}
          <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', minWidth: '250px' }}>
            <h2>Pneus</h2>
            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{resumo.totalPneus}</p>
            <p>Pneus no total.</p>
            <p>Em estoque: {resumo.pneusEmEstoque}</p>
            <p>Em uso: {resumo.pneusEmUso}</p>
          </div>
        </div>
      )}
      
      <hr style={{ margin: '3rem 0' }} />
      
    </div>
  );
}