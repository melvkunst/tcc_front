import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import api from '../api'; // Cliente configurado
import { useNavigate } from 'react-router-dom';

function NewVxm() {
  const [formData, setFormData] = useState({
    donorName: '',
    donorSex: '',
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
  const navigate = useNavigate();

  const validateField = (name, value) => {
    if (!value.trim()) {
      return 'Este campo é obrigatório.';
    }
    if (name === 'donorName') {
      const nameParts = value.trim().split(' ');
      if (nameParts.length < 2) {
        return 'O nome do doador deve conter nome e sobrenome.';
      }
    }
    if (name.startsWith('hla')) {
      const numberValue = parseInt(value, 10);
      if (isNaN(numberValue) || numberValue < 0 || numberValue > 99) {
        return 'O valor do HLA deve estar entre 0 e 99.';
      }
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const errorMessage = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) formErrors[field] = error;
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
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

    const donorData = {
      donor_name: formData.donorName,
      donor_sex: formData.donorSex,
      donor_birth_date: formData.donorBirthDate,
      donor_blood_type: formData.donorBloodType,
    };

    try {
      const response = await api.post('api/newvxm/virtual_crossmatch/', {
        ...donorData,
        alelos: alelosEspecificos,
      });

      if (response.data.message) {
        navigate('/vxm-results', { state: { errorMessage: response.data.message } });
      } else if (Object.keys(response.data).length === 0) {
        navigate('/vxm-results', { state: { errorMessage: 'Nenhum paciente compatível encontrado.' } });
      } else {
        await saveResults(response.data, donorData);
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      alert('Erro ao processar o virtual crossmatch.');
    }
  };

  const saveResults = async (results, donorData) => {
    try {
      const saveResponse = await api.post('api/save_crossmatch_result/', {
        ...donorData,
        results,
      });
      console.log('API Save Response:', saveResponse.data); // Log para verificar os dados
      alert('Resultados salvos com sucesso!');
      navigate('/vxm-results', { state: { results: saveResponse.data } });
    } catch (error) {
      console.error('Erro ao salvar os resultados:', error);
      alert('Erro ao salvar os resultados. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div className="container mt-4 p-4 shadow-sm rounded bg-white">
      <h4 className="text-center mb-4">Novo Virtual Crossmatch</h4>
      <Form>
        <div className="mb-4">
          <h5>Informações Pessoais</h5>
          <hr />
          <Row>
            <Col md={6}>
              <Form.Group controlId="donorName" className="mb-3">
                <Form.Label>Nome Completo</Form.Label>
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
              <Form.Group controlId="donorSex" className="mb-3">
                <Form.Label>Sexo</Form.Label>
                <Form.Select
                  name="donorSex"
                  value={formData.donorSex}
                  onChange={handleChange}
                  isInvalid={!!errors.donorSex}
                >
                  <option value="">Selecione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.donorSex}</Form.Control.Feedback>
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
            {/* Coluna para os campos terminando com (1) */}
            <Col md={6}>
              {['hlaA1', 'hlaB1', 'hlaC1', 'hlaDR1', 'hlaDQ1'].map((field) => (
                <Form.Group controlId={field} key={field} className="mb-3">
                  <Form.Label>{`HLA ${field.charAt(3).toUpperCase()}(1)`}</Form.Label>
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

            {/* Coluna para os campos terminando com (2) */}
            <Col md={6}>
              {['hlaA2', 'hlaB2', 'hlaC2', 'hlaDR2', 'hlaDQ2'].map((field) => (
                <Form.Group controlId={field} key={field} className="mb-3">
                  <Form.Label>{`HLA ${field.charAt(3).toUpperCase()}(2)`}</Form.Label>
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
