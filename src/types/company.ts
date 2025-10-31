
export interface ClientCompany {
  id: string;
  nome: string; // Nome da Empresa (ex: Logística Arrecife)
  cnpj: string; // CNPJ (ex: 00.111.222/0001-33)
  status: 'Ativo' | 'Inativo'; // Status da Empresa
  usuariosAtivos: number; // Número de usuários ativos
  dataCadastro: string; // Data de Cadastro (ex: 10/09/2025)
}

export interface CompanyFormData {
  nome: string;
  cnpj: string;

}