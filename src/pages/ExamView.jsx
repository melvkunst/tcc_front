import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import axios from 'axios';
import { Table, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Ícone de seta para voltar

function ExamView() {
  const { paciente_id, exame_id } = useParams(); // Obtem os IDs dos parâmetros da URL
  const navigate = useNavigate(); // Para navegar de volta
  const [examData, setExamData] = useState([]);
  const [patientInfo, setPatientInfo] = useState({});

  // Função para buscar dados do paciente
  const fetchPatientInfo = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/pacientes/${paciente_id}/`);
      setPatientInfo(response.data);
    } catch (error) {
      console.error("Erro ao buscar informações do paciente:", error);
    }
  };

  // Função para buscar dados dos alelos do exame
  const fetchExamData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/pacientes/${paciente_id}/exames/${exame_id}/alelos/`);
      setExamData(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do exame:", error);
    }
  };

  useEffect(() => {
    fetchPatientInfo();
    fetchExamData();
  }, [paciente_id, exame_id]);

  return (
    <Container>
      {/* Botão de voltar */}
      <div className="d-flex align-items-center my-3">
        <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none text-dark">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </Button>
      </div>

      {/* Header com informações do paciente */}
      <div className="patient-header bg-light p-3 rounded mb-4">
        <h4>Informações do Paciente</h4>
        <p><strong>Nome:</strong> {patientInfo.nome}</p>
        <p><strong>Data de Nascimento:</strong> {patientInfo.data_nascimento}</p>
        <p><strong>Tipo Sanguíneo:</strong> {patientInfo.tipo_sanguineo}</p>
      </div>

      {/* Tabela com informações dos alelos do exame */}
      <h5>Detalhes do Exame</h5>
      <Table striped bordered hover className="table-custom">
        <thead>
          <tr>
            <th>Alelo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {examData.map((item) => (
            <tr key={item.id}>
              <td>{item.alelo.nome}</td>
              <td>{item.valor}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ExamView;
