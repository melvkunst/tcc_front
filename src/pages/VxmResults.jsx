import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPrint } from '@fortawesome/free-solid-svg-icons';

function VxmResults() {
  const navigate = useNavigate();
  const location = useLocation();

  // Reformata os resultados recebidos do backend
  const rawResults = location.state?.results || {}; // Verifica se os dados existem
  const donorInfo = {
    donorName: rawResults.donor_name || 'Não disponível',
    rgct: rawResults.rgct || 'Não disponível',
    birthDate: rawResults.donor_birth_date
      ? new Date(rawResults.donor_birth_date).toLocaleDateString()
      : 'Não disponível',
    bloodType: rawResults.donor_blood_type || 'Não disponível',
    hla: {
      A1: rawResults.HLA_A1 || '-',
      A2: rawResults.HLA_A2 || '-',
      B1: rawResults.HLA_B1 || '-',
      B2: rawResults.HLA_B2 || '-',
      C1: rawResults.HLA_C1 || '-',
      C2: rawResults.HLA_C2 || '-',
      DR1: rawResults.HLA_DR1 || '-',
      DR2: rawResults.HLA_DR2 || '-',
      DQ1: rawResults.HLA_DQ1 || '-',
      DQ2: rawResults.HLA_DQ2 || '-',
    },
  };
  const results = rawResults.patient_results || []; // Mapeia corretamente para patient_results

  // Extrai todos os nomes de alelos para criar colunas
  const allAlleles = [
    ...new Set(
      results.flatMap((receptor) =>
        receptor.allele_results ? receptor.allele_results.map((allele) => allele.allele_name) : []
      )
    ),
  ];

  const serologicalSpecificities = allAlleles.map((allele) => {
    if (allele.startsWith('DR') || allele.startsWith('DQ')) {
      const match = allele.match(/\*(\d{2})/);
      return match ? allele.slice(0, 2) + match[1] : allele;
    }
    const match = allele.match(/\*(\d{2})/);
    return match ? allele.split('*')[0].slice(0, 1) + match[1] : allele;
  });

  const handlePrint = () => {
    window.open(`http://127.0.0.1:8000/api/generate-crossmatch-pdf/${rawResults.id}/`, '_blank');
  };

  if (results.length === 0) {
    return (
      <div className="container mt-4">
        <h4 className="text-center">Nenhum resultado disponível</h4>
        <div className="text-center mt-3">
          <Button variant="primary" onClick={() => navigate(-1)}>
            Fazer Novo VXM
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="shadow-box p-4" style={{ overflowX: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center my-3">
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            className="text-decoration-none text-dark"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Fazer Novo VXM
          </Button>
          <Button variant="success" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} /> Imprimir
          </Button>
        </div>

        <h4 className="mb-4 text-center">Resultados do Virtual Crossmatch</h4>
        <hr />

        <div className="mb-4">
          <h5>Informações do Doador</h5>
          <p>
            <strong>Nome:</strong> {donorInfo.donorName}
          </p>
          <p>
            <strong>RGCT:</strong> {donorInfo.rgct}
          </p>
          <p>
            <strong>Data de Nascimento:</strong> {donorInfo.birthDate}
          </p>
          <p>
            <strong>Tipo Sanguíneo:</strong> {donorInfo.bloodType}
          </p>
          <Table bordered hover size="sm" className="mb-4">
            <thead>
              <tr>
                <th>HLA A1</th>
                <th>HLA A2</th>
                <th>HLA B1</th>
                <th>HLA B2</th>
                <th>HLA C1</th>
                <th>HLA C2</th>
                <th>HLA DR1</th>
                <th>HLA DR2</th>
                <th>HLA DQ1</th>
                <th>HLA DQ2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{donorInfo.hla.A1}</td>
                <td>{donorInfo.hla.A2}</td>
                <td>{donorInfo.hla.B1}</td>
                <td>{donorInfo.hla.B2}</td>
                <td>{donorInfo.hla.C1}</td>
                <td>{donorInfo.hla.C2}</td>
                <td>{donorInfo.hla.DR1}</td>
                <td>{donorInfo.hla.DR2}</td>
                <td>{donorInfo.hla.DQ1}</td>
                <td>{donorInfo.hla.DQ2}</td>
              </tr>
            </tbody>
          </Table>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Especificidade Sorológica</th>
              {serologicalSpecificities.map((specificity, index) => (
                <th key={`specificity-${index}`}>{specificity}</th>
              ))}
            </tr>
            <tr>
              <th>Especificidade Alélica</th>
              {allAlleles.map((allele, index) => (
                <th key={`allele-${index}`}>{allele}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((receptor) => (
              <tr key={receptor.receptor_id}>
                <td>{receptor.receptor_name}</td>
                {allAlleles.map((allele) => {
                  const match = receptor.allele_results.find(
                    (a) => a.allele_name === allele
                  );
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
    </div>
  );
}

export default VxmResults;
