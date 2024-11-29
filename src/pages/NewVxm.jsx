import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import Select from 'react-select';
import api from '../api'; // Cliente configurado
import { useNavigate } from 'react-router-dom';

function NewVxm() {
  const [formData, setFormData] = useState({
    donorName: '',
    rgct: '',
    donorBirthDate: '',
    donorBloodType: '',
    hlaA1: '',
    hlaA2: '',
    hlaB1: '',
    hlaB2: '',
    hlaC1: '',
    hlaC2: '',
    hlaDR1: '',
    hlaDR2: '',
    hlaDQ1: '',
    hlaDQ2: '',
  });
  const [errors, setErrors] = useState({});
  const [receptors, setReceptors] = useState([]);
  const [selectedReceptors, setSelectedReceptors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/receptores/')
      .then((response) => {
        const options = response.data.map((receptor) => ({
          value: receptor.id,
          label: `${receptor.nome} (${receptor.id_hcpa || 'Sem ID HCPA'})`,
        }));
        setReceptors(options);
      })
      .catch((error) => console.error('Erro ao buscar receptores:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleReceptorSelect = (selectedOptions) => {
    setSelectedReceptors(selectedOptions || []);
  };

  const removeReceptor = (id) => {
    setSelectedReceptors((prevSelected) =>
      prevSelected.filter((receptor) => receptor.value !== id)
    );
  };

  const handleRemoveReceptor = (id) => {
    removeReceptor(id);
    setSelectedReceptors((prevSelected) =>
      prevSelected.filter((receptor) => receptor.value !== id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedReceptors.length === 0) {
      alert('Por favor, selecione pelo menos um receptor.');
      return;
    }

    const alelosEspecificos = [
      { tipo: 'A', numero: formData.hlaA1 },
      { tipo: 'A', numero: formData.hlaA2 },
      { tipo: 'B', numero: formData.hlaB1 },
      { tipo: 'B', numero: formData.hlaB2 },
      { tipo: 'C', numero: formData.hlaC1 },
      { tipo: 'C', numero: formData.hlaC2 },
      { tipo: 'DR', numero: formData.hlaDR1 },
      { tipo: 'DR', numero: formData.hlaDR2 },
      { tipo: 'DQ', numero: formData.hlaDQ1 },
      { tipo: 'DQ', numero: formData.hlaDQ2 },
    ].filter((alelo) => alelo.numero);

    const donorHLAs = alelosEspecificos.map((alelo) => ({
      tipo: alelo.tipo,
      numero: parseInt(alelo.numero, 10),
    }));

    const donorData = {
      donor_name: formData.donorName,
      rgct: formData.rgct,
      donor_birth_date: formData.donorBirthDate || null,
      donor_blood_type: formData.donorBloodType || null,
      alelos: alelosEspecificos,
      selected_receptors: selectedReceptors.map((receptor) => receptor.value),
    };

    try {
      const virtualCrossmatchResponse = await api.post('/api/newvxm/virtual_crossmatch/', donorData);

      if (virtualCrossmatchResponse.data.message) {
        alert(virtualCrossmatchResponse.data.message);
        return;
      }

      if (Object.keys(virtualCrossmatchResponse.data).length === 0) {
        alert('Nenhum receptor compatível encontrado.');
        return;
      }

      const crossmatchResults = virtualCrossmatchResponse.data;

      const saveResponse = await api.post('/api/save_crossmatch_result/', {
        rgct: donorData.rgct,
        donor_name: donorData.donor_name,
        donor_birth_date: donorData.donor_birth_date,
        donor_blood_type: donorData.donor_blood_type,
        donor_hlas: donorHLAs,
        results: crossmatchResults,
      });

      if (saveResponse.status === 201) {
        alert('Crossmatch salvo com sucesso!');
        navigate('/vxm-results', { state: { results: saveResponse.data } });
      }
    } catch (error) {
      console.error('Erro ao processar o virtual crossmatch ou salvar resultados:', error);
      alert('Erro ao realizar o crossmatch ou salvar os resultados.');
    }
  };

  return (
    <div className="container mt-4 p-4 shadow-sm rounded bg-white">
      <h4 className="text-center mb-4">Nova Prova Cruzada Virtual</h4>
      <Form>
        <div className="mb-4">
          <h5>Informações do Doador</h5>
          <hr />
          <Row>
            <Col md={6}>
              <Form.Group controlId="donorName" className="mb-3">
                <Form.Label>Nome Completo *</Form.Label>
                <Form.Control
                  type="text"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleChange}
                  isInvalid={!!errors.donorName}
                />
                <Form.Control.Feedback type="invalid">{errors.donorName}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="rgct" className="mb-3">
                <Form.Label>RGCT *</Form.Label>
                <Form.Control
                  type="text"
                  name="rgct"
                  value={formData.rgct}
                  onChange={handleChange}
                  isInvalid={!!errors.rgct}
                />
                <Form.Control.Feedback type="invalid">{errors.rgct}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="donorBirthDate" className="mb-3">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  name="donorBirthDate"
                  value={formData.donorBirthDate}
                  onChange={handleChange}
                  isInvalid={!!errors.donorBirthDate}
                />
                <Form.Control.Feedback type="invalid">{errors.donorBirthDate}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="donorBloodType" className="mb-3">
                <Form.Label>Tipo Sanguíneo</Form.Label>
                <Form.Select
                  name="donorBloodType"
                  value={formData.donorBloodType}
                  onChange={handleChange}
                  isInvalid={!!errors.donorBloodType}
                >
                  <option value="">Selecione...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.donorBloodType}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div>
          <h5>Informações HLA</h5>
          <hr />
          <Row>
            <Col md={6}>
              {['hlaA1', 'hlaB1', 'hlaC1', 'hlaDR1', 'hlaDQ1'].map((field) => (
                <Form.Group controlId={field} key={field} className="mb-3">
                  <Form.Label>{`HLA ${field.slice(3, -1).toUpperCase()}(1) *`}</Form.Label>
                  <Form.Control
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    isInvalid={!!errors[field]}
                  />
                  <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
                </Form.Group>
              ))}
            </Col>
            <Col md={6}>
              {['hlaA2', 'hlaB2', 'hlaC2', 'hlaDR2', 'hlaDQ2'].map((field) => (
                <Form.Group controlId={field} key={field} className="mb-3">
                  <Form.Label>{`HLA ${field.slice(3, -1).toUpperCase()}(2) *`}</Form.Label>
                  <Form.Control
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    isInvalid={!!errors[field]}
                  />
                  <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
                </Form.Group>
              ))}
            </Col>
          </Row>
        </div>
        <div className="mt-4">
          <h5>Selecionar Receptores</h5>
          <hr />
          <Form.Group controlId="receptorSearch" className="mb-3">
            <Select
              options={receptors}
              isMulti
              closeMenuOnSelect={false}
              onChange={handleReceptorSelect}
              placeholder="Pesquisar receptores..."
              controlShouldRenderValue={false}
              value={selectedReceptors}
            />
          </Form.Group>
          {selectedReceptors.length > 0 && (
            <div className="mt-3">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReceptors.map((receptor) => (
                    <tr key={receptor.value}>
                      <td>{receptor.label}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveReceptor(receptor.value)}
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
        <div className="text-center mt-4">
          <Button variant="success" size="lg" onClick={handleSubmit}>
            Fazer Novo VXM
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default NewVxm;
