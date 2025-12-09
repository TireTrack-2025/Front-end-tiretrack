// src/services/empresaService.ts
import { api } from './api';

export interface Empresa {
  id: number;
  username: string;
  email: string;
  nome_fantasia: string; 
  cnpj: string;
  status_assinatura: boolean; 
  cargo?: string;
}

export interface EmpresaFormData {
  username: string;
  email: string;
  password?: string; 
  nome_fantasia: string;
  cnpj: string;
  cargo?: string;
}

export const getEmpresas = async (): Promise<Empresa[]> => {
  // Chama o backend real na rota /empresas/
  const response = await api.get<Empresa[]>('/empresas/');
  return response.data;
};

export const createEmpresa = async (data: EmpresaFormData) => {
  const response = await api.post('/empresas/', data);
  return response.data;
};

export const updateEmpresa = async (id: number | string, data: Partial<EmpresaFormData>) => {
  const response = await api.patch(`/empresas/${id}/`, data);
  return response.data;
};


export const deleteEmpresa = async (id: number | string) => {
  const response = await api.delete(`/empresas/${id}/`);
  return response.data;
};