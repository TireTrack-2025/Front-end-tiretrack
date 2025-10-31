// src/routes/PrivateRoute.tsx



import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; 

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth(); // Assume que o 'loading' está no useAuth

  // 1. Se o contexto ainda está carregando o token do localStorage, mostra um loader.
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Verificando autenticação...</div>;
  }
  
  // 2. Se não estiver autenticado, redireciona para a página de login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se estiver autenticado e o carregamento terminou, renderiza a rota filha.
  return <Outlet />;
};