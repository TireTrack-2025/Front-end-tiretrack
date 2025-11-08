import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoSrc from "@/assets/logo.svg";

const getInitials = (name: string) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.substring(0, 2).toUpperCase();
};

export function Header() {
  const user = {
    nome: "Matt Alves",
    email: "matheus@email.com",
    fotoUrl: "",
  };

  const userInitials = getInitials(user.nome);

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      {/* LADO ESQUERDO: Menu Hambúrguer e Logo */}
      <div className="flex items-center gap-4">
        {/* BOTÃO DO MENU HAMBÚRGUER (AGORA SEMPRE VISÍVEL) */}
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6"/>
        </Button>

        <Link to="/">
          <img
            id="LogoTT"
            src={logoSrc}
            alt="Logo da plataforma TireTrack"
            className="h-8 w-auto"
          />
        </Link>
      </div>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Avatar className="bg-[#009DFF]">
                <AvatarImage src={user.fotoUrl} alt={user.nome} />
                <AvatarFallback className="bg-[009DFF] text-white rounded">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-bold">{user.nome}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
            <DropdownMenuItem>Ajuda</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 cursor-pointer">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
