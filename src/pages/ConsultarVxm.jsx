import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function ConsultarVxm() {
  const [vxmList, setVxmList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/vxm-history/')
      .then((response) => setVxmList(response.data))
      .catch((error) => console.error("Erro ao carregar VXMs:", error));
  }, []);

  const handleViewDetails = (vxmId) => {
    navigate(`/vxm-details/${vxmId}`);
  };

  return (
    <div className="container mt-4">
      <h2>Consultar VXM</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Data do Crossmatch</th>
            <th>Nome do Doador</th>
            <th>Sexo do Doador</th>
            <th>Tipo Sanguíneo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vxmList.map((vxm) => (
            <tr key={vxm.id}>
              <td>{new Date(vxm.date_performed).toLocaleDateString()}</td>
              <td>{vxm.donor_name}</td>
              <td>{vxm.donor_sex}</td>
              <td>{vxm.donor_blood_type}</td>
              <td>
                <FontAwesomeIcon
                  icon={faEye}
                  onClick={() => handleViewDetails(vxm.id)}
                  style={{ cursor: 'pointer', color: '#007bff' }}
                  title="Ver Detalhes"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ConsultarVxm;
