import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Para redirecionar após login
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // useNavigate para redirecionar

  const handleSubmit = (e) => {
    e.preventDefault();

    // Autenticação simples de exemplo
    if (email === 'admin@example.com' && password === '123456') {
      onLogin();  // Chama a função de login passada por props
      navigate('/');  // Redireciona para a página inicial após login bem-sucedido
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="login-container">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
