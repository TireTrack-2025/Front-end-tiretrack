import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

import { type EmpresaFormData } from '@/services/empresaService';
import { createEmpresa, updateEmpresa, getEmpresas } from '@/services/empresaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CompanyFormPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); 
    const isEditMode = !!id;

    const [formData, setFormData] = useState<EmpresaFormData>({
        username: '',
        email: '',
        password: '',
        nome_fantasia: '',
        cnpj: '',
        cargo: 'GERENTE',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isEditMode && id) {
            carregarDadosEdicao();
        }
    }, [isEditMode, id]);

    const carregarDadosEdicao = async () => {
        setIsLoadingData(true);
        try {
            const todos = await getEmpresas();
            const empresaEncontrada = todos.find(e => e.id === Number(id));
            
            if (empresaEncontrada) {
                setFormData({
                    username: empresaEncontrada.username,
                    email: empresaEncontrada.email,
                    nome_fantasia: empresaEncontrada.nome_fantasia,
                    cnpj: empresaEncontrada.cnpj,
                    cargo: empresaEncontrada.cargo || 'GERENTE',
                    password: '',
                });
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCargoChange = (value: string) => {
        setFormData(prev => ({ ...prev, cargo: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            if (isEditMode && id) {
                const dadosParaEnviar = { ...formData };
                if (!dadosParaEnviar.password) delete dadosParaEnviar.password;
                
                await updateEmpresa(Number(id), dadosParaEnviar);
                alert('Empresa atualizada com sucesso!');
            } else {
                await createEmpresa(formData);
                alert('Empresa e Login criados com sucesso!');
            }
            navigate('/empresas');
        } 
        catch (error: any) {
            console.error("Erro ao salvar:", error);
            const msgErro = error.response?.data?.username 
                ? `Este nome de usuário já existe.` 
                : error.response?.data?.detail || 'Falha ao salvar. Verifique os dados.';
            setMessage(msgErro);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/empresas')}>
                    <ArrowLeft className="size-5" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? `Editar Dados` : 'Cadastrar Nova Empresa / Usuário'}
                </h1>
            </div>

            <Card className="max-w-2xl border shadow-sm">
                <CardHeader>
                    <CardTitle>Dados de Acesso e Identificação</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg border border-dashed">
                            <div className="space-y-2">
                                <Label htmlFor="username">Usuário de Login *</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Ex: logistica.sul"
                                    required
                                    disabled={isEditMode}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha {isEditMode && '(Deixe vazio para manter)'} *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="******"
                                    required={!isEditMode}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="email">Email de Contato *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="contato@empresa.com"
                                    required
                                />
                            </div>

                             <div className="space-y-2 md:col-span-2">
                                <Label>Tipo de Conta (Cargo)</Label>
                                <Select 
                                    value={formData.cargo} 
                                    onValueChange={handleCargoChange}
                                    disabled={isEditMode} 
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o cargo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GERENTE">Gerente (Dono da Empresa)</SelectItem>
                                        <SelectItem value="OPERADOR">Operador (Funcionário)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome_fantasia">Nome da Empresa (Fantasia) *</Label>
                                <Input
                                    id="nome_fantasia"
                                    name="nome_fantasia"
                                    value={formData.nome_fantasia}
                                    onChange={handleChange}
                                    placeholder="Ex: Logística Arrecife Ltda"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ *</Label>
                                <Input
                                    id="cnpj"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    placeholder="00.000.000/0000-00"
                                    required
                                />
                            </div>
                        </div>

                        {message && (
                            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                                {message}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-[#003b5c] hover:bg-orange-500" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEditMode ? 'Salvar Alterações' : 'Criar Usuário e Empresa'}
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}