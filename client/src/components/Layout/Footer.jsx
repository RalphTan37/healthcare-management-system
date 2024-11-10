import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p><i className="fas fa-phone"></i> (555) 123-4567</p>
          <p><i className="fas fa-envelope"></i> info@hms.com</p>
          <p><i className="fas fa-location-dot"></i> 123 Healthcare Ave</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; Fall 2024 Databases - Group 12. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;