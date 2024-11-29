import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api'; // Cliente configurado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPrint } from '@fortawesome/free-solid-svg-icons';

function VxmDetails() {
    const { vxmId } = useParams(); // ID do VXM selecionado
    const [vxmDetails, setVxmDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`api/vxm-details/${vxmId}/`)
            .then((response) => setVxmDetails(response.data))
            .catch((error) => console.error("Erro ao carregar detalhes do VXM:", error));
    }, [vxmId]);

    const handlePrint = () => {
        window.open(`http://127.0.0.1:8000/api/generate-crossmatch-pdf/${vxmId}/`, '_blank');
    };

    if (!vxmDetails) return <div>Carregando...</div>;

    const patientResults = vxmDetails.patient_results || [];

    // Extrai todos os nomes de alelos para criar colunas consistentes
    const allAlleles = [
        ...new Set(
            patientResults.flatMap((patient) =>
                patient.allele_results ? patient.allele_results.map((allele) => allele.allele_name) : []
            )
        ),
    ];

    const serologicalSpecificities = allAlleles.map((allele) => {
        if (allele.startsWith('DR') || allele.startsWith('DQ')) {
            // Pega o prefixo (ex: DR ou DP) e os dois primeiros números após o '*'
            const match = allele.match(/\*(\d{2})/);
            return match ? allele.slice(0, 2) + match[1] : allele;
        }
        // Outros casos (ex: A*02:01 ou B*27:05)
        const match = allele.match(/\*(\d{2})/);
        return match ? allele.split('*')[0].slice(0, 1) + match[1] : allele;
    });



    return (
        <div className="container mt-4">
            <div className="shadow-box p-4" style={{ overflowX: 'auto' }}>
                <div className="d-flex justify-content-between align-items-center my-3">
                    <Button variant="link" onClick={() => navigate(-1)} className="text-decoration-none text-dark">
                        <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                    </Button>
                    <Button variant="success" onClick={handlePrint}>
                        <FontAwesomeIcon icon={faPrint} /> Imprimir
                    </Button>
                </div>

                <h2 className="mt-3">Detalhes do Crossmatch</h2>
                <hr /> 
                <h4>Doador: {vxmDetails.donor_name}</h4>
                <p><strong>RGCT:</strong> {vxmDetails.rgct}</p>
                <p><strong>Data do Crossmatch:</strong> {new Date(vxmDetails.date_performed).toLocaleDateString()}</p>

                <div className="mb-4">
                    <h5>HLAs do Doador</h5>
                    <Table bordered hover size="sm">
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
                                <td>{vxmDetails.HLA_A1 || 'Não disponível'}</td>
                                <td>{vxmDetails.HLA_A2 || 'Não disponível'}</td>
                                <td>{vxmDetails.HLA_B1 || 'Não disponível'}</td>
                                <td>{vxmDetails.HLA_B2 || 'Não disponível'}</td>
                                <td>{vxmDetails.HLA_C1 || 'Não disponível'}</td>
                                <td>{vxmDetails.HLA_C2 || 'Não disponível'}</td>
                                <td>{vxmDetails.HLA_DR1 || 'Não disponível'}</td>
                                <td>{vxmDetails.HLA_DR2 || 'Não disponível'}</td>
                                <td>{vxmDetails.HLA_DQ1 || 'Não disponível'}</td>
                                <td>{vxmDetails.HLA_DQ2 || 'Não disponível'}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>


                <Table striped bordered hover className="table-custom">
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
                        {patientResults.map((patient) => (
                            <tr key={patient.receptor_id}>
                                <td>{patient.receptor_name || 'Nome não disponível'}</td>
                                {allAlleles.map((allele) => {
                                    const match = patient.allele_results?.find((a) => a.allele_name === allele);
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

export default VxmDetails;
