import React, { useState } from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';

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
    crossmatchResult: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do Doador:', formData);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Novo Virtual Crossmatch - Dados do Doador</h2>
      <Tab.Container defaultActiveKey="personalInfo">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="personalInfo">Informações Pessoais</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="hlaInfo">Informações HLA</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {/* Aba 1: Informações Pessoais */}
              <Tab.Pane eventKey="personalInfo">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="donorName">Nome do Doador</label>
                    <input
                      type="text"
                      id="donorName"
                      name="donorName"
                      className="form-control"
                      value={formData.donorName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="donorSex">Sexo</label>
                    <select
                      id="donorSex"
                      name="donorSex"
                      className="form-control"
                      value={formData.donorSex}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione o Sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="donorBirthDate">Data de Nascimento</label>
                    <input
                      type="date"
                      id="donorBirthDate"
                      name="donorBirthDate"
                      className="form-control"
                      value={formData.donorBirthDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="donorBloodType">Tipo Sanguíneo</label>
                    <select
                      id="donorBloodType"
                      name="donorBloodType"
                      className="form-control"
                      value={formData.donorBloodType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione o Tipo Sanguíneo</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  
                </form>
              </Tab.Pane>

              {/* Aba 2: Informações HLA - Dividido em duas colunas */}
              <Tab.Pane eventKey="hlaInfo">
                <form onSubmit={handleSubmit}>
                  <Row>
                    {/* Coluna 1 */}
                    <Col md={6}>
                      <div className="form-group mb-3">
                        <label htmlFor="hlaA1">HLA-A(1)</label>
                        <input
                          type="text"
                          id="hlaA1"
                          name="hlaA1"
                          className="form-control"
                          value={formData.hlaA1}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="hlaB1">HLA-B(1)</label>
                        <input
                          type="text"
                          id="hlaB1"
                          name="hlaB1"
                          className="form-control"
                          value={formData.hlaB1}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="hlaC1">HLA-C(1)</label>
                        <input
                          type="text"
                          id="hlaC1"
                          name="hlaC1"
                          className="form-control"
                          value={formData.hlaC1}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="hlaDR1">HLA-DR(1)</label>
                        <input
                          type="text"
                          id="hlaDR1"
                          name="hlaDR1"
                          className="form-control"
                          value={formData.hlaDR1}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="hlaDQ1">HLA-DQ(1)</label>
                        <input
                          type="text"
                          id="hlaDQ1"
                          name="hlaDQ1"
                          className="form-control"
                          value={formData.hlaDQ1}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Col>

                    {/* Coluna 2 */}
                    <Col md={6}>
                      <div className="form-group mb-3">
                        <label htmlFor="hlaA2">HLA-A(2)</label>
                        <input
                          type="text"
                          id="hlaA2"
                          name="hlaA2"
                          className="form-control"
                          value={formData.hlaA2}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="hlaB2">HLA-B(2)</label>
                        <input
                          type="text"
                          id="hlaB2"
                          name="hlaB2"
                          className="form-control"
                          value={formData.hlaB2}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="hlaC2">HLA-C(2)</label>
                        <input
                          type="text"
                          id="hlaC2"
                          name="hlaC2"
                          className="form-control"
                          value={formData.hlaC2}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="hlaDR2">HLA-DR(2)</label>
                        <input
                          type="text"
                          id="hlaDR2"
                          name="hlaDR2"
                          className="form-control"
                          value={formData.hlaDR2}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="hlaDQ2">HLA-DQ(2)</label>
                        <input
                          type="text"
                          id="hlaDQ2"
                          name="hlaDQ2"
                          className="form-control"
                          value={formData.hlaDQ2}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Col>
                  </Row>
                
                </form>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>

        {/* Botão de Submissão */}
        <button type="submit" className="btn btn-primary btn-block mt-4" onClick={handleSubmit}>
          Enviar Dados do Doador
        </button>
      </Tab.Container>
    </div>
  );
}

export default NewVxm;
