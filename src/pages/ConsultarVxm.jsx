import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Importa o cliente configurado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPrint } from '@fortawesome/free-solid-svg-icons';

function ConsultarVxm() {
  const [vxmList, setVxmList] = useState([]);
  const [filteredVxmList, setFilteredVxmList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('api/vxm-history/')
      .then((response) => {
        setVxmList(response.data);
        setFilteredVxmList(response.data); // Inicializa a lista filtrada com todos os dados
      })
      .catch((error) => {
        console.error('[ConsultarVxm] Erro ao carregar VXMs:', error);
        setError('Erro ao carregar a lista de VXMs. Tente novamente mais tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = vxmList.filter(
      (vxm) =>
        (vxm.donor_name && vxm.donor_name.toLowerCase().includes(value)) ||
        (vxm.rgct && vxm.rgct.toLowerCase().includes(value))
    );
    setFilteredVxmList(filtered);
  };

  const handlePrint = (vxmId) => {
    window.open(`http://127.0.0.1:8000/api/generate-crossmatch-pdf/${vxmId}/`, '_blank');
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="shadow-box">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Consultar VXM</h2>
        </div>
        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome do doador ou RGCT..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>
        {filteredVxmList.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Data do Crossmatch</th>
                <th>Nome do Doador</th>
                <th>Sexo do Doador</th>
                <th>Tipo Sanguíneo</th>
                <th>RGCT</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVxmList.map((vxm) => (
                <tr key={vxm.id}>
                  <td>{vxm.date_performed ? new Date(vxm.date_performed).toLocaleDateString() : 'N/A'}</td>
                  <td>{vxm.donor_name || 'Desconhecido'}</td>
                  <td>{vxm.donor_sex || 'N/A'}</td>
                  <td>{vxm.donor_blood_type || 'N/A'}</td>
                  <td>{vxm.rgct || 'N/A'}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEye}
                      onClick={() => navigate(`/vxm-details/${vxm.id}`)}
                      style={{ cursor: 'pointer', color: '#007bff' }}
                      title="Ver Detalhes"
                    />
                    <FontAwesomeIcon
                      icon={faPrint}
                      onClick={() => handlePrint(vxm.id)}
                      style={{ cursor: 'pointer', color: '#28a745', marginLeft: '10px' }}
                      title="Imprimir PDF"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">Nenhum VXM encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default ConsultarVxm;
