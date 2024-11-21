import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function VxmResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results?.patient_results || []; // Garante que os dados sejam processados

  if (results.length === 0) {
    return (
      <div className="container mt-4">
        <h4>Nenhum resultado disponível</h4>
        <Button variant="primary" onClick={() => navigate(-1)} className="mt-3">
          Voltar
        </Button>
      </div>
    );
  }

  // Extrai todos os nomes de alelos para criar colunas consistentes
  const allAlleles = [
    ...new Set(
      results.flatMap((patient) =>
        patient.allele_results.map((allele) => allele.allele_name)
      )
    ),
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center my-3">
        <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none text-dark">
          <FontAwesomeIcon icon={faArrowLeft} /> Fazer Novo VXM
        </Button>
      </div>
      <h4 className="mb-4">Resultados do Virtual Crossmatch</h4>

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
          {results.map((patient) => (
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

      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    </div>
  );
}

export default VxmResults;
