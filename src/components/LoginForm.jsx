import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import './Login.css';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function LoginForm({ route, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log('[LoginForm] Submetendo login...');
    setLoading(true); // Inicia o estado de carregamento
    setError(''); // Reseta mensagens de erro anteriores

    try {
      //console.log('[LoginForm] Enviando requisição para a API:', route);
      const res = await api.post(route, { username, password });
     // console.log('[LoginForm] Resposta da API:', res.data); // Loga a resposta da API

      // Salva os tokens no localStorage
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

     // console.log('[LoginForm] Tokens salvos no localStorage.');
      
      onLogin(); // Informa ao App que o login foi concluído
      navigate("/"); // Redireciona para a página inicial
    } catch (err) {
      console.error('[LoginForm] Erro na requisição:', err);

      // Verifica se o erro tem resposta da API
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'Erro ao realizar login. Verifique suas credenciais.');
        //console.log('[LoginForm] Erro da API:', err.response.data);
      } else {
        setError('Erro inesperado. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
      //console.log('[LoginForm] Carregamento finalizado.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label htmlFor="username">Nome de usuário:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        {error && <p className="text-danger text-center">{error}</p>}
        <button type="submit" className="btn btn-success btn-block" disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>
      <p className="text-center mt-3">
        Não tem uma conta? <a href="/register">Registre-se aqui</a>
      </p>
    </div>
  );
}

export default LoginForm;
