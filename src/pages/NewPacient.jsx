import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap'; // Adicionando o Button do react-bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Ícone de seta para voltar

function NewPatient() {
  const [patientData, setPatientData] = useState({
    nome: '',
    data_nascimento: '',
    tipo_sanguineo: '',
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams(); // Obtenha o ID do paciente a partir dos parâmetros da URL
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Se houver um ID, significa que estamos editando um paciente existente
      axios.get(`http://127.0.0.1:8000/api/pacientes/${id}/`)
        .then((response) => {
          setPatientData(response.data); // Preenche o formulário com os dados do paciente
        })
        .catch((error) => console.error("Erro ao buscar paciente:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateFields = () => {
    const newErrors = {};

    if (!patientData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório.';
    }
    if (!patientData.data_nascimento) {
      newErrors.data_nascimento = 'A data de nascimento é obrigatória.';
    }
    if (!patientData.tipo_sanguineo) {
      newErrors.tipo_sanguineo = 'O tipo sanguíneo é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFields()) {
      const request = id
        ? axios.put(`http://127.0.0.1:8000/api/pacientes/${id}/`, patientData) // Atualização se o ID existir
        : axios.post('http://127.0.0.1:8000/api/pacientes/', patientData); // Criação se o ID não existir

      request
        .then(() => {
          navigate('/pacientes'); // Volta para a lista de pacientes
        })
        .catch((error) => console.error("Erro ao salvar paciente:", error));
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center my-3">
        <Button variant="link" onClick={() => navigate('/pacientes')} className="text-decoration-none text-dark">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </Button>
      </div>
      <h2>{id ? 'Editar Paciente' : 'Adicionar Novo Paciente'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input
            id="nome"
            type="text"
            name="nome"
            className="form-control"
            value={patientData.nome}
            onChange={handleChange}
          />
          {errors.nome && <div className="text-danger">{errors.nome}</div>}
        </div>
        <div className="form-group">
          <label>Data de Nascimento</label>
          <input
            id="data_nascimento"
            type="date"
            name="data_nascimento"
            className="form-control"
            value={patientData.data_nascimento}
            onChange={handleChange}
          />
          {errors.data_nascimento && <div className="text-danger">{errors.data_nascimento}</div>}
        </div>
        <div className="form-group">
          <label>Tipo Sanguíneo</label>
          <select
            id="tipo_sanguineo"
            name="tipo_sanguineo"
            className="form-control"
            value={patientData.tipo_sanguineo}
            onChange={handleChange}
          >
            <option value="">Selecione o Tipo Sanguíneo</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          {errors.tipo_sanguineo && <div className="text-danger">{errors.tipo_sanguineo}</div>}
        </div>
        <button type="submit" className="btn btn-success mt-3">{id ? 'Salvar Alterações' : 'Salvar'}</button>
      </form>
    </div>
  );
}

export default NewPatient;
