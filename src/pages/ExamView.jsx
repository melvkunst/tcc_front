import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Importa o cliente configurado
import { Table, Container, Button, FormControl, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

function ExamView() {
  const { paciente_id, exame_id } = useParams(); // Obtém os IDs dos parâmetros da URL
  const navigate = useNavigate(); // Para navegar de volta
  const [examData, setExamData] = useState([]);
  const [patientInfo, setPatientInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Estado para a busca
  const [filteredData, setFilteredData] = useState([]); // Dados filtrados

  // Função para buscar dados do paciente
  const fetchPatientInfo = async () => {
    try {
      const response = await api.get(`api/pacientes/${paciente_id}/`);
      setPatientInfo(response.data);
    } catch (error) {
      console.error('[ExamView] Erro ao buscar informações do paciente:', error);
    }
  };

  // Função para buscar dados dos alelos do exame
  const fetchExamData = async () => {
    try {
      const response = await api.get(`api/pacientes/${paciente_id}/exames/${exame_id}/alelos/`);
      setExamData(response.data);
      setFilteredData(response.data); // Inicializa os dados filtrados com todos os alelos
    } catch (error) {
      console.error('[ExamView] Erro ao buscar dados do exame:', error);
    }
  };

  // Filtra os alelos com base no termo de busca
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    setFilteredData(
      examData.filter((item) =>
        item.alelo.nome.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }, [searchTerm, examData]);

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

      {/* Campo de busca */}
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <FormControl
          placeholder="Buscar alelo pelo nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Tabela com informações dos alelos do exame */}
      <h5>Detalhes do Exame</h5>
      <Table striped bordered hover className="table-custom">
        <thead>
          <tr>
            <th>Alelo</th>
            <th>MFI</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
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
