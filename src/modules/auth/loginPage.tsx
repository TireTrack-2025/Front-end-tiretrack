// src/modules/auth/LoginPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "@/contexts/AuthContext"; 
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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


  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      
      await login({ email, senha });

     
      navigate("/", { replace: true });
    } catch (err) {
      // Trata o erro
      let errorMessage = "Falha desconhecida no login.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 min-h-screen bg-background">
      
      <div className="lg:col-span-3 flex items-center justify-center p-8">
        <Card className="w-full max-w-sm border-none shadow-none">
          <CardHeader className="flex items-center justify-center flex-col space-y-4 mb-8">
            {/* Logo */}
            <img
              src={logoSrc}
              alt="Logo TIRETRACK"
              className="h-12 w-auto mb-8" 
            />
            <h1 className="text-xl font-extrabold">Bem-vindo de volta</h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              
     
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs">Usuário ou Email</Label>
                <Input
                  id="email"
                  className="border-[#EDEDED] shadow-none bg-[#F7F7F7]"
                  
                  type="text" 
                  autoComplete="username"
                  placeholder="Digite seu usuário (ex: admin)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              
              <div className="grid gap-2">
                <Label htmlFor="senha" className="text-xs">Senha</Label>
                <Input
                  id="senha"
                  className="border-[#EDEDED] shadow-none bg-[#F7F7F7]"
                  type="password"
                  autoComplete="current-password"
                  placeholder="********"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              
              {error && (
                <p className="text-sm text-destructive font-medium mt-2">
                  {error}
                </p>
              )}

            
              <Button
                type="submit"
                className="w-full mt-4 bg-[#003b5c] hover:bg-[orange]"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : <>Entrar</>}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>

      {/* Coluna da Direita (Imagem) */}
      <div className="hidden lg:block lg:col-span-7">
        <img
          src="https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1718"
          alt="Ilustração de uma frota de caminhões"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}