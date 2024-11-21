import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faFileMedical, faEdit, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import api from '../api'; // Cliente configurado

function Patients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [exams, setExams] = useState([]);
  const [uploadingPatientId, setUploadingPatientId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('api/pacientes/')
      .then((response) => {
        const fetchedPatients = response.data;
        setPatients(fetchedPatients);
        fetchedPatients.forEach((patient) => checkExamsAvailability(patient.id));
      })
      .catch((error) => console.error("Erro ao buscar dados dos pacientes: ", error));

    const savedPatientId = localStorage.getItem('selectedPatientId');
    if (savedPatientId) {
      setSelectedPatientId(savedPatientId);
      fetchExams(savedPatientId);
    }
  }, []);

  const checkExamsAvailability = (patientId) => {
    api.get(`api/pacientes/${patientId}/exames/`)
      .then((response) => {
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === patientId ? { ...patient, hasExams: response.data.length > 0 } : patient
          )
        );
      })
      .catch((error) => console.error("Erro ao verificar disponibilidade de exames: ", error));
  };

  const fetchExams = (patientId) => {
    api.get(`api/pacientes/${patientId}/exames/`)
      .then((response) => setExams(response.data))
      .catch((error) => console.error("Erro ao buscar exames do paciente: ", error));
  };

  const handleViewExams = (patientId) => {
    if (selectedPatientId === patientId) {
      setSelectedPatientId(null);
      setExams([]);
      localStorage.removeItem('selectedPatientId');
    } else {
      setSelectedPatientId(patientId);
      localStorage.setItem('selectedPatientId', patientId);
      fetchExams(patientId);
    }
  };

  const handleNewPatient = () => {
    navigate('/novo-paciente');
  };

  const handleEditPatient = (patientId) => {
    navigate(`/novo-paciente/${patientId}`);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm("Tem certeza de que deseja excluir este paciente e todos os seus exames?")) {
      axios.delete(`http://127.0.0.1:8000/api/pacientes/${patientId}/`)
        .then(() => {
          setPatients(patients.filter(patient => patient.id !== patientId));
          if (selectedPatientId === patientId) {
            setSelectedPatientId(null);
            setExams([]);
            localStorage.removeItem('selectedPatientId');
          }
          alert("Paciente deletado com sucesso.");
        })
        .catch(error => console.error("Erro ao deletar paciente:", error));
    }
  };

  const handleFileChange = (e, patientId) => {
    const file = e.target.files[0];
    const allowedExtensions = ['xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert("Por favor, selecione um arquivo Excel (.xls ou .xlsx)");
      return;
    }

    if (file) {
      handleUpload(file, patientId);
    }
  };

  const handleUpload = (file, patientId) => {
    setUploadingPatientId(patientId);
    const formData = new FormData();
    formData.append('file', file);

    axios.post(`http://127.0.0.1:8000/api/pacientes/${patientId}/exames/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(() => {
        alert("Exames importados com sucesso");
        fetchExams(patientId);
        checkExamsAvailability(patientId);
      })
      .catch(error => console.error("Erro ao importar exames:", error))
      .finally(() => setUploadingPatientId(null));
  };

  return (
    <div className="gradient-custom-1 h-100">
      <div className="mask d-flex align-items-center h-100">
        <div className="container mt-2">
          <div className="shadow-box p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Lista de Pacientes</h2>
              <Button variant="success" onClick={handleNewPatient} className="rounded-circle">
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
            <Table className="table-custom table mb-0">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data de Nascimento</th>
                  <th>Tipo Sanguíneo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <React.Fragment key={patient.id}>
                    <tr>
                      <td>{patient.nome}</td>
                      <td>{patient.data_nascimento}</td>
                      <td>{patient.tipo_sanguineo}</td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center">
                          {patient.hasExams && (
                            <FontAwesomeIcon
                              icon={faFileMedical}
                              onClick={() => handleViewExams(patient.id)}
                              className="text-success fa-icon"
                            />
                          )}
                          <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleEditPatient(patient.id)}
                            className="text-primary fa-icon"
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => handleDeletePatient(patient.id)}
                            className="text-danger fa-icon"
                          />
                          <label>
                            <FontAwesomeIcon
                              icon={faUpload}
                              className="text-info fa-icon"
                              title="Importar Exame"
                            />
                            <input
                              type="file"
                              accept=".xlsx, .xls"
                              onChange={(e) => handleFileChange(e, patient.id)}
                              style={{ display: 'none' }}
                            />
                          </label>
                          {uploadingPatientId === patient.id && (
                            <Spinner animation="border" size="sm" />
                          )}
                        </div>
                      </td>
                    </tr>
                    {Number(selectedPatientId) === patient.id && (
                      <tr className="collapsed-section">
                        <td colSpan="4">
                          <Table bordered size="sm" className="mb-0">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Data do Exame</th>
                                <th>Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exams.map((exam, index) => (
                                <tr key={exam.id}>
                                  <td>{index + 1}</td>
                                  <td>{exam.data_exame}</td>
                                  <td>
                                    <Link
                                      to={`/pacientes/${patient.id}/exames/${exam.id}`}
                                      className="custom-link-button"
                                    >
                                      <FontAwesomeIcon icon={faEye} /> Ver Completo
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patients;
