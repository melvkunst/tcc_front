import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faFileMedical, faEdit, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import api from '../api';

function Receptores() {
  const [receptors, setReceptors] = useState([]);
  const [filteredReceptors, setFilteredReceptors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceptorId, setSelectedReceptorId] = useState(null);
  const [exams, setExams] = useState([]);
  const [uploadingReceptorId, setUploadingReceptorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('api/receptores/')
      .then((response) => {
        const fetchedReceptors = response.data.map((receptor) => ({
          ...receptor,
          hasExams: false, // Inicializa hasExams como false
        }));
        setReceptors(fetchedReceptors);
        setFilteredReceptors(fetchedReceptors);
        fetchedReceptors.forEach((receptor) => checkExamsAvailability(receptor.id));
      })
      .catch((error) => console.error("Erro ao buscar dados dos receptores: ", error));
  
    const savedReceptorId = localStorage.getItem('selectedReceptorId');
    if (savedReceptorId) {
      setSelectedReceptorId(savedReceptorId);
      fetchExams(savedReceptorId);
    }
  }, []);
  

  const checkExamsAvailability = async (receptorId) => {
    try {
      const response = await api.get(`api/receptores/${receptorId}/exames/`);
      setReceptors((prevReceptors) =>
        prevReceptors.map((receptor) =>
          receptor.id === receptorId ? { ...receptor, hasExams: response.data.length > 0 } : receptor
        )
      );
      setFilteredReceptors((prevFiltered) =>
        prevFiltered.map((receptor) =>
          receptor.id === receptorId ? { ...receptor, hasExams: response.data.length > 0 } : receptor
        )
      );
    } catch (error) {
      console.error("Erro ao verificar disponibilidade de exames: ", error);
    }
  };
  

  const fetchExams = (receptorId) => {
    api.get(`api/receptores/${receptorId}/exames/`)
      .then((response) => setExams(response.data))
      .catch((error) => console.error("Erro ao buscar exames do receptor: ", error));
  };

  const handleViewExams = (receptorId) => {
    if (selectedReceptorId === receptorId) {
      setSelectedReceptorId(null);
      setExams([]);
      localStorage.removeItem('selectedReceptorId');
    } else {
      setSelectedReceptorId(receptorId);
      localStorage.setItem('selectedReceptorId', receptorId);
      fetchExams(receptorId);
    }
  };

  const handleNewReceptor = () => {
    navigate('/novo-receptor');
  };

  const handleEditReceptor = (receptorId) => {
    navigate(`/novo-receptor/${receptorId}`);
  };

  const handleDeleteReceptor = (receptorId) => {
    if (window.confirm("Tem certeza de que deseja excluir este receptor e todos os seus exames?")) {
      axios.delete(`http://127.0.0.1:8000/api/receptores/${receptorId}/`)
        .then(() => {
          setReceptors(receptors.filter(receptor => receptor.id !== receptorId));
          setFilteredReceptors(filteredReceptors.filter(receptor => receptor.id !== receptorId));
          if (selectedReceptorId === receptorId) {
            setSelectedReceptorId(null);
            setExams([]);
            localStorage.removeItem('selectedReceptorId');
          }
          alert("Receptor deletado com sucesso.");
        })
        .catch(error => console.error("Erro ao deletar receptor:", error));
    }
  };

  const handleFileChange = (e, receptorId) => {
    const file = e.target.files[0];
    const allowedExtensions = ['xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert("Por favor, selecione um arquivo Excel (.xls ou .xlsx)");
      return;
    }

    if (file) {
      handleUpload(file, receptorId);
    }
  };

  const handleUpload = (file, receptorId) => {
    setUploadingReceptorId(receptorId);
    const formData = new FormData();
    formData.append('file', file);

    axios.post(`http://127.0.0.1:8000/api/receptores/${receptorId}/exames/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(() => {
        alert("Exames importados com sucesso");
        fetchExams(receptorId);
        checkExamsAvailability(receptorId);
      })
      .catch(error => console.error("Erro ao importar exames:", error))
      .finally(() => setUploadingReceptorId(null));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = receptors.filter(
      (receptor) =>
        receptor.nome.toLowerCase().includes(value) ||
        (receptor.id_hcpa && receptor.id_hcpa.toLowerCase().includes(value))
    );
    setFilteredReceptors(filtered);
  };

  return (
    <div className="gradient-custom-1 h-100">
      <div className="mask d-flex align-items-center h-100">
        <div className="container mt-2">
          <div className="shadow-box p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Lista de Receptores</h2>
              <Button variant="success" onClick={handleNewReceptor} className="rounded-circle">
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                placeholder="Pesquisar por nome ou ID HCPA..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </Form.Group>
            <Table className="table-custom table mb-0">
              <thead>
                <tr>
                  <th>ID HCPA</th>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceptors.map((receptor) => (
                  <React.Fragment key={receptor.id}>
                    <tr>
                      <td>{receptor.id_hcpa}</td>
                      <td>{receptor.nome}</td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center">
                          {receptor.hasExams && (
                            <FontAwesomeIcon
                              icon={faFileMedical}
                              onClick={() => handleViewExams(receptor.id)}
                              className="text-success fa-icon"
                            />
                          )}
                          <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleEditReceptor(receptor.id)}
                            className="text-primary fa-icon"
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => handleDeleteReceptor(receptor.id)}
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
                              onChange={(e) => handleFileChange(e, receptor.id)}
                              style={{ display: 'none' }}
                            />
                          </label>
                          {uploadingReceptorId === receptor.id && (
                            <Spinner animation="border" size="sm" />
                          )}
                        </div>
                      </td>
                    </tr>
                    {Number(selectedReceptorId) === receptor.id && (
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
                                      to={`/receptores/${receptor.id}/exames/${exam.id}`}
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

export default Receptores;
