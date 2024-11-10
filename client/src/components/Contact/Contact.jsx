import React, { useState } from 'react';
import { api } from '../../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });
    
    try {
      // In a real application, you would send this to your backend
      console.log('Form submitted:', formData);
      setStatus({ 
        type: 'success', 
        message: 'Thank you for your message. We will get back to you soon!' 
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: 'Failed to send message. Please try again.' 
      });
    }
  };

  return (
    <div className="contact-container">
      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us for any questions or concerns</p>
      </section>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <i className="fas fa-map-marker-alt"></i>
            <h3>Our Location</h3>
            <p>123 Healthcare Ave</p>
            <p>Medical District</p>
            <p>City, State 12345</p>
          </div>

          <div className="info-card">
            <i className="fas fa-phone"></i>
            <h3>Phone Numbers</h3>
            <p>Main: (555) 123-4567</p>
            <p>Emergency: (555) 987-6543</p>
            <p>Fax: (555) 123-4568</p>
          </div>

          <div className="info-card">
            <i className="fas fa-envelope"></i>
            <h3>Email</h3>
            <p>info@hms.com</p>
            <p>support@hms.com</p>
            <p>appointments@hms.com</p>
          </div>

          <div className="info-card">
            <i className="fas fa-clock"></i>
            <h3>Working Hours</h3>
            <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p>Saturday: 9:00 AM - 3:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {status.message && (
            <div className={`alert ${status.type}`}>
              {status.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="btn primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;