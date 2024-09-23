import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NewVxm from './pages/NewVxm';
import ConsultaVxm from './pages/ConsultaVxm';
import Menu from './components/Menu';
import Login from './components/Login';
import Pacientes from './pages/Pacientes';
import './App.css'; // Vamos adicionar um arquivo CSS para ajustes visuais

function App() {
  // Estado que controla se o usuário está autenticado ou não
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para fazer o login (passa para o componente Login)
  const handleLogin = () => {
    setIsAuthenticated(true); // Ao logar, alteramos para true
  };

  return (
    <div className="d-flex">
      {isAuthenticated && <Menu />}
      <div className={isAuthenticated ? "content p-4 w-100" : "login-page w-100"}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin}  />} />
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/newvxm" element={<NewVxm />} />
              <Route path="/searchvxm" element={<ConsultaVxm />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" />} />
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
