import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import api from '../api'; // Importa o cliente configurado
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar elementos necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalExams, setTotalExams] = useState(0);
  const [recentExams, setRecentExams] = useState([]);
  const [bloodTypeDistribution, setBloodTypeDistribution] = useState({});
  const [recentCrossmatches, setRecentCrossmatches] = useState([]);

  useEffect(() => {
    // Carregar número total de pacientes e distribuição por tipo sanguíneo
    api.get('api/pacientes/')
      .then((response) => {
        const patients = Array.isArray(response.data) ? response.data : [];
        setTotalPatients(patients.length);

        const bloodTypes = patients.reduce((acc, patient) => {
          acc[patient.tipo_sanguineo] = (acc[patient.tipo_sanguineo] || 0) + 1;
          return acc;
        }, {});
        setBloodTypeDistribution(bloodTypes);
      })
      .catch((error) => console.error('Erro ao buscar pacientes:', error));

    // Carregar total de exames e lista dos exames mais recentes
    api.get('api/exames/')
      .then((response) => {
        const exams = Array.isArray(response.data) ? response.data : [];
        setTotalExams(exams.length);
        setRecentExams(exams.slice(0, 5));
      })
      .catch((error) => console.error('Erro ao buscar exames:', error));

    // Carregar últimos crossmatches
    api.get('api/vxm-history/')
      .then((response) => {
        const vxms = Array.isArray(response.data) ? response.data : [];
        setRecentCrossmatches(vxms.slice(0, 5));
      })
      .catch((error) => console.error('Erro ao buscar histórico de crossmatches:', error));
  }, []);

  const bloodTypeChartData = {
    labels: Object.keys(bloodTypeDistribution),
    datasets: [
      {
        data: Object.values(bloodTypeDistribution),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total de Pacientes</Card.Title>
              <Card.Text style={{ fontSize: '2rem' }}>{totalPatients}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total de Exames</Card.Title>
              <Card.Text style={{ fontSize: '2rem' }}>{totalExams}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Crossmatches Recentes</Card.Title>
              <Card.Text style={{ fontSize: '2rem' }}>{recentCrossmatches.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Distribuição por Tipo Sanguíneo</Card.Title>
              <Pie data={bloodTypeChartData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Últimos Crossmatches</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Doador</th>
                    <th>Compatíveis</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCrossmatches.map((cm) => (
                    <tr key={cm.id}>
                      <td>{new Date(cm.date_performed).toLocaleDateString()}</td>
                      <td>{cm.donor_name}</td>
                      <td>{cm.total_compatible_alleles}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
