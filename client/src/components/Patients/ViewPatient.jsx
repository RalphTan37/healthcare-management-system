import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Patients.css';

const ViewPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await api.getPatient(id);
        setPatient(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching patient data');
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="patient-view-container">
      <div className="patient-view-card">
        <h2>Patient Details</h2>
        
        <div className="patient-info">
          <div className="info-group">
            <label>Name:</label>
            <span>{`${patient.first_name} ${patient.last_name}`}</span>
          </div>

          <div className="info-group">
            <label>Date of Birth:</label>
            <span>{new Date(patient.date_of_birth).toLocaleDateString()}</span>
          </div>

          <div className="info-group">
            <label>Gender:</label>
            <span>{patient.gender}</span>
          </div>

          <div className="info-group">
            <label>Email:</label>
            <span>{patient.email}</span>
          </div>

          <div className="info-group">
            <label>Phone:</label>
            <span>{patient.phone}</span>
          </div>

          <div className="info-group">
            <label>Address:</label>
            <span>{patient.address}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn primary"
            onClick={() => navigate(`/patients/${id}/edit`)}
          >
            Edit Patient
          </button>
          <button 
            className="btn secondary"
            onClick={() => navigate('/patients')}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;