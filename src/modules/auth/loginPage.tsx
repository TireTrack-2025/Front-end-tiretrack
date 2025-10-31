// src/modules/auth/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext'; // Hook com a função login()
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login, isAuthenticated } = useAuth(); 
    const navigate = useNavigate();

    // Se o usuário tentar acessar /login, mas já estiver autenticado, redireciona.
    if (isAuthenticated) {
        navigate('/', { replace: true });
        return null; 
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Chama a função de login do contexto, que chama o authService.ts
            await login({ email, senha });
            
            // Redireciona para a página principal após o sucesso
            navigate('/', { replace: true });
        } catch (err) {
            // Trata o erro (usando a mensagem de erro do mock/API)
            let errorMessage = 'Falha desconhecida no login.';
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
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">TIRETRACK Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        
                        {/* Campo Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ex: proprietaria@track.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* Campo Senha */}
                        <div className="grid gap-2">
                            <Label htmlFor="senha">Senha</Label>
                            <Input
                                id="senha"
                                type="password"
                                placeholder="123"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* Mensagem de Erro */}
                        {error && (
                            <p className="text-sm text-destructive font-medium mt-2">{error}</p>
                        )}

                        {/* Botão de Login */}
                        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                            {isLoading ? 'Entrando...' : (
                                <>
                                    <LogIn className="mr-2 size-4" /> Entrar
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}