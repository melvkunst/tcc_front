import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Substitua pelo arquivo axios configurado
import './Login.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Indicador de carregamento
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o indicador de carregamento
    try {
      const response = await api.post('/api/user/register/', formData); // Atualize o endpoint, se necessário
      setSuccess(response.data.message || 'Usuário registrado com sucesso!');
      setError('');
      setTimeout(() => navigate('/login'), 2000); // Redireciona para login após sucesso
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao registrar usuário');
      setSuccess('');
    } finally {
      setLoading(false); // Desativa o indicador de carregamento
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Registrar</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Nome de Usuário:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="first_name">Primeiro Nome:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-control"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="last_name">Sobrenome:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {loading && <p className="text-center text-primary">Carregando...</p>} {/* Indicador de carregamento */}
          {error && <p className="text-danger text-center">{error}</p>}
          {success && <p className="text-success text-center">{success}</p>}
          <button
            type="submit"
            className="btn btn-primary btn-block w-100"
            disabled={loading} // Botão desativado durante o carregamento
          >
            {loading ? 'Processando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
