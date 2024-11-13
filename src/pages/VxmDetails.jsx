import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function VxmDetails() {
  const { vxmId } = useParams(); // ID do VXM selecionado
  const [vxmDetails, setVxmDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/vxm-details/${vxmId}/`)
      .then((response) => setVxmDetails(response.data))
      .catch((error) => console.error("Erro ao carregar detalhes do VXM:", error));
  }, [vxmId]);

  if (!vxmDetails) return <div>Carregando...</div>;

  return (
    <div className="container mt-4">
      <Button variant="secondary" onClick={() => navigate(-1)}>
        Voltar
      </Button>
      <h2 className="mt-3">Detalhes do Crossmatch</h2>
      <h4>Doador: {vxmDetails.donor_name}</h4>
      <p>Data do Crossmatch: {new Date(vxmDetails.date_performed).toLocaleDateString()}</p>

      {/* Separação por paciente */}
      {vxmDetails.patient_results && vxmDetails.patient_results.map((patient) => (
        <div key={patient.patient_id} className="mt-4">
          <h5>{patient.patient_name}</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Alelo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {patient.allele_results && patient.allele_results.map((allele, index) => (
                <tr key={index}>
                  <td>{allele.allele_name}</td>
                  <td style={{ color: allele.allele_value > 1000 ? 'red' : 'green' }}>{allele.allele_value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
    </div>
  );
}

export default VxmDetails;
