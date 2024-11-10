import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div>
      <section id="home" className="hero-section">
        <h1>Welcome to Healthcare Management System</h1>
        <p>Streamlining healthcare services for better patient care</p>
        <div className="cta-buttons">
          <button className="btn primary">Book Appointment</button>
          <button className="btn secondary">Patient Portal</button>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2>Our Services</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-user-clock"></i>
            <h3>Appointment Scheduling</h3>
            <p>Easy online booking system</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-notes-medical"></i>
            <h3>Patient Records</h3>
            <p>Secure electronic health records</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-hospital-user"></i>
            <h3>Doctor Management</h3>
            <p>Efficient staff scheduling</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-flask"></i>
            <h3>Lab Management</h3>
            <p>Track tests and results</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <div className="contact-form">
          <form id="contactForm">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" className="btn primary">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;