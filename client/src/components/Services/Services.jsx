import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  return (
    <div className="services-container">
      <section className="services-header">
        <h1>Our Services</h1>
        <p>Comprehensive Healthcare Management Solutions</p>
      </section>

      <section className="services-content">
        <div className="main-services">
          <div className="service-card">
            <i className="fas fa-user-md"></i>
            <h3>Doctor Consultations</h3>
            <p>Book appointments with our experienced healthcare professionals.</p>
            <ul>
              <li>Online Booking</li>
              <li>Specialist Referrals</li>
              <li>Follow-up Care</li>
              <li>Telemedicine Options</li>
            </ul>
            <Link to="/appointments" className="btn primary">Book Now</Link>
          </div>

          <div className="service-card">
            <i className="fas fa-heartbeat"></i>
            <h3>Emergency Care</h3>
            <p>24/7 emergency medical services with quick response times.</p>
            <ul>
              <li>Immediate Response</li>
              <li>Critical Care</li>
              <li>Ambulance Service</li>
              <li>Emergency Surgery</li>
            </ul>
            <Link to="/contact" className="btn primary">Contact Emergency</Link>
          </div>

          <div className="service-card">
            <i className="fas fa-flask"></i>
            <h3>Laboratory Services</h3>
            <p>Comprehensive diagnostic and testing facilities.</p>
            <ul>
              <li>Blood Tests</li>
              <li>Diagnostic Imaging</li>
              <li>Pathology Services</li>
              <li>Quick Results</li>
            </ul>
            <Link to="/appointments" className="btn primary">Schedule Test</Link>
          </div>

          <div className="service-card">
            <i className="fas fa-pills"></i>
            <h3>Pharmacy Services</h3>
            <p>Full-service pharmacy with prescription management.</p>
            <ul>
              <li>Prescription Filling</li>
              <li>Medication Counseling</li>
              <li>Refill Management</li>
              <li>Home Delivery</li>
            </ul>
            <Link to="/contact" className="btn primary">Learn More</Link>
          </div>
        </div>

        <div className="specialized-services">
          <h2>Specialized Care</h2>
          <div className="specialized-grid">
            <div className="specialized-card">
              <i className="fas fa-heart"></i>
              <h3>Cardiology</h3>
              <p>Comprehensive heart care and treatments</p>
            </div>
            <div className="specialized-card">
              <i className="fas fa-brain"></i>
              <h3>Neurology</h3>
              <p>Expert neurological care and treatments</p>
            </div>
            <div className="specialized-card">
              <i className="fas fa-bone"></i>
              <h3>Orthopedics</h3>
              <p>Specialized bone and joint care</p>
            </div>
            <div className="specialized-card">
              <i className="fas fa-child"></i>
              <h3>Pediatrics</h3>
              <p>Dedicated children's healthcare services</p>
            </div>
          </div>
        </div>

        <div className="service-features">
          <h2>Additional Features</h2>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-mobile-alt"></i>
              <h3>Mobile App</h3>
              <p>Manage appointments and prescriptions on the go</p>
            </div>
            <div className="feature">
              <i className="fas fa-clipboard-check"></i>
              <h3>Online Reports</h3>
              <p>Access your medical reports online</p>
            </div>
            <div className="feature">
              <i className="fas fa-comments"></i>
              <h3>24/7 Support</h3>
              <p>Always available to assist you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;