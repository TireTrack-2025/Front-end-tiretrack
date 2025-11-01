// src/modules/auth/LoginPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext"; // Hook com a função login()
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoSrc from "@/assets/logo.svg";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Se o usuário tentar acessar /login, mas já estiver autenticado, redireciona.
  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Chama a função de login do contexto, que chama o authService.ts
      await login({ email, senha });

      // Redireciona para a página principal após o sucesso
      navigate("/", { replace: true });
    } catch (err) {
      // Trata o erro (usando a mensagem de erro do mock/API)
      let errorMessage = "Falha desconhecida no login.";
      if (err instanceof Error) {
        // Tenta pegar a mensagem de erro definida no authService.ts
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // {* MODIFICAÇÃO PRINCIPAL: Trocamos 'flex' por 'grid' *}
    // Em telas pequenas (mobile), terá 1 coluna (grid-cols-1)
    // Em telas grandes (lg:), terá 10 colunas (lg:grid-cols-10)
    <div className="grid grid-cols-1 lg:grid-cols-10 min-h-screen bg-background">
      {/* Coluna da Esquerda (Formulário) - 30% em desktop */}
      {/* Ocupa 3 das 10 colunas em telas grandes (lg:col-span-3) */}
      {/* Mantém o 'flex items-center justify-center' para centralizar o Card */}
      <div className="lg:col-span-3 flex items-center justify-center p-8">
        <Card className="w-full max-w-sm border-none shadow-none">
          <CardHeader className="flex items-center justify-center flex-col space-y-4 mb-8">
            <img
              src={logoSrc} //
              alt="Logo TIRETRACK"
              className="h-10 w-auto mb-8"
            />
            <h1 className="text-xl font-extrabold">Bem-vindo de volta</h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {/* Campo Email */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input
                  id="email"
                  className="border-[#EDEDED] shadow-none bg-[#F7F7F7]"
                  type="email"
                  placeholder="Ex: proprietaria@track.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Campo Senha */}
              <div className="grid gap-2">
                <Label htmlFor="senha" className="text-xs">Senha</Label>
                <Input
                  id="senha"
                  className="border-[#EDEDED] shadow-none bg-[#F7F7F7]"
                  type="password"
                  placeholder="123"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <p className="text-sm text-destructive font-medium mt-2">
                  {error}
                </p>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full mt-4 bg-[#007AFF]"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : <>Entrar</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Coluna da Direita (Imagem) - 70% em desktop */}
      {/* 'hidden' para esconder em mobile, 'lg:block' para exibir em desktop */}
      {/* Ocupa 7 das 10 colunas em telas grandes (lg:col-span-7) */}
      <div className="hidden lg:block lg:col-span-7">
        <img
          // Substitua pela URL da sua imagem
          src="https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1718"
          alt="Ilustração de uma frota de caminhões"
          // 'h-full' faz a imagem ocupar toda a altura do container
          // 'w-full' faz a imagem ocupar toda a largura
          // 'object-cover' garante que a imagem cubra o espaço sem distorcer
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
