import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Menu({ onLogout }) {
  const location = useLocation();

  // Verifica se a rota atual corresponde a uma das rotas ativas
  const isActive = (paths) => paths.some((path) => location.pathname.startsWith(path));

  return (
    <>
      {/* Barra superior fixa */}
      <Navbar bg="light" expand="lg" className="w-100 fixed-top" style={{ zIndex: 1030 }}>
        {/* Título à esquerda */}
        <Navbar.Brand className="ms-3">
          <Link to="/" className="navbar-brand">VXM - HCPA</Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon icon={faUserCircle} size="2x" /> {/* Ícone do perfil */}
                </span>
              }
              id="profile-dropdown"
              alignRight
            >
              <NavDropdown.Item href="/profile">Ver Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout}>Logoff</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Sidebar */}
      <nav className="sidebar bg-light vh-100 mt-3 pt-4">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive(['/newvxm', '/vxm-results']) ? 'active' : ''}`} to="/newvxm">Novo VXM</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive(['/searchvxm', '/vxm-details']) ? 'active' : ''}`} to="/searchvxm">Consultar VXM</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive(['/pacientes', '/novo-paciente']) ? 'active' : ''}`} to="/pacientes">Pacientes</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive(['/about']) ? 'active' : ''}`} to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Menu;
