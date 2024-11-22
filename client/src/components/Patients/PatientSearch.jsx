import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Patients.css';

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Debounced search effect for live search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      handleSearch(); // Trigger search after debounce
    }, 500); // 500ms delay for debounce

    return () => clearTimeout(delayDebounceFn); // Clear debounce timeout on cleanup
  }, [searchTerm]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    try {
      const results = await api.searchPatients(searchTerm);
      setSearchResults(results);
    } catch (err) {
      setError('Error searching for patients');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-search-container">
      <div className="search-header">
        <h2>Patient Search</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {searchResults.length > 0 ? (
        <div className="search-results">
          {searchResults.map((patient) => (
            <div key={patient.patient_id} className="patient-card">
              <div className="patient-info">
                <h3>
                  {patient.first_name} {patient.last_name}
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Date of Birth:</label>
                    <span>{new Date(patient.date_of_birth).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Gender:</label>
                    <span>{patient.gender}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{patient.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{patient.phone}</span>
                  </div>
                  <div className="info-item">
                    <label>Address:</label>
                    <span>{patient.address}</span>
                  </div>
                </div>

                {patient.appointments && (
                  <div className="appointment-history">
                    <h4>Recent Appointments</h4>
                    <div className="appointment-list">
                      {patient.appointments.map((apt) => (
                        <div key={apt.appointment_id} className="appointment-item">
                          <div className="appointment-date">
                            <i className="fas fa-calendar"></i>
                            {new Date(apt.appointment_date).toLocaleDateString()}
                          </div>
                          <div className="appointment-details">
                            <span>
                              <i className="fas fa-user-md"></i> {apt.doctor_name}
                            </span>
                            <span>
                              <i className="fas fa-clock"></i> {apt.appointment_time}
                            </span>
                            <span
                              className={`status ${apt.status.toLowerCase()}`}
                            >
                              <i className="fas fa-info-circle"></i> {apt.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="patient-actions">
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/patients/${patient.patient_id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/patients/${patient.patient_id}/edit`)
                    }
                  >
                    Edit Patient
                  </button>
                  <button
                    className="btn-appointment"
                    onClick={() =>
                      navigate('/appointments/new', {
                        state: { patientId: patient.patient_id },
                      })
                    }
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          {searchTerm && !loading && 'No patients found'}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
