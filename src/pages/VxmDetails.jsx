import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api'; // Cliente configurado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function VxmDetails() {
  const { vxmId } = useParams(); // ID do VXM selecionado
  const [vxmDetails, setVxmDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`api/vxm-details/${vxmId}/`)
      .then((response) => setVxmDetails(response.data))
      .catch((error) => console.error("Erro ao carregar detalhes do VXM:", error));
  }, [vxmId]);

  if (!vxmDetails) return <div>Carregando...</div>;

  // Extrai todos os nomes de alelos para criar colunas consistentes
  const allAlleles = [
    ...new Set(
      vxmDetails.patient_results.flatMap((patient) =>
        patient.allele_results.map((allele) => allele.allele_name)
      )
    ),
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center my-3">
        <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none text-dark">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </Button>
      </div>

      <h2 className="mt-3">Detalhes do Crossmatch</h2>
      <h4>Doador: {vxmDetails.donor_name}</h4>
      <p>Data do Crossmatch: {new Date(vxmDetails.date_performed).toLocaleDateString()}</p>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Paciente</th>
            {allAlleles.map((allele) => (
              <th key={allele}>{allele}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vxmDetails.patient_results.map((patient) => (
            <tr key={patient.patient_id}>
              <td>{patient.patient_name}</td>
              {allAlleles.map((allele) => {
                const match = patient.allele_results.find((a) => a.allele_name === allele);
                return (
                  <td
                    key={allele}
                    style={{
                      color: match ? (match.allele_value > 1000 ? 'red' : 'green') : 'gray',
                    }}
                  >
                    {match ? match.allele_value : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default VxmDetails;
