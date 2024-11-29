import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Importa o cliente configurado
import { Table, Container, Button, FormControl, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

function ExamView() {
  const { receptor_id, exame_id } = useParams(); // Obtém os IDs dos parâmetros da URL
  const navigate = useNavigate(); // Para navegar de volta
  const [examData, setExamData] = useState([]);
  const [receptorInfo, setReceptorInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Estado para a busca
  const [filteredData, setFilteredData] = useState([]); // Dados filtrados

  // Função para buscar dados do receptor
  const fetchReceptorInfo = async () => {
    try {
      const response = await api.get(`api/receptores/${receptor_id}/`);
      setReceptorInfo(response.data);
    } catch (error) {
      console.error('[ExamView] Erro ao buscar informações do receptor:', error);
    }
  };

  // Função para buscar dados dos alelos do exame
  const fetchExamData = async () => {
    try {
      const response = await api.get(`api/receptores/${receptor_id}/exames/${exame_id}/alelos/`);
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
    fetchReceptorInfo();
    fetchExamData();
  }, [receptor_id, exame_id]);

  return (
    <Container>
      <div className="shadow-box p-4 mt-4">
        {/* Botão de voltar */}
        <div className="d-flex align-items-center mb-4">
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            className="text-decoration-none text-dark"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar
          </Button>
        </div>

        {/* Header com informações do receptor */}
        <div>
          <h4>Informações do Receptor</h4>
          <hr />
          <p><strong>Nome:</strong> {receptorInfo.nome}</p>
          <p><strong>Data de Nascimento:</strong> {receptorInfo.data_nascimento}</p>
          <p><strong>ID HCPA:</strong> {receptorInfo.id_hcpa}</p>
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
      </div>
    </Container>
  );
}

export default ExamView;
