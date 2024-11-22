import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavLinks = () => {
    switch (user.role) {
      case 'admin':
        return (
          <>
            <li>
              <Link to="/admin">
                <i className="fas fa-dashboard"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/patients">
                <i className="fas fa-user-injured"></i> Patients
              </Link>
            </li>
            <li>
              <Link to="/doctors">
                <i className="fas fa-user-md"></i> Doctors
              </Link>
            </li>
            <li>
              <Link to="/appointments">
                <i className="fas fa-calendar-check"></i> Appointments
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <i className="fas fa-envelope"></i> Contact
              </Link>
            </li>
          </>
        );

      case 'doctor':
        return (
          <>
            <li>
              <Link to="/doctor">
                <i className="fas fa-dashboard"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/appointments">
                <i className="fas fa-calendar-check"></i> My Appointments
              </Link>
            </li>
            <li>
              <Link to="/patients">
                <i className="fas fa-user-injured"></i> My Patients
              </Link>
            </li>
          </>
        );

      case 'patient':
        return (
          <>
            <li>
              <Link to="/patient">
                <i className="fas fa-dashboard"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/appointments/new">
                <i className="fas fa-calendar-plus"></i> Book Appointment
              </Link>
            </li>
            <li>
              <Link to="/appointments">
                <i className="fas fa-calendar-check"></i> My Appointments
              </Link>
            </li>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <h1>HMS</h1>
          </Link>
        </div>
        <ul className="nav-links">
          {renderNavLinks()}
          <li className="user-menu">
            <span className="username">
              <i className="fas fa-user"></i> 
              {user?.username} ({user?.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
            <button 
              className="btn primary"
              onClick={() => navigate('/patients/search')}
            >
              <i className="fas fa-search"></i> Search Patient
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;