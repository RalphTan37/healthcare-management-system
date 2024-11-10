import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <h1>HMS</h1>
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li>
            <Link to="/patients">
              <i className="fas fa-user-injured"></i> Patients
            </Link>
          </li>
          <li>
            <Link to="/appointments">
              <i className="fas fa-calendar-check"></i> Appointments
            </Link>
          </li>
          <li>
            <Link to="/doctors">
              <i className="fas fa-user-md"></i> Doctors
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <i className="fas fa-envelope"></i> Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;