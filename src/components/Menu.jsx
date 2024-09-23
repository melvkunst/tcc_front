import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
    return (
        <nav className="sidebar bg-light vh-100">
            <h2 className="text-center my-4">VXM - HSPA</h2>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/newvxm">Novo VXM</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/searchvxm">Consultar VXM</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/pacientes">Pacientes</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/contact">Contact</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Menu;
