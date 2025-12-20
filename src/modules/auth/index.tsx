import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logoSrc from '@/assets/images/logo.svg';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Chamar a função de login do AuthContext/serviço de API
    console.log({ email, password });
    alert('Login submetido! (Lógica a ser implementada)');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-l from-[#DBE6FF] to-[#F0F5FF] p-4">
      <Card className="w-full max-w-md border-0 rounded-[5px]">
        <CardHeader className="text-center pt-[60px]">
          <img src={logoSrc} alt="Logo da Plataforma" className="mx-auto mb-4 h-2 w-20" />
          <CardTitle className="text-2xl font-bold">Acesse sua conta</CardTitle>
        </CardHeader>
        
        <CardContent className='pb-[60px] px-[40px]'>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4 ">
              <div className="flex flex-col space-y-1.5 mb-[4px]">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  className='bg-[#f6f6f6] border-[#E5E5E5]'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  className='bg-[#f6f6f6] border-[#E5E5E5]'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="py-[20px] w-full bg-[#009DFF] mt-[16px]">
                Entrar
              </Button>
              
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}