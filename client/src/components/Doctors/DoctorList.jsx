import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Doctors.css';

const DoctorList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await api.getDoctors();
      setDoctors(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching doctors');
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.first_name} ${doctor.last_name} ${doctor.specialization}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="doctor-list-container">
      <div className="doctor-list-header">
        <h2>Doctor Directory</h2>
        <button 
          className="btn primary"
          onClick={() => navigate('/doctors/new')}
        >
          Add New Doctor
        </button>
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="doctors-grid">
        {filteredDoctors.map(doctor => (
          <div key={doctor.doctor_id} className="doctor-card">
            <div className="doctor-avatar">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="doctor-info">
              <h3>{`Dr. ${doctor.first_name} ${doctor.last_name}`}</h3>
              <p className="specialization">{doctor.specialization}</p>
              <p className="contact-info">
                <i className="fas fa-envelope"></i> {doctor.email}
              </p>
              <p className="contact-info">
                <i className="fas fa-phone"></i> {doctor.phone}
              </p>
            </div>
            <div className="doctor-actions">
              <button 
                className="btn-view"
                onClick={() => navigate(`/doctors/schedule/${doctor.doctor_id}`)}
              >
                <i className="fas fa-calendar"></i> View Schedule
              </button>
              <button 
                className="btn-edit"
                onClick={() => navigate(`/doctors/${doctor.doctor_id}/edit`)}
              >
                <i className="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;