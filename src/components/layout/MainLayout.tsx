// src/components/layout/MainLayout.tsx
import React from 'react'; // Mantido para garantir que o JSX compile corretamente
import { Outlet } from 'react-router-dom';
import { Truck, Settings, LogOut, LayoutDashboard, ChevronDown} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; 
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import logoSrc from "@/assets/logo.svg";


//Componente da Sidebar (Navegação Esquerda)
const Sidebar = () => {
    const { user } = useAuth();
    
    // VARIÁVEIS DE CONTROLE BASEADAS EM TipoAcesso
    const isCliente = user?.tipoAcesso === 'Cliente';
    const isProprietaria = user?.tipoAcesso === 'Proprietaria';
    
    // Links que o Cliente pode ver (Estoque, Pneus, Veículos)
    const canViewFrotaLinks = isCliente;
    
    // Links que o Proprietaria pode ver (Gestão de Empresas)
    const canManageEmpresas = isProprietaria;

    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
            <div className="h-16 flex items-center p-4">
                <img 
                    src={logoSrc} // 
                    alt="Logo TIRETRACK"
                    className="h-10 w-auto"/>
            </div>

            <div className="p-4 flex flex-col space-y-2 flex-grow">
                
                {/* 1. Dashboard (Comum a todos - Sempre visível) */}
                <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors font-semibold">
                    <LayoutDashboard className="size-4" />
                    Dashboard
                </Link>
    
                {/* 2. Inventário Geral (Estoque) (APENAS CLIENTE) */}
                {canViewFrotaLinks && (
                    <Link to="/estoque" className="flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors font-semibold">
                        <Truck className="size-4" />
                        Inventário Geral
                    </Link>
                )}

                {/* 3. Gestão de Empresas (APENAS PROPRIETARIA) */}
                {canManageEmpresas && (
                    <Link to="/empresas" className="flex items-center gap-3 p-3 rounded-md bg-sidebar-accent text-sidebar-accent-foreground transition-colors font-semibold">
                        <Truck className="size-4" />
                        Gestão de Empresas
                    </Link>
                )}
                
            
                {/* 4. Modelos de Pneus (APENAS CLIENTE) */}
                {canViewFrotaLinks && (
                    <Link to="/pneus" className="flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent text-sidebar-accent-foreground transition-colors font-semibold">
                        Modelos de Pneus
                    </Link>
                )}

                {/* 5. Modelos de Veículos (APENAS CLIENTE) */}
                {canViewFrotaLinks && (
                    <Link to="/veiculos" className="flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors font-semibold">
                        Modelos de Veículos
                    </Link>
                )}
            </div>
        </aside>
  );
};

//Componente do Header (Barra Superior)
    const Header = () => {
// ⬅️ CORREÇÃO 1: Obter a função 'logout' do contexto
    const { user, logout } = useAuth(); 

    const initials = user ? user.nome.split(' ').map(n => n[0]).join('') : 'UN';
    const userName = user?.nome || 'Usuário';

    return (
        <header className="h-16 bg-background border-b border-border flex items-center justify-end px-6 shadow-sm">
        {/* Menu de Usuário (Avatar MA) */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 flex items-center gap-2">
                    <span className="text-sm font-medium hidden sm:block">{userName}</span>
                        <ChevronDown className="size-4 text-muted-foreground" />
                        <Avatar className="size-8 bg-primary text-primary-foreground">
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.permissao}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                <DropdownMenuSeparator />
                    <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                    </DropdownMenuItem>
                <DropdownMenuSeparator />

 {/* ⬅️ CORREÇÃO 2: Ligar o onClick à função logout */}
<DropdownMenuItem onClick={logout} className="cursor-pointer">
<LogOut className="mr-2 h-4 w-4" />
 <span>Sair</span>
 </DropdownMenuItem>
</DropdownMenuContent>
 </DropdownMenu>
 </header>
);
};

// --- Componente de Layout Principal ---
    const MainLayout = () => {
    return (
    <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
    <div className="flex flex-col flex-1">
            <Header />
    <main className="flex-1 overflow-y-auto">
    {/* O Outlet renderiza o conteúdo da página ativa (ex: ClientCompanyPage) */}
            <Outlet />
    </main>
    </div>
    </div>
    );
};

export default MainLayout;