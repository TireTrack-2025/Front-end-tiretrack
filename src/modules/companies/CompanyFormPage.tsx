// src/modules/companies/CompanyFormPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

import { type CompanyFormData, type ClientCompany } from '@/types/company';
import { createEmpresa, updateEmpresa } from '@/services/empresaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Componente do Formulário
export function CompanyFormPage() {
    const navigate = useNavigate();
    // Pega o parâmetro 'id' da URL (se estivermos em /empresas/editar/:id)
    const { id } = useParams<{ id: string }>(); 
    const isEditMode = !!id; // Verdadeiro se o ID existir

    const [formData, setFormData] = useState<CompanyFormData>({
        nome: '',
        cnpj: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // EFEITO 1: Carregar dados da empresa se estiver em Modo de Edição
    // (A ser implementado: seria necessário um getEmpresaById no service)
    // useEffect(() => {
    //     if (isEditMode) {
    //         // fetch empresa data using ID and setFormData
    //     }
    // }, [isEditMode, id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            if (isEditMode && id) {
                // Requisição de Edição
                await updateEmpresa(id, formData);
                setMessage('Empresa atualizada com sucesso!');
            } else {
                // Requisição de Criação
                await createEmpresa(formData);
                setMessage('Empresa cadastrada com sucesso!');
                setFormData({ nome: '', cnpj: '' }); // Limpar formulário após sucesso
            }

            // Opcional: Redirecionar para a lista após um pequeno delay
            setTimeout(() => navigate('/empresas'), 1500);

        } 
        catch (error) {
    console.error("Erro ao salvar empresa:", error);
    
    // VERIFICAÇÃO DE TIPO SEGURO (TypeScript Guard)
    if (error && typeof error === 'object' && 'message' in error) {
        // Se for um objeto com a propriedade 'message', use-a.
        setMessage(`Falha ao salvar a empresa: ${error.message}`);
    } else {
        // Caso contrário, use uma mensagem genérica.
        setMessage('Falha ao salvar a empresa: Erro desconhecido.');
    }
}
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/empresas')}>
                    <ArrowLeft className="size-5" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? `Editar Empresa: ${id}` : 'Cadastrar Nova Empresa'}
                </h1>
            </div>

            <div className="max-w-xl p-6 border rounded-xl bg-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo Nome da Empresa */}
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome da Empresa</Label>
                        <Input
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Ex: Logística Arrecife"
                            required
                        />
                    </div>

                    {/* Campo CNPJ */}
                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                            id="cnpj"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleChange}
                            placeholder="00.000.000/0000-00"
                            required
                        />
                    </div>

                    {/* Mensagem de Status */}
                    {message && <p className="text-sm text-primary">{message}</p>}

                    {/* Botão de Submissão */}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : (
                            <>
                                <Save className="mr-2 size-4" />
                                {isEditMode ? 'Salvar Alterações' : 'Cadastrar Empresa'}
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}