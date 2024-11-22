import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Appointments.css';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await api.getAppointments();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching appointments');
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await api.cancelAppointment(appointmentId);
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setError('Error cancelling appointment');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="appointment-list-container">
      <div className="appointment-list-header">
        <h2>Appointments</h2>
        <button 
          className="btn primary"
          onClick={() => navigate('/appointments/new')}
        >
          <i className="fas fa-plus"></i> Book Appointment
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      
      <div className="appointments-grid">
        {appointments.map(appointment => (
          <div key={appointment.appointment_id} className="appointment-card">
            <div className="appointment-header">
              <h3>Appointment Details</h3>
              <span className={`status ${appointment.status ? appointment.status.toLowerCase() : ''}`}>
                {appointment.status || 'N/A'}
              </span>
            </div>
            <div className="appointment-info">
              <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment.appointment_time}</p>
              <p><strong>Doctor:</strong> {appointment.doctor_name || 'Not assigned'}</p>
              <p><strong>Patient:</strong> {appointment.patient_name || 'Not assigned'}</p>
              <p><strong>Reason:</strong> {appointment.reason || 'No reason provided'}</p>
            </div>
            <div className="appointment-actions">
              {(!appointment.status || appointment.status !== 'cancelled') && (
                <>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/appointments/${appointment.appointment_id}/edit`)}
                  >
                    <i className="fas fa-edit"></i> Modify
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this appointment?')) {
                        handleCancel(appointment.appointment_id);
                      }
                    }}
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;