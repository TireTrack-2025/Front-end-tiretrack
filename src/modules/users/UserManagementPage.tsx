// src/modules/users/UserManagementPage.tsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2 } from 'lucide-react';

import { registerManager, getUsers } from '@/services/userService';
import { getEmpresas } from '@/services/empresaService';
import { type ClientCompany } from '@/types/company'; 
import { type User } from '@/types/users'; 

// UI Components (Shadcn/UI)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 1. Definição do Schema de Validação
const formSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter no mínimo 2 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  senha: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres." }),
  empresaId: z.string().min(1, { message: "Selecione uma empresa." }),
});

type UserFormValues = z.infer<typeof formSchema>;


// ----------------------------------------------------
// Componente Principal: UserManagementPage
// ----------------------------------------------------
export function UserManagementPage() {
  const [empresas, setEmpresas] = useState<ClientCompany[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializa o formulário
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', email: '', senha: '', empresaId: '' },
  });

  // Função para carregar empresas e usuários
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empResponse, userResponse] = await Promise.all([
            getEmpresas(), 
            getUsers()
        ]);
        setEmpresas(empResponse.data);
        setUsers(userResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        // Implementar toast/notificação de erro
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handler de Submissão do Formulário
  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      await registerManager(data);
      form.reset(); // Limpa o formulário
      // Atualiza a lista de usuários após o cadastro (re-fetch)
      const userResponse = await getUsers(); 
      setUsers(userResponse.data);

    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="size-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Cadastro de Gerentes Clientes</h1>
      <p className="text-muted-foreground">
        Use esta tela para criar contas de Gerentes que terão acesso à gestão de suas respectivas empresas.
      </p>

      {/* ---------------------------------- */}
      {/* 1. CARD DE CADASTRO (FORMULÁRIO)   */}
      {/* ---------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Novo Gerente</CardTitle>
          <CardDescription>O SuperAdmin só pode cadastrar contas de Gerentes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Nome */}
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" {...form.register('nome')} />
              {form.formState.errors.nome && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.nome.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">E-mail (Login)</Label>
              <Input id="email" type="email" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            {/* Senha */}
            <div>
              <Label htmlFor="senha">Senha Inicial</Label>
              <Input id="senha" type="password" {...form.register('senha')} />
              {form.formState.errors.senha && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.senha.message}</p>
              )}
            </div>

            {/* Empresa ID (Select) */}
            <div>
              <Label htmlFor="empresaId">Empresa Cliente</Label>
              <Select onValueChange={(value) => form.setValue('empresaId', value)} disabled={empresas.length === 0}>
                <SelectTrigger id="empresaId" className={form.formState.errors.empresaId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione a empresa para este gerente" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nome} ({empresa.cnpj})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.empresaId && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.empresaId.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Plus className="mr-2 size-4" />
              )}
              Cadastrar Novo Gerente
            </Button>
          </form>
        </CardContent>
      </Card>

  
      {/* 2. LISTA DE USUÁRIOS ATUAIS    */}
     
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-3">Usuários Cadastrados</h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead>Empresa ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.permissao}</TableCell>
                  <TableCell>{user.empresaId || '-'}</TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">Nenhum usuário cadastrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}