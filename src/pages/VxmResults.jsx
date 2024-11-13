// src/pages/VxmResults.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';

function VxmResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results || {}; // Recebe os dados da API da página anterior

  // Checa se `results` está vazio e exibe uma mensagem caso esteja
  if (Object.keys(results).length === 0) {
    return (
      <div className="container mt-4">
        <h4>Nenhum resultado disponível</h4>
        <Button variant="primary" onClick={() => navigate(-1)} className="mt-3">Voltar</Button>
      </div>
    );
  }

  // Ordena pacientes com base no número de alelos compatíveis
  const sortedPatients = Object.entries(results).sort(
    ([, aData], [, bData]) =>
      bData.alelos_correspondentes.filter((alelo) => alelo.compatibilidade).length -
      aData.alelos_correspondentes.filter((alelo) => alelo.compatibilidade).length
  );

  return (
    <div className="container mt-4">
      <h4>Resultados do Virtual Crossmatch</h4>
      {sortedPatients.map(([id, patientData]) => (
        <div key={id} className="mt-4">
          <h5>{patientData.nome}</h5>
          <Table bordered>
            <thead>
              <tr>
                <th>Alelo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {patientData.alelos_correspondentes.map((alelo, index) => (
                <tr key={index}>
                  <td>{alelo.nome}</td>
                  <td style={{ color: alelo.valor < 1000 ? 'green' : 'red' }}>{alelo.valor}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
      <Button variant="primary" onClick={() => navigate(-1)} className="mt-3">Voltar</Button>
    </div>
  );
}

export default VxmResults;
