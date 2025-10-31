// Localização: src/routes/index.tsx

import { Routes, Route, Navigate } from 'react-router-dom';

// Componentes do Módulo de Autenticação (LoginPage e o NOVO PrivateRoute)
import Dashboard from '@/modules/dashboard/index'; 
// CORREÇÃO: Certifique-se de que a LoginPage está importando do arquivo .tsx correto, não do index da pasta.
import { LoginPage } from '@/modules/auth/loginPage'; // Assumindo que o arquivo é LoginPage.tsx
import { PrivateRoute } from './privateRoute';     // <<-- NOVO GUARDA DE ROTAS

// Componentes da Aplicação Principal
import { ClientCompanyPage } from '@/modules/companies/ClientCompanyPage'; 
import { CompanyFormPage } from '@/modules/companies/CompanyFormPage'; 
import MainLayout from '@/components/layout/MainLayout';
import { VeiculosPage } from '@/pages/VeiculosPage';
import { PneusPage } from '@/pages/PneusPage';
import { EstoquePage } from '@/pages/EstoquePage';
// Importe o VeiculosPage se precisar que ele esteja disponível
// import { VeiculosPage } from '@/pages/VeiculosPage'; 


export function AppRoutes() {
  return (
    <Routes>
      
      {/* 1. ROTAS PÚBLICAS (Acessíveis sem login) */}
      <Route path='/login' element={<LoginPage />} />

      {/* 2. ROTAS PROTEGIDAS (Verificadas pelo PrivateRoute) */}
      <Route element={<PrivateRoute />}>
        
        {/* Rota Raiz: Redireciona para /empresas ou /dashboard após o login */}
        {/* Você tinha uma rota solta para Dashboard, vamos colocá-la dentro da proteção: */}
        <Route path="/" element={<Navigate to="/empresas" replace />} />

        {/* Rotas que usam o Layout Principal (Sidebar + Header) */}
        <Route element={<MainLayout />}> 

        {/* ROTA PRINCIPAL DE ESTOQUE */}
          <Route path="/estoque" element={<EstoquePage />} /> 
          
          {/* Rotas que aparecem no Layout */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/veiculos" element={<VeiculosPage />} /> */}

          {/* ROTA Implementada para a página de veículos */}
          <Route path="/veiculos" element={<VeiculosPage/>}/>

          {/* ROTA Implementada para a página de pneus */}
          <Route path="/pneus" element={<PneusPage />} />

          {/* ROTAS DA GESTÃO DE EMPRESAS (Sua funcionalidade) */}
          <Route path="/empresas" element={<ClientCompanyPage />} /> 
          <Route path="/empresas/cadastrar" element={<CompanyFormPage />} /> 
          <Route path="/empresas/editar/:id" element={<CompanyFormPage />} />
        </Route>
      </Route>
      
      {/* Opcional: Rota para tratar URLs que não existem (404) */}
      <Route path="*" element={<div>Página Não Encontrada</div>} />

    </Routes>
  );
}