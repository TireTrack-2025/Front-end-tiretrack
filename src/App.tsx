// Localização: src/App.tsx

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes'; // Importa o componente que gerencia todas as rotas

function App() {
  return (
    // 1. O BrowserRouter "abraça" tudo para que a navegação por URL funcione
    
    
    <BrowserRouter>

      {/* 2. O AuthProvider "abraça" as rotas para que todas as telas
          saibam qual usuário está logado */}   
      <AuthProvider>

        {/* 3. O AppRoutes é o componente que de fato renderiza a página
            correta com base na URL do navegador */}
        <AppRoutes />
        
      </AuthProvider>
    </BrowserRouter>
    
  );
}

export default App;