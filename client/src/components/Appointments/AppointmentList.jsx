import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Appointments.css';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('upcoming'); // upcoming, past, all

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

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await api.cancelAppointment(appointmentId);
      // Refresh the appointments list
      fetchAppointments();
    } catch (err) {
      setError('Error cancelling appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    
    switch (filter) {
      case 'upcoming':
        return appointmentDate >= today;
      case 'past':
        return appointmentDate < today;
      default:
        return true;
    }
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="appointment-list-container">
      <div className="appointment-list-header">
        <h2>Appointments</h2>
        <button 
          className="btn primary"
          onClick={() => navigate('/appointments/new')}
        >
          Book Appointment
        </button>
      </div>

      <div className="appointment-filters">
        <button 
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          Past
        </button>
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
      </div>

      <div className="appointments-grid">
        {filteredAppointments.map(appointment => (
          <div key={appointment.appointment_id} className="appointment-card">
            <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </div>
            <div className="appointment-details">
              <div className="detail-row">
                <i className="fas fa-calendar"></i>
                <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <i className="fas fa-clock"></i>
                <span>{appointment.appointment_time}</span>
              </div>
              <div className="detail-row">
                <i className="fas fa-user-md"></i>
                <span>Dr. {appointment.doctor_name}</span>
              </div>
              <div className="detail-row">
                <i className="fas fa-user"></i>
                <span>{appointment.patient_name}</span>
              </div>
              <div className="detail-row">
                <i className="fas fa-notes-medical"></i>
                <span>{appointment.reason}</span>
              </div>
            </div>
            <div className="appointment-actions">
              {appointment.status === 'scheduled' && (
                <>
                  <button 
                    className="btn-edit"
                    onClick={() => navigate(`/appointments/${appointment.appointment_id}/edit`)}
                  >
                    Modify
                  </button>
                  <button 
                    className="btn-cancel"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this appointment?')) {
                        handleCancelAppointment(appointment.appointment_id);
                      }
                    }}
                  >
                    Cancel
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