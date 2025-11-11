// Localização: src/routes/index.tsx

import { Routes, Route, Navigate } from 'react-router-dom';

// Componentes do Módulo de Autenticação
import Dashboard from '@/modules/dashboard/index'; 
import { LoginPage } from '@/modules/auth/loginPage'; // Caminho corrigido
import { PrivateRoute } from './privateRoute';     // Caminho corrigido
import { LandingPage } from './landingPage'; // Caminho corrigido

// Componentes da Aplicação Principal
import { ClientCompanyPage } from '@/modules/companies/ClientCompanyPage'; 
import { CompanyFormPage } from '@/modules/companies/CompanyFormPage'; 
import MainLayout from '@/components/layout/MainLayout';
import { VeiculosPage } from '@/pages/VeiculosPage';
import { PneusPage } from '@/pages/PneusPage';
import { EstoquePage } from '@/pages/EstoquePage';
import { UserManagementPage } from '@/modules/users/UserManagementPage';


export function AppRoutes() {
  return (
    <Routes>
      
      {/* 1. ROTAS PÚBLICAS (Acessíveis sem login) */}
      <Route path='/login' element={<LoginPage />} />
      {/* A ROTA /register FOI EXCLUÍDA DAQUI! */}

      {/* 2. ROTAS PROTEGIDAS (Verificadas pelo PrivateRoute) */}
      <Route element={<PrivateRoute />}>
        
        {/* Rota Raiz: Vai para o LandingPage que decide o destino */}
        <Route path="/" element={<LandingPage />} />

        {/* Rotas que usam o Layout Principal (Sidebar + Header) */}
        <Route element={<MainLayout />}> 

        
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<UserManagementPage />} /> 

          {/* ROTAS DE OUTROS MÓDULOS */}
          <Route path="/estoque" element={<EstoquePage />} /> 
          <Route path="/veiculos" element={<VeiculosPage/>}/>
          <Route path="/pneus" element={<PneusPage />} />

          {/* ROTAS DA GESTÃO DE EMPRESAS */}
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