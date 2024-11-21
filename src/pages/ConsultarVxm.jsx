import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Importa o cliente configurado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function ConsultarVxm() {
  const [vxmList, setVxmList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('api/vxm-history/')
      .then((response) => {
        setVxmList(response.data);
      })
      .catch((error) => console.error('[ConsultarVxm] Erro ao carregar VXMs:', error));
  }, []);

  return (
    <div className="container mt-4">
      <div className="shadow-box">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Consultar VXM</h2>
        </div>
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
                    onClick={() => navigate(`/vxm-details/${vxm.id}`)}
                    style={{ cursor: 'pointer', color: '#007bff' }}
                    title="Ver Detalhes"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ConsultarVxm;
