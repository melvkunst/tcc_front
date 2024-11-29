import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NewVxm from './pages/NewVxm';
import ConsultarVxm from './pages/ConsultarVxm';
import Receptores from './pages/Receptores';
import ExamView from './pages/ExamView';
import NewReceptor from './pages/NewReceptor';
import VxmResults from './pages/VxmResults';
import VxmDetails from './pages/VxmDetails';
import LoginForm from './components/LoginForm';
import Register from './components/Register';
import NotFound from './pages/NotFound';
import Menu from './components/Menu';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica o token no localStorage ao carregar o componente
  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    //console.log('[App] Executando useEffect... Verificando token no localStorage:', token);
    setIsAuthenticated(!!token);
  }, []);

  // Monitora mudanças no estado isAuthenticated
  useEffect(() => {
    //console.log('[App] Estado de autenticação atualizado:', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => {
    //console.log('[App] Usuário logando...');
    // Simula o login adicionando um token ao localStorage
    localStorage.setItem('ACCESS_TOKEN', 'seu-token-aqui');
    setIsAuthenticated(true); // Atualiza o estado de autenticação
  };

  const handleLogout = () => {
    //console.log('[App] Usuário deslogando...');
    localStorage.clear();
    setIsAuthenticated(false); // Atualiza o estado de autenticação
  };

  return (
    <BrowserRouter>
      <div className="d-flex">
        {/* Verifica o estado de autenticação e exibe o Menu se o usuário estiver autenticado */}
        {/*console.log('[App] Estado de autenticação atual na renderização:', isAuthenticated)*/}
        {isAuthenticated && <Menu onLogout={handleLogout} />}
        <div className={isAuthenticated ? 'content p-4 w-100' : 'login-page w-100'}>
          <Routes>
            {/* Rotas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/newvxm"
              element={
                <ProtectedRoute>
                  <NewVxm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vxm-results"
              element={
                <ProtectedRoute>
                  <VxmResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/searchvxm"
              element={
                <ProtectedRoute>
                  <ConsultarVxm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptores"
              element={
                <ProtectedRoute>
                  <Receptores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptores/:receptor_id/exames/:exame_id"
              element={
                <ProtectedRoute>
                  <ExamView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/novo-receptor"
              element={
                <ProtectedRoute>
                  <NewReceptor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/novo-receptor/:id"
              element={
                <ProtectedRoute>
                  <NewReceptor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vxm-details/:vxmId"
              element={
                <ProtectedRoute>
                  <VxmDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />

            {/* Rotas públicas */}
            <Route
              path="/login"
              element={<LoginForm route="/api/token/" onLogin={handleLogin} />}
            />
            <Route path="/register" element={<Register />} />
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
