import React, { useState } from 'react';
import './AnaliseGPU.css'; 

interface ResultadoGPU {
  status: string;
  tecnologia: string;
  mensagem: string;
  tempo_processamento_segundos: number;
  performance: string;
  amostra_resultados: number[];
}

const AnaliseGPU: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [resultado, setResultado] = useState<ResultadoGPU | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const executarAnalise = async () => {
    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      
      const response = await fetch('http://127.0.0.1:8000/api/analise-gpu/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
         
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao comunicar com o servidor. O Backend está rodando?');
      }

      const data: ResultadoGPU = await response.json();
      setResultado(data);

    } catch (err: any) {
      setErro("Falha: " + (err.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gpu-container">
      <h2>⚡ Aceleração via Hardware (OpenCL)</h2>
      <p>Processamento Paralelo de Desgaste de Pneus</p>
      
      <div className="card">
        <h3>Cenário de Teste</h3>
        <p><strong>Volume:</strong> 1.000.000 de Pneus Simulados</p>
        <p><strong>Hardware:</strong> CPU/GPU (Via Intel OpenCL)</p>
        
        <button 
          onClick={executarAnalise} 
          disabled={loading}
          className={loading ? 'btn-loading' : 'btn-start'}
        >
          {loading ? 'Processando na GPU...' : '🚀 Iniciar Simulação Massiva'}
        </button>
      </div>

      {resultado && (
        <div className="resultado-box success">
          <h3>✅ Processamento Concluído!</h3>
          <p><strong>Tecnologia:</strong> {resultado.tecnologia}</p>
          <p><strong>Tempo Total:</strong> {resultado.tempo_processamento_segundos.toFixed(4)} segundos</p>
          <p><strong>Velocidade:</strong> {resultado.performance}</p>
          <div className="code-block">
            <small>Amostra dos dados calculados:</small>
            <pre>{JSON.stringify(resultado.amostra_resultados, null, 2)}</pre>
          </div>
        </div>
      )}

      {erro && (
        <div className="resultado-box error">
          <p>❌ {erro}</p>
        </div>
      )}
    </div>
  );
};

export default AnaliseGPU;