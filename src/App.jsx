import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NewVxm from './pages/NewVxm';
import ConsultarVxm from './pages/ConsultarVxm';
import Menu from './components/Menu';
import Login from './components/Login';
import Pacientes from './pages/Pacientes';
import ExamView from './pages/ExamView';
import NewPacient from './pages/NewPacient';
import VxmResults from './pages/VxmResults';
import VxmDetails from './pages/VxmDetails';
import './App.css';

function RouteMonitor() {
  const location = useLocation();

  useEffect(() => {
    // Regex para verificar se estamos nas rotas /pacientes ou /pacientes/:id/exames/:id
    const pacientesPath = /^\/pacientes(\/\d+\/exames\/\d+)?$/;

    if (!pacientesPath.test(location.pathname)) {
      // Zera o localStorage se a rota não for de pacientes ou exames específicos
      localStorage.removeItem('selectedPatientId');
    }
  }, [location]);

  return null;
}

function App() {
  // Estado que controla se o usuário está autenticado ou não
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para fazer o login
  const handleLogin = () => {
    setIsAuthenticated(true); // Ao logar, alteramos o estado para true
  };

  // Função para fazer o logoff
  const handleLogout = () => {
    setIsAuthenticated(false); // Ao deslogar, alteramos o estado para false
  };

  return (
    <div className="d-flex">
      {isAuthenticated && <Menu onLogout={handleLogout} />}  {/* Passa a função de logoff */}
      <div className={isAuthenticated ? "content p-4 w-100" : "login-page w-100"}>
        <RouteMonitor /> {/* Monitoramento de rota para zerar localStorage */}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/newvxm" element={<NewVxm />} /> 
              <Route path="/vxm-results" element={<VxmResults />} />
              <Route path="/searchvxm" element={<ConsultarVxm />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/pacientes/:paciente_id/exames/:exame_id" element={<ExamView />} />
              <Route path="/novo-paciente" element={<NewPacient />} />
              <Route path="/novo-paciente/:id?" element={<NewPacient />} />
              <Route path="/vxm-details/:vxmId" element={<VxmDetails />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} /> 
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
