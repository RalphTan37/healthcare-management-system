import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Patients.css';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching patients');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>Patient Directory</h2>
        <button 
          className="btn primary"
          onClick={() => navigate('/patients/new')}
        >
          Add New Patient
        </button>
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr key={patient.patient_id}>
                <td>{patient.patient_id}</td>
                <td>{`${patient.first_name} ${patient.last_name}`}</td>
                <td>{new Date(patient.date_of_birth).toLocaleDateString()}</td>
                <td>{patient.gender}</td>
                <td>{patient.phone}</td>
                <td>
                  <button 
                    className="btn-view"
                    onClick={() => navigate(`/patients/${patient.patient_id}`)}
                  >
                    View
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => navigate(`/patients/${patient.patient_id}/edit`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;