import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-header">
        <h1>About Healthcare Management System</h1>
        <p>Providing Quality Healthcare Solutions Since 2024</p>
      </section>

      <section className="about-content">
        <div className="mission-vision">
          <div className="mission">
            <h2><i className="fas fa-bullseye"></i> Our Mission</h2>
            <p>To provide efficient and effective healthcare management solutions that enhance the quality of patient care and streamline medical operations.</p>
          </div>
          <div className="vision">
            <h2><i className="fas fa-eye"></i> Our Vision</h2>
            <p>To become the leading healthcare management system, revolutionizing the way healthcare services are delivered and managed.</p>
          </div>
        </div>

        <div className="values">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-heart"></i>
              <h3>Patient-Centric</h3>
              <p>Putting patients' needs and well-being at the center of everything we do.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Integrity</h3>
              <p>Maintaining the highest standards of professional and ethical behavior.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-chart-line"></i>
              <h3>Innovation</h3>
              <p>Continuously improving and adapting to new healthcare technologies.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-users"></i>
              <h3>Collaboration</h3>
              <p>Working together with healthcare providers and patients for better outcomes.</p>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-laptop-medical"></i>
              <h3>Modern Technology</h3>
              <p>State-of-the-art healthcare management solutions</p>
            </div>
            <div className="feature">
              <i className="fas fa-user-shield"></i>
              <h3>Data Security</h3>
              <p>Advanced security measures to protect patient information</p>
            </div>
            <div className="feature">
              <i className="fas fa-clock"></i>
              <h3>24/7 Support</h3>
              <p>Round-the-clock technical support and assistance</p>
            </div>
          </div>
        </div>

        <div className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                <i className="fas fa-user-circle"></i>
              </div>
              <h3>Dr. Sarah Johnson</h3>
              <p>Medical Director</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <i className="fas fa-user-circle"></i>
              </div>
              <h3>James Wilson</h3>
              <p>Technical Lead</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <i className="fas fa-user-circle"></i>
              </div>
              <h3>Emily Brown</h3>
              <p>Patient Care Coordinator</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;