// src/routes/landingPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; 

export function LandingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Este useEffect decide para onde o usuário deve ser enviado APÓS o login.
    useEffect(() => {
        // Redireciona o usuário com base no tipo de acesso após o login
        if (user?.tipoAcesso === 'Proprietaria') {
            // Nossa empresa (SuperAdmin/Admin): Vai para a gestão de empresas
            navigate('/empresas', { replace: true });
        } else if (user?.tipoAcesso === 'Cliente') {
            // Empresa Cliente (Gerente/Operador): Vai para o dashboard específico
            navigate('/dashboard', { replace: true }); 
        } else {
            // Fallback (Se o tipoAcesso não estiver definido, vai para o dashboard)
            navigate('/dashboard', { replace: true }); 
        }
    }, [user, navigate]);

    // Mostra um loader simples enquanto o redirecionamento ocorre
    return (
        <div className="min-h-screen flex items-center justify-center text-lg text-muted-foreground">
            Verificando permissões e redirecionando...
        </div>
    );
}