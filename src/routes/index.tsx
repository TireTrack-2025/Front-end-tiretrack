// src/routes/index.tsx

import { Routes, Route } from 'react-router-dom';

// CORREÇÃO 1: O caminho correto baseado no seu print é dentro de /ui
import AnaliseGPU from '@/components/AnaliseGPU';

import Dashboard from '@/modules/dashboard/index'; 
import { PrivateRoute } from './privateRoute';
import { LandingPage } from './landingPage';
import { ClientCompanyPage } from '@/modules/companies/ClientCompanyPage'; 
import { CompanyFormPage } from '@/modules/companies/CompanyFormPage'; 
import MainLayout from '@/components/layout/MainLayout';
import { VeiculosPage } from '@/pages/VeiculosPage';
import { PneusPage } from '@/pages/PneusPage';
import { EstoquePage } from '@/pages/EstoquePage';
import { UserManagementPage } from '@/modules/users/UserManagementPage';

// CORREÇÃO 2: Importamos o componente com o nome novo (SimulacaoPage)
import { SimulacaoPage } from '@/pages/SimulacaoPage';

export function AppRoutes() {
  return (
    <Routes>
      
      {/* Rota de Login (Tela AnaliseGPU) */}
      <Route path='/login' element={<AnaliseGPU />} />

      <Route element={<PrivateRoute />}>
        
        <Route path="/" element={<LandingPage />} />

        <Route element={<MainLayout />}> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<UserManagementPage />} /> 
          <Route path="/estoque" element={<EstoquePage />} /> 
          <Route path="/veiculos" element={<VeiculosPage/>}/>
          <Route path="/pneus" element={<PneusPage />} />
          
         
          <Route path="/paralelismo" element={<SimulacaoPage />} />

          <Route path="/empresas" element={<ClientCompanyPage />} /> 
          <Route path="/empresas/cadastrar" element={<CompanyFormPage />} /> 
          <Route path="/empresas/editar/:id" element={<CompanyFormPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<div>Página Não Encontrada</div>} />

    </Routes>
  );
}