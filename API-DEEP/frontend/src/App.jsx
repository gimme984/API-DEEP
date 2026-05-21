import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import EsqueciSenha from './pages/EsqueciSenha';
import ResetarSenha from './pages/ResetarSenha';
import DashboardCompleto from './pages/DashboardCompleto';
import Perfil from './pages/Perfil';
import Backup from './pages/Backup';
import NovoChamado from './pages/NovoChamado';
import DetalhesChamado from './pages/DetalhesChamado';
import Inventario from './pages/Inventario';
import NovoEquipamento from './pages/NovoEquipamento';
import GerenciarUsuarios from './pages/GerenciarUsuarios';

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/resetar-senha/:token" element={<ResetarSenha />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  const isAdmin = user?.funcao === 'ADMIN_TI';

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<DashboardCompleto />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/novo" element={<NovoChamado />} />
      <Route path="/chamado/:id" element={<DetalhesChamado />} />

      {isAdmin && (
        <>
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/inventario/novo" element={<NovoEquipamento />} />
          <Route path="/inventario/:id" element={<NovoEquipamento />} />
          <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />
          <Route path="/backup" element={<Backup />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
