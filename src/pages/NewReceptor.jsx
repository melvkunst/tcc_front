import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api'; // Importa o cliente configurado
import { Button } from 'react-bootstrap'; // Adicionando o Button do react-bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function NewReceptor() {
  const [receptorData, setReceptorData] = useState({
    nome: '',
    data_nascimento: '',
    id_hcpa: '',
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams(); // Obtem o ID do receptor a partir dos parâmetros da URL
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Se houver um ID, significa que estamos editando um receptor existente
      api.get(`api/receptores/${id}/`)
        .then((response) => {
          setReceptorData(response.data); // Preenche o formulário com os dados do receptor
        })
        .catch((error) => console.error('[NewReceptor] Erro ao buscar receptor:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceptorData({ ...receptorData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateFields = () => {
    const newErrors = {};

    if (!receptorData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFields()) {
      const request = id
        ? api.put(`api/receptores/${id}/`, receptorData) // Atualização se o ID existir
        : api.post('api/receptores/', receptorData); // Criação se o ID não existir

      request
        .then(() => {
          navigate('/receptores'); // Volta para a lista de receptores
        })
        .catch((error) => console.error('[NewReceptor] Erro ao salvar receptor:', error));
    }
  };

  return (
    <div className="container mt-5">
      <div className="shadow-box p-4">
        <div className="d-flex align-items-center mb-4">
          <Button
            variant="link"
            onClick={() => navigate('/receptores')}
            className="text-decoration-none text-dark"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar
          </Button>
        </div>
        <h3>{id ? 'Editar Receptor' : 'Adicionar Novo Receptor'}</h3>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Nome Completo *</label>
            <input
              id="nome"
              type="text"
              name="nome"
              className="form-control"
              value={receptorData.nome}
              onChange={handleChange}
            />
            {errors.nome && <div className="text-danger">{errors.nome}</div>}
          </div>
          <div className="form-group mb-3">
            <label>Data de Nascimento</label>
            <input
              id="data_nascimento"
              type="date"
              name="data_nascimento"
              className="form-control"
              value={receptorData.data_nascimento}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>ID HCPA *</label>
            <input
              id="id_hcpa"
              type="text"
              name="id_hcpa"
              className="form-control"
              value={receptorData.id_hcpa}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success mt-3">
            {id ? 'Salvar Alterações' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewReceptor;
