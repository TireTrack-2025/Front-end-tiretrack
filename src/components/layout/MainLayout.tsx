// src/components/layout/MainLayout.tsx
import React, { useState } from "react"; // Mantido para garantir que o JSX compile corretamente
import { NavLink, Outlet } from "react-router-dom";
import {
  Truck,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Archive,
  Cog,
  BarChart2,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import logoSrc from "@/assets/TTLogo.png";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

//Componente da Sidebar (Navegação Esquerda)
const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  const { user } = useAuth();

  // VARIÁVEIS DE CONTROLE BASEADAS EM TipoAcesso
  const isCliente = user?.tipoAcesso === "Cliente";
  const isProprietaria = user?.tipoAcesso === "Proprietaria";

  // Links que o Cliente pode ver (Estoque, Pneus, Veículos)
  const canViewFrotaLinks = isCliente;

  // Links que o Proprietaria pode ver (Gestão de Empresas)
  const canManageEmpresas = isProprietaria;

  return (
    <aside
      className={cn(
        "bg-[#2B84C0] text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Cabeçalho da Sidebar com Logo e Botão Hambúrguer */}
      <div className={cn("h-16 flex items-center p-4", isOpen ? "justify-between" : "justify-center")}>

        {/* --- 4. O BOTÃO HAMBÚRGUER --- */}
        <Button variant="ghost" size="icon" onClick={toggle} className="text-white hover:bg-[#02548a]">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="p-4 flex flex-col space-y-2 flex-grow">
        {/* 1. Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 p-3 rounded-md font-semibold transition-colors duration-300",
              // Se fechado, centraliza o ícone
              !isOpen && "justify-center",
              isActive
                ? "bg-[#F47A1F] text-white"
                : "text-[#ADAD9E] hover:bg-[#1a374e] hover:text-white"
            )
          }
        >
          <LayoutDashboard className="size-6" /> {/* Aumentei um pouco o ícone para 24px (size-6) */}
          {/* --- 5. Só mostra o texto se estiver aberto --- */}
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        {/* 2. Inventário Geral */}
        {canViewFrotaLinks && (
          <NavLink
            to="/estoque"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 p-3 rounded-md font-semibold transition-colors duration-300",
                !isOpen && "justify-center",
                isActive
                  ? "bg-[#F47A1F] text-white"
                  : "text-[#ADAD9E] hover:bg-[#1a374e] hover:text-white"
              )
            }
          >
            <Archive className="size-6" />
            {isOpen && <span>Inventário Geral</span>}
          </NavLink>
        )}

        {/* 3. Gestão de Empresas */}
        {canManageEmpresas && (
          <NavLink
            to="/empresas"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 p-3 rounded-md font-semibold transition-colors duration-300",
                !isOpen && "justify-center",
                isActive
                  ? "bg-[#F47A1F] text-white"
                  : "text-[#ADAD9E] hover:bg-[#1a374e] hover:text-white"
              )
            }
          >
            <Truck className="size-6" />
            {isOpen && <span>Gestão de Empresas</span>}
          </NavLink>
        )}

        {/* 4. Relatórios */}
        <NavLink
          to="/relatorios"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 p-3 rounded-md font-semibold transition-colors duration-300",
              !isOpen && "justify-center",
              isActive
                ? "bg-[#F47A1F] text-white"
                : "text-[#ADAD9E] hover:bg-[#1a374e] hover:text-white"
            )
          }
        >
          <BarChart2 className="size-6" />
          {isOpen && <span>Relatórios</span>}
        </NavLink>

        {/* 5. Modelos de Pneus */}
        {canViewFrotaLinks && (
          <NavLink
            to="/pneus"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 p-3 rounded-md font-semibold transition-colors duration-300",
                !isOpen && "justify-center",
                isActive
                  ? "bg-[#F47A1F] text-white"
                  : "text-[#ADAD9E] hover:bg-[#1a374e] hover:text-white"
              )
            }
          >
            <Cog className="size-6" />
            {isOpen && <span>Modelos de Pneus</span>}
          </NavLink>
        )}

        {/* 6. Modelos de Veículos */}
        {canViewFrotaLinks && (
          <NavLink
            to="/veiculos"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 p-3 rounded-md font-semibold transition-colors duration-300",
                !isOpen && "justify-center",
                isActive
                  ? "bg-[#1a374e] text-white"
                  : "text-[#ADAD9E] hover:bg-[#1a374e] hover:text-white"
              )
            }
          >
            <Truck className="size-6" />
            {isOpen && <span>Modelos de Veículos</span>}
          </NavLink>
        )}
      </div>
    </aside>
  );
};

//Componente do Header (Barra Superior)
const Header = () => {
  // ⬅️ CORREÇÃO 1: Obter a função 'logout' do contexto
  const { user, logout } = useAuth();

  const initials = user
    ? user.nome
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "UN";
  const userName = user?.nome || "Usuário";

  return (
    <header className="h-16 bg-gradient-to-r from-[#E85D31] to-[#F67F1D] border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="h-16 flex items-center p-4 ">
        <img
          src={logoSrc} //
          alt="Logo TIRETRACK"
          className="h-40 w-auto ml-5"
        />
      </div>
      {/* Menu de Usuário (Avatar MA) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="bg-[#2B84C0]">
          <Button
            variant="ghost"
            className="relative h-10 w-10 flex items-center gap-2 "
          >
            <span className="text-xl text-white font-medium hidden sm:block">
              {initials}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#E65B31] text-white border-none font-semibold" align="end" forceMount>
          <DropdownMenuLabel className="font-normal py-6">
            <div className="flex flex-col space-y-1">
              <p className="text-xl font-semibold leading-none">{userName}</p>
              <p className="text-xs leading-none text-[#EDEDED]">
                {user?.permissao}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="data-[highlighted]:bg-[#F67F1D] transition-colors duration-200">
            <Settings className="mr-1 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>


          {/* ⬅️ CORREÇÃO 2: Ligar o onClick à função logout */}
          <DropdownMenuItem onClick={logout} className="data-[highlighted]:bg-[#F67F1D] transition-colors duration-200">
            <LogOut className="mr-1 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

// --- Componente de Layout Principal ---
const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar}/>
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto mx-8 my-4">
          {/* O Outlet renderiza o conteúdo da página ativa (ex: ClientCompanyPage) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
