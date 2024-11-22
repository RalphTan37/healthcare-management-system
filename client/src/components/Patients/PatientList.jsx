import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import ConfirmationDialog from '../Common/ConfirmationDialog';
import './Patients.css';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

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
    }
  };

  const handleDelete = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteDialog(true);
    setDeleteError(''); // Clear any previous delete errors
  };

  const confirmDelete = async () => {
    try {
      await api.deletePatient(patientToDelete.patient_id);
      setShowDeleteDialog(false);
      setPatientToDelete(null);
      setDeleteError('');
      // Show success message (optional)
      // setSuccessMessage('Patient deleted successfully');
      await fetchPatients(); // Refresh the list
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Error deleting patient'
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>Patients Directory</h2>
        <button 
          className="btn primary"
          onClick={() => navigate('/patients/new')}
        >
          Add New Patient
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.patient_id}>
                <td>{`${patient.first_name} ${patient.last_name}`}</td>
                <td>{patient.gender}</td>
                <td>{new Date(patient.date_of_birth).toLocaleDateString()}</td>
                <td>
                  <div>{patient.email}</div>
                  <div>{patient.phone}</div>
                </td>
                <td className="action-buttons">
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/patients/${patient.patient_id}`)}
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/patients/${patient.patient_id}/edit`)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(patient)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        message={
          <>
            <p>Are you sure you want to delete patient {patientToDelete?.first_name} {patientToDelete?.last_name}?</p>
            <p>This action cannot be undone.</p>
            {deleteError && <p className="error-message">{deleteError}</p>}
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setPatientToDelete(null);
          setDeleteError('');
        }}
      />
    </div>
  );
};

export default PatientList;