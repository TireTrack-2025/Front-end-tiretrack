// src/pages/SimulacaoPage.tsx

import React, { useState } from 'react';
import { executarSimulacaoGPU, type SimulacaoParams, type ResultadoSimulacao } from '../services/simulacaoService';
import { Cpu, Activity, Gauge, Thermometer, Truck, AlertTriangle } from 'lucide-react';

export function SimulacaoPage() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null);
  const [erroApi, setErroApi] = useState('');

  const [pressao, setPressao] = useState(110);
  const [temperatura, setTemperatura] = useState(30);
  const [carga, setCarga] = useState(15);
  const [velocidade, setVelocidade] = useState(80);
  const [terreno, setTerreno] = useState<'Asfalto' | 'Terra' | 'Misto'>('Asfalto');

  const handleSimular = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null); 
    setErroApi('');

    const params: SimulacaoParams = {
        pressao,
        temperatura,
        carga,
        velocidade_media: velocidade,
        terreno
    };

    try {
        const res = await executarSimulacaoGPU(params);
        setResultado(res);
    } catch (error: any) {
        console.error("Erro na simulação", error);
        setErroApi("Erro ao conectar com o servidor. Verifique se o Backend está rodando.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3 text-indigo-700">
            <Cpu className="size-8" /> 
            Simulação de Desgaste
        </h1>
        <p className="text-muted-foreground mt-2">
            Utilize o processamento paralelo para calcular a vida útil dos pneus em cenários extremos.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Activity className="size-5 text-gray-500" /> Parâmetros do Cenário
            </h2>
            
            <form onSubmit={handleSimular} className="space-y-6">
                
                <div>
                    <label className="flex justify-between text-sm font-medium mb-2">
                        <span className="flex items-center gap-2"><Gauge className="size-4"/> Pressão (PSI)</span>
                        <span className="text-indigo-600 font-bold">{pressao} PSI</span>
                    </label>
                    <input type="range" min="80" max="130" value={pressao} onChange={e => setPressao(Number(e.target.value))} className="w-full cursor-pointer accent-indigo-600" />
                </div>

                <div>
                    <label className="flex justify-between text-sm font-medium mb-2">
                        <span className="flex items-center gap-2"><Thermometer className="size-4"/> Temperatura Pista (°C)</span>
                        <span className="text-orange-600 font-bold">{temperatura}°C</span>
                    </label>
                    <input type="range" min="0" max="80" value={temperatura} onChange={e => setTemperatura(Number(e.target.value))} className="w-full cursor-pointer accent-orange-600" />
                </div>

                <div>
                    <label className="flex justify-between text-sm font-medium mb-2">
                        <span className="flex items-center gap-2"><Truck className="size-4"/> Carga (Toneladas)</span>
                        <span className="text-blue-600 font-bold">{carga} T</span>
                    </label>
                    <input type="range" min="5" max="50" value={carga} onChange={e => setCarga(Number(e.target.value))} className="w-full cursor-pointer accent-blue-600" />
                </div>

                 <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Terreno</label>
                    <div className="flex gap-4">
                        {['Asfalto', 'Terra', 'Misto'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTerreno(t as any)}
                                className={`flex-1 py-2 px-4 rounded border transition ${terreno === t ? 'bg-indigo-100 border-indigo-500 text-indigo-700 font-bold' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow transition flex justify-center items-center gap-2"
                >
                    {loading ? (
                        <>Processando...</>
                    ) : (
                        <><Cpu className="size-5" /> Executar Simulação</>
                    )}
                </button>
            </form>
        </div>

        <div className="flex flex-col gap-6">
            
            {erroApi && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <strong>Erro:</strong> {erroApi}
                </div>
            )}

            {!resultado && !loading && !erroApi && (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 text-gray-400">
                    <Cpu className="size-16 mb-4 opacity-20" />
                    <p className="text-center">Defina os parâmetros e execute a simulação.</p>
                </div>
            )}

            {loading && (
                <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border animate-pulse">
                    <div className="text-indigo-600 text-lg font-bold mb-2">Calculando vetores de atrito...</div>
                    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-[width_1s_ease-in-out_infinite]" style={{width: '50%'}}></div>
                    </div>
                </div>
            )}

            {resultado && !loading && (
                <div className="bg-white p-6 rounded-lg shadow border border-indigo-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex justify-between items-center">
                        Resultado da Análise
                        <span className="text-xs font-normal bg-green-100 text-green-800 px-2 py-1 rounded border border-green-200">
                            Tempo: {resultado.tempo_calculo_gpu}
                        </span>
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded border">
                            <p className="text-sm text-muted-foreground">Vida Útil Estimada</p>
                            <p className="text-2xl font-bold text-indigo-700">{resultado.vida_util_restante.toLocaleString()} km</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border">
                            <p className="text-sm text-muted-foreground">Desgaste Acelerado</p>
                            <p className="text-2xl font-bold text-orange-600">{resultado.desgaste_previsto.toFixed(1)}%</p>
                        </div>
                    </div>

                    {resultado.status_risco !== 'Baixo' && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 mb-4 flex gap-3 items-start">
                            <AlertTriangle className="size-6 shrink-0" />
                            <div>
                                <p className="font-bold">Alerta de Desgaste Prematuro</p>
                                <p className="text-sm mt-1">
                                    As condições atuais de carga e temperatura reduzirão drasticamente a vida do pneu.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}